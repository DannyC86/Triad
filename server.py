"""
Triad server — slim, cost-conscious, and now with user accounts.

API surface:
  GET  /              → serves index.html (frontend is the whole app)
  POST /ask           → calls Claude. Requires authenticated user.
  POST /auth/signup   → create account, returns user + sets session cookie
  POST /auth/login    → log in, returns user + sets session cookie
  POST /auth/logout   → clears session
  GET  /auth/me       → returns the current user or { user: None }

Storage:
  users.db (SQLite) — gitignored. Schema in init_db().

Auth model:
  - bcrypt-hashed passwords (BLOB column)
  - Flask-Login session cookies, signed with FLASK_SECRET_KEY from .env
  - 401 with {"error": "login_required"} for unauthenticated /ask calls
"""

import os
import sqlite3
import secrets
from datetime import datetime
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory
from flask_login import (
    LoginManager, UserMixin, login_user, logout_user, login_required, current_user,
)
import bcrypt
import anthropic
from dotenv import load_dotenv

load_dotenv()  # ANTHROPIC_API_KEY, FLASK_SECRET_KEY, optional PORT/FLASK_DEBUG

# ─────────────────────────── App + config ───────────────────────────

app = Flask(__name__, static_folder=".", static_url_path="")

# Session secret. Use FLASK_SECRET_KEY from .env in production so sessions
# survive restarts; fall back to a per-process random key for dev.
_secret = os.environ.get("FLASK_SECRET_KEY")
if not _secret:
    _secret = secrets.token_hex(32)
    print(
        "WARNING: FLASK_SECRET_KEY is not set. Using a random per-process key — "
        "users will be logged out whenever the server restarts. "
        "Add FLASK_SECRET_KEY=<64-hex-chars> to .env for persistent sessions."
    )
app.secret_key = _secret

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    # SESSION_COOKIE_SECURE=True,  # enable when serving behind HTTPS
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-6"
MAX_OUTPUT_TOKENS = 2048
MAX_CONTEXT_CHARS = 12000

SYSTEM_PROMPT = """You are the Triad AI coach — a warm, deeply knowledgeable guide to breathwork and meditation. You bridge ancient yogic wisdom with modern neuroscience naturally and gracefully, the way a wise teacher who has studied both traditions for decades would speak.

Tone: warm, calm, unhurried. Curious about how the person is feeling before recommending. Never clinical, never like a fitness app.

When building a personalised plan:
- Tailor practices to the user's stated goal, experience level, and time available.
- For a 30-day plan, group the days into four weekly phases: Foundation, Building, Deepening, Integration. Give each week a short overview and then list each day's 2–4 specific practices.
- Name specific techniques and meditations directly so the user can find them in the app: 4-7-8 Breathing, Box Breathing, Wim Hof Method, Buteyko Method, Nadi Shodhana, Kapalabhati, Bhramari, Ujjayi, Kumbhaka, Physiological Sigh, Body Scan, Loving-Kindness, Yoga Nidra, Trataka, Open Awareness, Mindfulness of Breath.

When answering a technique-specific question, you will be given a small <technique_context> block as authoritative reference for that practice. Draw from it directly, supplemented by your general knowledge, but don't pretend to know more than the context gives. Keep answers focused on the specific technique.

Safety: always note appropriate cautions for Wim Hof, extended kumbhaka, and Kapalabhati. Never advise breath holds in or near water. Encourage medical consultation for serious conditions before advanced practice."""


# ─────────────────────────── Database ───────────────────────────

DB_PATH = Path(__file__).parent / "users.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
            password_hash BLOB    NOT NULL,
            tier          TEXT    NOT NULL DEFAULT 'free',
            created_at    TEXT    NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """
    )
    conn.commit()
    conn.close()


init_db()


# ─────────────────────────── Flask-Login ───────────────────────────

login_manager = LoginManager()
login_manager.init_app(app)


class User(UserMixin):
    def __init__(self, row):
        # Flask-Login expects get_id() to return a string
        self.id = str(row["id"])
        self.email = row["email"]
        self.tier = row["tier"]
        self.created_at = row["created_at"]

    def to_dict(self):
        return {
            "email": self.email,
            "tier": self.tier,
            "created_at": self.created_at,
        }


@login_manager.user_loader
def load_user(user_id):
    try:
        uid = int(user_id)
    except (TypeError, ValueError):
        return None
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    return User(row) if row else None


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "login_required"}), 401


# ─────────────────────────── Password helpers ───────────────────────────

def hash_password(password: str) -> bytes:
    """Bcrypt-hash a password. Returns bytes suitable for the BLOB column."""
    # bcrypt has a 72-byte input limit; clip defensively (bcrypt 4.x warns + truncates).
    pw_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pw_bytes, bcrypt.gensalt())


def verify_password(password: str, hashed) -> bool:
    """Constant-time check of a password against a stored bcrypt hash."""
    if hashed is None:
        return False
    if isinstance(hashed, str):
        hashed = hashed.encode("utf-8")
    try:
        return bcrypt.checkpw(password.encode("utf-8")[:72], hashed)
    except (ValueError, TypeError):
        return False


# ─────────────────────────── Routes — static ───────────────────────────

@app.route("/")
def index():
    return send_from_directory(".", "index.html")


# ─────────────────────────── Routes — auth ───────────────────────────

def _valid_email(s: str) -> bool:
    s = (s or "").strip()
    # Deliberately permissive — real validation belongs at email-send time.
    return "@" in s and "." in s.split("@")[-1] and len(s) <= 254


@app.route("/auth/signup", methods=["POST"])
def auth_signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not _valid_email(email):
        return jsonify({"error": "Please enter a valid email address."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400
    if len(password) > 200:
        return jsonify({"error": "Password is too long (max 200 characters)."}), 400

    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "An account with this email already exists."}), 409

    now = datetime.utcnow().isoformat() + "Z"
    cur = conn.execute(
        "INSERT INTO users (email, password_hash, tier, created_at) VALUES (?, ?, ?, ?)",
        (email, hash_password(password), "free", now),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (cur.lastrowid,)).fetchone()
    conn.close()

    user = User(row)
    login_user(user, remember=True)
    print(f"[auth] signup ok: {email}")
    return jsonify({"user": user.to_dict()})


@app.route("/auth/login", methods=["POST"])
def auth_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not row or not verify_password(password, row["password_hash"]):
        # Same response for both cases — don't reveal whether the email exists.
        return jsonify({"error": "Invalid email or password."}), 401

    user = User(row)
    login_user(user, remember=True)
    print(f"[auth] login ok: {email}")
    return jsonify({"user": user.to_dict()})


@app.route("/auth/logout", methods=["POST"])
def auth_logout():
    if current_user.is_authenticated:
        print(f"[auth] logout: {current_user.email}")
    logout_user()
    return jsonify({"ok": True})


@app.route("/auth/me", methods=["GET"])
def auth_me():
    if not current_user.is_authenticated:
        return jsonify({"user": None})
    return jsonify({"user": current_user.to_dict()})


# ─────────────────────────── Routes — AI ───────────────────────────

@app.route("/ask", methods=["POST"])
@login_required
def ask():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body"}), 400

    messages = data.get("messages", [])
    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    for msg in messages:
        if "role" not in msg or "content" not in msg:
            return jsonify({"error": "Invalid message format"}), 400
        if msg["role"] not in ("user", "assistant"):
            return jsonify({"error": f"Invalid role: {msg['role']}"}), 400

    context = (data.get("context") or "").strip()
    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "\n…(truncated)"

    system_content = [{"type": "text", "text": SYSTEM_PROMPT}]
    if context:
        system_content.append(
            {
                "type": "text",
                "text": (
                    "<technique_context>\n"
                    f"{context}\n"
                    "</technique_context>\n\n"
                    "The block above is your authoritative reference for the specific "
                    "technique the user is asking about. Anchor your answer in it."
                ),
                "cache_control": {"type": "ephemeral"},
            }
        )

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_OUTPUT_TOKENS,
            system=system_content,
            messages=messages,
            extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"},
        )

        reply = response.content[0].text
        u = response.usage
        usage_dict = {
            "input_tokens":                getattr(u, "input_tokens", 0) or 0,
            "output_tokens":               getattr(u, "output_tokens", 0) or 0,
            "cache_creation_input_tokens": getattr(u, "cache_creation_input_tokens", 0) or 0,
            "cache_read_input_tokens":     getattr(u, "cache_read_input_tokens", 0) or 0,
        }

        print(
            f"[ask] {current_user.email} | "
            f"in: {usage_dict['input_tokens']}, "
            f"cache_creation: {usage_dict['cache_creation_input_tokens']}, "
            f"cache_read: {usage_dict['cache_read_input_tokens']}, "
            f"out: {usage_dict['output_tokens']}, "
            f"context_chars: {len(context)}"
        )

        return jsonify({"response": reply, "usage": usage_dict, "model": MODEL})

    except anthropic.APIError as e:
        print(f"Anthropic API error: {e}")
        return jsonify({"error": f"AI service error: {str(e)}"}), 502
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


# ─────────────────────────── Entry ───────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("WARNING: ANTHROPIC_API_KEY is not set. Create a .env file or export it.")
    print(f"Triad starting on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
