"""
Triad server — slim, cost-conscious, and now with user accounts.

API surface:
  GET  /              → serves index.html (frontend is the whole app)
  POST /ask           → calls Claude. Requires authenticated user.
  POST /auth/signup   → create account, returns user + sets session cookie
  POST /auth/login    → log in, returns user + sets session cookie
  POST /auth/logout   → clears session
  GET  /auth/me       → returns the current user or { user: None }

  GET    /user/data         → all user data in one call (login_required)
  POST   /user/sync         → bulk upsert full localStorage store (login_required)
  POST   /user/session      → log a single completed session (login_required)
  POST   /user/achievement  → unlock a single achievement (login_required)
  POST   /user/reading      → add/update a reading list entry (login_required)
  POST   /user/plan         → save/update the user's plan (login_required)
  POST   /user/preferences  → save user preferences (login_required)
  DELETE /user/data         → GDPR right to erasure (login_required)

Storage:
  users.db (SQLite) — gitignored. Schema in init_db().

Auth model:
  - bcrypt-hashed passwords (BLOB column)
  - Flask-Login session cookies, signed with FLASK_SECRET_KEY from .env
  - 401 with {"error": "login_required"} for unauthenticated /ask calls
"""

import os
import json
import re
import random
import sqlite3
import secrets
from datetime import datetime, timedelta
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory
from flask_login import (
    LoginManager, UserMixin, login_user, logout_user, login_required, current_user,
)
import bcrypt
import anthropic
from dotenv import load_dotenv

load_dotenv(override=False)  # ANTHROPIC_API_KEY, FLASK_SECRET_KEY, optional PORT/FLASK_DEBUG

# ─────────────────────────── Whimsical name generator ───────────────────────────

WHIMSICAL_ADJECTIVES = [
    'Silent','Still','Ancient','Lunar','Solar','Golden','Misty','Deep',
    'Wild','Sacred','Serene','Radiant','Hollow','Gentle','Swift','Vital',
    'Open','Clear','Calm','Bright'
]
WHIMSICAL_NOUNS = [
    'Lotus','Flame','Sage','Breath','Wave','Peak','Root','River','Stone',
    'Wind','Path','Dawn','Tide','Grove','Spark','Veil','Shore','Ember',
    'Leaf','Stream'
]

# Specific named options — served alongside compound combos, picked randomly.
TRIAD_SPECIFIC_NAMES = [
    # Calm / Spiritual
    'Serene Dawn', 'Peaceful River', 'Golden Light', 'Sacred Breath',
    'Gentle Wind', 'Morning Mist', 'Quiet Storm', 'Silver Moon',
    'Ancient Oak', 'Crystal Clear', 'Flowing Water', 'Still Lake',
    'Warm Earth', 'Rising Sun', 'Open Sky', 'Deep Root',
    'Soft Rain', 'Pure Light', 'Tender Heart', 'Wise Soul',
    'Boundless Sea', 'Eternal Flame', 'Humble Path', 'Silent Grove',
    'Radiant Being',
    # Funny
    'Barry Breathsalot', 'Wheezy McWheeze', 'Sir Inhales-a-Lot',
    'Puffington Bear', 'Breathy McBreathface', 'Gary the Calm',
    'Karen from Yoga', 'Deeply Relaxed Derek', 'Mindful Mike from Leeds',
    'Sergeant Serenity', 'Captain Calm', 'Professor Breathwell',
    'Doctor Zen', 'Reverend Relax', 'Agent Exhale',
    'Superintendent Stillness',
    # Odd / Unexpected
    'Quantum Yogi', 'Dave from Accounting', 'Mysterious Fog',
    'Temporary Vessel', 'Unit 7', 'Unnamed Presence', 'The Algorithm',
    'Placeholder Human', 'Default User', 'Person of Interest',
    'Unknown Breather', 'Cosmic Accountant', 'Interdimensional Dan',
    'Regular Gregory', 'Surprisingly Calm Steve', 'Basically Fine Brian',
    # Downright Crazy
    'Lord Vaporlung', 'Chairman of Sighs', 'The Exhaling Avenger',
    'Grand Duchess of Breath', 'Supreme Oxygen Officer', 'Baron Von Breathe',
    'His Holiness the Inhale', 'Exalted Lungmaster', 'The Breathing Phenomenon',
    'Certified Nostril Expert', 'Licensed Air Enthusiast',
    'Professional Oxygen Consumer', 'Breathwork Overlord',
    'Sultan of Stillness', 'Admiral of the Airway',
    'Chief Executive of Exhaling', 'The Notorious B.R.E.A.T.H',
    'Lung Whisperer 3000', 'Respiration Station', 'Oxygen Connoisseur',
]

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
    PERMANENT_SESSION_LIFETIME=timedelta(days=30),
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

DB_PATH = Path(os.getenv("DATABASE_PATH", "/data/users.db"))


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

        CREATE TABLE IF NOT EXISTS user_sessions (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER NOT NULL,
            kind             TEXT    NOT NULL,
            practice_id      TEXT    NOT NULL,
            practice_title   TEXT    NOT NULL,
            duration_minutes INTEGER DEFAULT 5,
            completed_at     TEXT    NOT NULL,
            synced_at        TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS user_achievements (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id        INTEGER NOT NULL,
            achievement_id TEXT    NOT NULL,
            unlocked_at    TEXT    NOT NULL,
            UNIQUE(user_id, achievement_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS user_streaks (
            id                INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id           INTEGER NOT NULL UNIQUE,
            current_streak    INTEGER DEFAULT 0,
            longest_streak    INTEGER DEFAULT 0,
            last_session_date TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS user_reading_list (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            book_id     TEXT    NOT NULL,
            marked_read INTEGER DEFAULT 0,
            added_at    TEXT    NOT NULL,
            UNIQUE(user_id, book_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS user_plan (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL UNIQUE,
            plan_data  TEXT    NOT NULL,
            start_date TEXT,
            created_at TEXT    NOT NULL,
            updated_at TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS user_preferences (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id       INTEGER NOT NULL UNIQUE,
            theme         TEXT    DEFAULT 'light',
            sound_enabled INTEGER DEFAULT 0,
            updated_at    TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS user_events (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            email      TEXT    NOT NULL,
            event_type TEXT    NOT NULL,
            event_data TEXT,
            session_id TEXT,
            created_at TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE INDEX IF NOT EXISTS idx_user_events_user ON user_events(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);

        CREATE TABLE IF NOT EXISTS user_profiles (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id          INTEGER NOT NULL UNIQUE,
            triad_name       TEXT    UNIQUE,
            first_name       TEXT,
            surname          TEXT,
            date_of_birth    TEXT,
            bio              TEXT,
            profile_complete INTEGER DEFAULT 0,
            created_at       TEXT    NOT NULL,
            updated_at       TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        CREATE INDEX IF NOT EXISTS idx_user_profiles_triad_name ON user_profiles(triad_name);

        CREATE TABLE IF NOT EXISTS feedback (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER,
            email      TEXT,
            message    TEXT    NOT NULL,
            created_at TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS forgot_tokens (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            token      TEXT    NOT NULL UNIQUE,
            expires_at TEXT    NOT NULL,
            used       INTEGER DEFAULT 0,
            created_at TEXT    NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
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


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(".", "logo.svg", mimetype="image/svg+xml")


@app.route("/config")
def config():
    return jsonify({"googleBooksKey": os.getenv("GOOGLE_BOOKS_API_KEY", "")})


@app.route("/book-cover")
def book_cover():
    import urllib.request, urllib.parse, json as _json
    title  = request.args.get("title", "")
    author = request.args.get("author", "")
    key    = os.getenv("GOOGLE_BOOKS_API_KEY", "")
    query  = urllib.parse.quote(f"intitle:{title}+inauthor:{author}")
    url    = f"https://www.googleapis.com/books/v1/volumes?maxResults=1&q={query}&key={key}"
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            data = _json.loads(r.read())
        links = data.get("items", [{}])[0].get("volumeInfo", {}).get("imageLinks", {})
        img = links.get("thumbnail") or links.get("smallThumbnail") or ""
        img = img.replace("http://", "https://")
        return jsonify({"coverUrl": img})
    except Exception:
        return jsonify({"coverUrl": ""})


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


@app.route("/auth/forgot-password", methods=["POST"])
def auth_forgot_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        return jsonify({"success": True})
    conn = get_db()
    row = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
    if not row:
        conn.close()
        return jsonify({"success": True})
    token = secrets.token_urlsafe(32)
    now = datetime.utcnow()
    expires_at = (now + timedelta(hours=1)).isoformat() + "Z"
    conn.execute(
        "INSERT INTO forgot_tokens (user_id, token, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)",
        (row["id"], token, expires_at, now.isoformat() + "Z"),
    )
    conn.commit()
    conn.close()
    reset_url = f"/reset-password?token={token}"
    return jsonify({"success": True, "reset_url": reset_url})


@app.route("/auth/reset-password", methods=["POST"])
def auth_reset_password():
    data = request.get_json(silent=True) or {}
    token = (data.get("token") or "").strip()
    new_password = data.get("password") or ""
    if not token or not new_password:
        return jsonify({"error": "token and password required"}), 400
    conn = get_db()
    row = conn.execute(
        "SELECT id, user_id, expires_at, used FROM forgot_tokens WHERE token = ?", (token,)
    ).fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Invalid or expired reset link."}), 400
    if row["used"]:
        conn.close()
        return jsonify({"error": "This reset link has already been used."}), 400
    if datetime.utcnow().isoformat() > row["expires_at"].rstrip("Z"):
        conn.close()
        return jsonify({"error": "This reset link has expired."}), 400
    hashed = hash_password(new_password)
    conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (hashed, row["user_id"]))
    conn.execute("UPDATE forgot_tokens SET used = 1 WHERE id = ?", (row["id"],))
    conn.commit()
    conn.close()
    return jsonify({"success": True})


# ─────────────────────────── User-data helpers ───────────────────────────

def row_to_dict(row):
    """Convert a sqlite3.Row to a plain dict for JSON serialisation."""
    return dict(row) if row else None


# ─────────────────────────── Routes — user data ───────────────────────────

@app.route("/user/data", methods=["GET"])
@login_required
def user_get_data():
    uid = int(current_user.id)
    try:
        conn = get_db()

        sessions = [row_to_dict(r) for r in conn.execute(
            "SELECT * FROM user_sessions WHERE user_id = ? ORDER BY completed_at DESC", (uid,)
        ).fetchall()]

        achievements = [row_to_dict(r) for r in conn.execute(
            "SELECT * FROM user_achievements WHERE user_id = ?", (uid,)
        ).fetchall()]

        streaks = row_to_dict(conn.execute(
            "SELECT * FROM user_streaks WHERE user_id = ?", (uid,)
        ).fetchone())

        reading_list = [row_to_dict(r) for r in conn.execute(
            "SELECT * FROM user_reading_list WHERE user_id = ?", (uid,)
        ).fetchall()]

        plan = row_to_dict(conn.execute(
            "SELECT * FROM user_plan WHERE user_id = ?", (uid,)
        ).fetchone())

        preferences = row_to_dict(conn.execute(
            "SELECT * FROM user_preferences WHERE user_id = ?", (uid,)
        ).fetchone())

        conn.close()
        return jsonify({
            "sessions":     sessions,
            "achievements": achievements,
            "streaks":      streaks or {},
            "reading_list": reading_list,
            "plan":         plan,
            "preferences":  preferences or {},
        })
    except Exception as e:
        print(f"[user/data GET] error: {e}")
        return jsonify({"error": "Failed to load user data"}), 500


@app.route("/user/sync", methods=["POST"])
@login_required
def user_sync():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    try:
        conn = get_db()

        # Sessions — insert new only (dedup by user_id + practice_id + completed_at)
        for s in (data.get("sessions") or []):
            existing = conn.execute(
                "SELECT id FROM user_sessions WHERE user_id=? AND practice_id=? AND completed_at=?",
                (uid, s.get("practice_id", ""), s.get("completed_at", "")),
            ).fetchone()
            if not existing:
                conn.execute(
                    """INSERT INTO user_sessions
                       (user_id, kind, practice_id, practice_title, duration_minutes, completed_at, synced_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (uid,
                     s.get("kind", "technique"),
                     s.get("practice_id", ""),
                     s.get("practice_title", ""),
                     int(s.get("duration_minutes") or 5),
                     s.get("completed_at", now),
                     now),
                )

        # Achievements — INSERT OR IGNORE (UNIQUE constraint)
        for a in (data.get("achievements") or []):
            conn.execute(
                """INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, unlocked_at)
                   VALUES (?, ?, ?)""",
                (uid, a.get("achievement_id", ""), a.get("unlocked_at", now)),
            )

        # Streaks — upsert single row
        sk = data.get("streaks") or {}
        if sk:
            conn.execute(
                """INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_session_date)
                   VALUES (?, ?, ?, ?)
                   ON CONFLICT(user_id) DO UPDATE SET
                     current_streak=excluded.current_streak,
                     longest_streak=excluded.longest_streak,
                     last_session_date=excluded.last_session_date""",
                (uid,
                 int(sk.get("current_streak") or 0),
                 int(sk.get("longest_streak") or 0),
                 sk.get("last_session_date")),
            )

        # Reading list — upsert by book_id
        for r in (data.get("reading_list") or []):
            conn.execute(
                """INSERT INTO user_reading_list (user_id, book_id, marked_read, added_at)
                   VALUES (?, ?, ?, ?)
                   ON CONFLICT(user_id, book_id) DO UPDATE SET
                     marked_read=excluded.marked_read,
                     added_at=excluded.added_at""",
                (uid,
                 r.get("book_id", ""),
                 1 if r.get("marked_read") else 0,
                 r.get("added_at", now)),
            )

        # Plan — upsert single row
        pl = data.get("plan") or {}
        if pl:
            plan_json = pl.get("plan_data") or ""
            conn.execute(
                """INSERT INTO user_plan (user_id, plan_data, start_date, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?)
                   ON CONFLICT(user_id) DO UPDATE SET
                     plan_data=excluded.plan_data,
                     start_date=excluded.start_date,
                     updated_at=excluded.updated_at""",
                (uid, plan_json, pl.get("start_date"), now, now),
            )

        # Preferences — upsert single row
        pr = data.get("preferences") or {}
        if pr:
            conn.execute(
                """INSERT INTO user_preferences (user_id, theme, sound_enabled, updated_at)
                   VALUES (?, ?, ?, ?)
                   ON CONFLICT(user_id) DO UPDATE SET
                     theme=excluded.theme,
                     sound_enabled=excluded.sound_enabled,
                     updated_at=excluded.updated_at""",
                (uid,
                 pr.get("theme", "light"),
                 1 if pr.get("sound_enabled") else 0,
                 now),
            )

        conn.commit()
        conn.close()
        return jsonify({"success": True, "synced_at": now})
    except Exception as e:
        print(f"[user/sync] error: {e}")
        return jsonify({"error": "Sync failed"}), 500


@app.route("/user/session", methods=["POST"])
@login_required
def user_log_session():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    kind            = data.get("kind", "technique")
    practice_id     = data.get("practice_id", "")
    practice_title  = data.get("practice_title", "")
    duration        = int(data.get("duration_minutes") or 5)
    completed_at    = data.get("completed_at") or now

    if not practice_id:
        return jsonify({"error": "practice_id is required"}), 400

    try:
        conn = get_db()
        cur = conn.execute(
            """INSERT INTO user_sessions
               (user_id, kind, practice_id, practice_title, duration_minutes, completed_at, synced_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (uid, kind, practice_id, practice_title, duration, completed_at, now),
        )
        conn.commit()
        row_id = cur.lastrowid
        conn.close()
        return jsonify({"id": row_id, "success": True})
    except Exception as e:
        print(f"[user/session] error: {e}")
        return jsonify({"error": "Failed to log session"}), 500


@app.route("/user/achievement", methods=["POST"])
@login_required
def user_unlock_achievement():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    achievement_id = data.get("achievement_id", "")
    unlocked_at    = data.get("unlocked_at") or now

    if not achievement_id:
        return jsonify({"error": "achievement_id is required"}), 400

    try:
        conn = get_db()
        conn.execute(
            "INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, ?)",
            (uid, achievement_id, unlocked_at),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"[user/achievement] error: {e}")
        return jsonify({"error": "Failed to unlock achievement"}), 500


@app.route("/user/reading", methods=["POST"])
@login_required
def user_update_reading():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    book_id     = data.get("book_id", "")
    marked_read = 1 if data.get("marked_read") else 0
    added_at    = data.get("added_at") or now

    if not book_id:
        return jsonify({"error": "book_id is required"}), 400

    try:
        conn = get_db()
        conn.execute(
            """INSERT INTO user_reading_list (user_id, book_id, marked_read, added_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(user_id, book_id) DO UPDATE SET
                 marked_read=excluded.marked_read,
                 added_at=excluded.added_at""",
            (uid, book_id, marked_read, added_at),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"[user/reading] error: {e}")
        return jsonify({"error": "Failed to update reading list"}), 500


@app.route("/user/plan", methods=["POST"])
@login_required
def user_save_plan():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    plan_data  = data.get("plan_data") or ""
    start_date = data.get("start_date")

    if not plan_data:
        return jsonify({"error": "plan_data is required"}), 400

    try:
        conn = get_db()
        conn.execute(
            """INSERT INTO user_plan (user_id, plan_data, start_date, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?)
               ON CONFLICT(user_id) DO UPDATE SET
                 plan_data=excluded.plan_data,
                 start_date=excluded.start_date,
                 updated_at=excluded.updated_at""",
            (uid, plan_data, start_date, now, now),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"[user/plan] error: {e}")
        return jsonify({"error": "Failed to save plan"}), 500


@app.route("/user/preferences", methods=["POST"])
@login_required
def user_save_preferences():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    theme         = data.get("theme", "light")
    sound_enabled = 1 if data.get("sound_enabled") else 0

    try:
        conn = get_db()
        conn.execute(
            """INSERT INTO user_preferences (user_id, theme, sound_enabled, updated_at)
               VALUES (?, ?, ?, ?)
               ON CONFLICT(user_id) DO UPDATE SET
                 theme=excluded.theme,
                 sound_enabled=excluded.sound_enabled,
                 updated_at=excluded.updated_at""",
            (uid, theme, sound_enabled, now),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"[user/preferences] error: {e}")
        return jsonify({"error": "Failed to save preferences"}), 500


@app.route("/user/data", methods=["DELETE"])
@login_required
def user_delete_data():
    uid = int(current_user.id)
    try:
        conn = get_db()
        # Child rows first — every table that FKs to users(id).
        for table in (
            "user_sessions",
            "user_achievements",
            "user_streaks",
            "user_reading_list",
            "user_plan",
            "user_preferences",
            "user_profiles",
            "user_events",
            "feedback",
            "forgot_tokens",
        ):
            conn.execute(f"DELETE FROM {table} WHERE user_id = ?", (uid,))
        # Finally the parent row — removes email + password_hash so no PII remains.
        conn.execute("DELETE FROM users WHERE id = ?", (uid,))
        conn.commit()
        conn.close()
        # Drop the Flask-Login session so the now-orphan cookie can't be reused.
        try:
            logout_user()
        except Exception:
            pass
        print(f"[user/data DELETE] erased all data + account for user_id={uid}")
        return jsonify({"success": True})
    except Exception as e:
        print(f"[user/data DELETE] error: {e}")
        return jsonify({"error": "Failed to erase user data"}), 500


# ─────────────────────────── Routes — Admin ───────────────────────────

@app.route("/admin/users")
def admin_users():
    password = request.args.get('key', '')
    if password != os.getenv('ADMIN_KEY', ''):
        return {'error': 'unauthorised'}, 401
    db = get_db()
    users = db.execute('SELECT id, email, tier, created_at FROM users ORDER BY created_at DESC').fetchall()
    return {'users': [dict(u) for u in users]}


@app.route("/admin/events")
def admin_events():
    password = request.args.get('key', '')
    if password != os.getenv('ADMIN_KEY', ''):
        return {'error': 'unauthorised'}, 401
    db = get_db()
    email_filter = request.args.get('email', '')
    event_filter = request.args.get('event', '')
    limit = min(int(request.args.get('limit', 100) or 100), 1000)

    conditions, params = [], []
    if email_filter:
        conditions.append('email = ?')
        params.append(email_filter)
    if event_filter:
        conditions.append('event_type = ?')
        params.append(event_filter)
    where = ('WHERE ' + ' AND '.join(conditions)) if conditions else ''

    total = db.execute(f'SELECT COUNT(*) FROM user_events {where}', params).fetchone()[0]
    params.append(limit)
    events = db.execute(
        f'SELECT email, event_type, event_data, session_id, created_at FROM user_events {where} ORDER BY created_at DESC LIMIT ?',
        params
    ).fetchall()
    return {'total': total, 'events': [dict(e) for e in events]}


@app.route("/admin/summary")
def admin_summary():
    password = request.args.get('key', '')
    if password != os.getenv('ADMIN_KEY', ''):
        return {'error': 'unauthorised'}, 401
    db = get_db()
    today = datetime.utcnow().date().isoformat()

    total_users           = db.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    total_events          = db.execute('SELECT COUNT(*) FROM user_events').fetchone()[0]
    events_today          = db.execute('SELECT COUNT(*) FROM user_events WHERE created_at >= ?', (today,)).fetchone()[0]
    sessions_completed    = db.execute("SELECT COUNT(*) FROM user_events WHERE event_type='session_completed'").fetchone()[0]
    achievements_unlocked = db.execute("SELECT COUNT(*) FROM user_events WHERE event_type='achievement_unlocked'").fetchone()[0]
    plans_created         = db.execute("SELECT COUNT(*) FROM user_events WHERE event_type='plan_created'").fetchone()[0]
    searches_performed    = db.execute("SELECT COUNT(*) FROM user_events WHERE event_type='search_performed'").fetchone()[0]

    # Aggregate practice counts from JSON event_data
    session_rows = db.execute("SELECT event_data FROM user_events WHERE event_type='session_completed'").fetchall()
    tech_counts, medit_counts = {}, {}
    for row in session_rows:
        try:
            d = json.loads(row['event_data'] or '{}')
            pid = d.get('practice_id', '')
            if d.get('kind') == 'technique':
                tech_counts[pid] = tech_counts.get(pid, 0) + 1
            elif d.get('kind') == 'meditation':
                medit_counts[pid] = medit_counts.get(pid, 0) + 1
        except Exception:
            pass
    top_techniques  = sorted([{'practice_id': k, 'count': v} for k, v in tech_counts.items()],  key=lambda x: -x['count'])[:10]
    top_meditations = sorted([{'practice_id': k, 'count': v} for k, v in medit_counts.items()], key=lambda x: -x['count'])[:10]

    book_rows = db.execute("SELECT event_data FROM user_events WHERE event_type='library_item_opened'").fetchall()
    book_counts = {}
    for row in book_rows:
        try:
            d = json.loads(row['event_data'] or '{}')
            if d.get('type') == 'book':
                bid = d.get('id', '')
                book_counts[bid] = book_counts.get(bid, 0) + 1
        except Exception:
            pass
    top_books = sorted([{'book_id': k, 'count': v} for k, v in book_counts.items()], key=lambda x: -x['count'])[:10]

    aff_rows = db.execute("SELECT event_data FROM user_events WHERE event_type='affiliate_click'").fetchall()
    aff_counts = {}
    for row in aff_rows:
        try:
            d = json.loads(row['event_data'] or '{}')
            key = (d.get('book_id', ''), d.get('link_type', ''))
            aff_counts[key] = aff_counts.get(key, 0) + 1
        except Exception:
            pass
    top_affiliate_clicks = sorted(
        [{'book_id': k[0], 'link_type': k[1], 'count': v} for k, v in aff_counts.items()],
        key=lambda x: -x['count']
    )[:10]

    most_active_users = db.execute(
        'SELECT email, COUNT(*) as event_count FROM user_events GROUP BY user_id ORDER BY event_count DESC LIMIT 10'
    ).fetchall()

    daily_active_users_7days = db.execute(
        """SELECT date(created_at) as date, COUNT(DISTINCT user_id) as count
           FROM user_events WHERE created_at >= date('now','-6 days')
           GROUP BY date(created_at) ORDER BY date"""
    ).fetchall()

    return {
        'total_users':              total_users,
        'total_events':             total_events,
        'events_today':             events_today,
        'top_techniques':           top_techniques,
        'top_meditations':          top_meditations,
        'top_books':                top_books,
        'top_affiliate_clicks':     top_affiliate_clicks,
        'most_active_users':        [dict(u) for u in most_active_users],
        'sessions_completed':       sessions_completed,
        'achievements_unlocked':    achievements_unlocked,
        'plans_created':            plans_created,
        'searches_performed':       searches_performed,
        'daily_active_users_7days': [dict(d) for d in daily_active_users_7days],
    }


@app.route("/track", methods=["POST"])
@login_required
def track_event():
    try:
        data = request.get_json(silent=True) or {}
        event_type = str(data.get('event_type', ''))
        event_data = data.get('event_data', {})
        session_id = str(data.get('session_id', ''))
        if not event_type:
            return {'success': True}
        db = get_db()
        db.execute(
            'INSERT INTO user_events (user_id, email, event_type, event_data, session_id, created_at) VALUES (?,?,?,?,?,?)',
            (current_user.id, current_user.email, event_type,
             json.dumps(event_data) if event_data else None,
             session_id, datetime.utcnow().isoformat())
        )
        db.commit()
    except Exception:
        pass
    return {'success': True}


# ─────────────────────────── Routes — user profile ───────────────────────────

@app.route("/user/profile", methods=["GET"])
@login_required
def user_get_profile():
    uid = int(current_user.id)
    try:
        conn = get_db()
        row = conn.execute("SELECT * FROM user_profiles WHERE user_id = ?", (uid,)).fetchone()
        conn.close()
        return jsonify({"profile": row_to_dict(row) or {}})
    except Exception as e:
        print(f"[user/profile GET] error: {e}")
        return jsonify({"error": "Failed to load profile"}), 500


@app.route("/user/profile", methods=["POST"])
@login_required
def user_save_profile():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    triad_name    = (data.get("triad_name") or "").strip()
    first_name    = (data.get("first_name") or "").strip()
    surname       = (data.get("surname") or "").strip()
    date_of_birth = (data.get("date_of_birth") or "").strip()
    bio           = (data.get("bio") or "").strip()

    if triad_name:
        if not re.match(r'^[a-zA-Z0-9 ]{3,30}$', triad_name):
            return jsonify({"error": "Triad name must be 3–30 alphanumeric characters (spaces allowed)."}), 400

    try:
        conn = get_db()

        if triad_name:
            existing = conn.execute(
                "SELECT user_id FROM user_profiles WHERE triad_name = ? AND user_id != ?",
                (triad_name, uid)
            ).fetchone()
            if existing:
                conn.close()
                return jsonify({"error": "name_taken"}), 409

        profile_complete = 1 if first_name else 0

        conn.execute(
            """INSERT INTO user_profiles
               (user_id, triad_name, first_name, surname, date_of_birth, bio, profile_complete, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(user_id) DO UPDATE SET
                 triad_name=COALESCE(NULLIF(excluded.triad_name,''), triad_name),
                 first_name=excluded.first_name,
                 surname=excluded.surname,
                 date_of_birth=excluded.date_of_birth,
                 bio=excluded.bio,
                 profile_complete=excluded.profile_complete,
                 updated_at=excluded.updated_at""",
            (uid, triad_name or None, first_name, surname, date_of_birth, bio, profile_complete, now, now),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM user_profiles WHERE user_id = ?", (uid,)).fetchone()
        conn.close()
        return jsonify({"success": True, "profile": row_to_dict(row)})
    except Exception as e:
        print(f"[user/profile POST] error: {e}")
        return jsonify({"error": "Failed to save profile"}), 500


# ─────────────────────────── Routes — triad name ───────────────────────────

@app.route("/triad-name/check")
def triad_name_check():
    name = (request.args.get("name") or "").strip()
    if not name:
        return jsonify({"available": False})
    conn = get_db()
    existing = conn.execute(
        "SELECT id FROM user_profiles WHERE triad_name = ?", (name,)
    ).fetchone()
    conn.close()
    return jsonify({"available": existing is None})


@app.route("/triad-name/generate")
def triad_name_generate():
    conn = get_db()
    taken = {
        row[0]
        for row in conn.execute(
            "SELECT triad_name FROM user_profiles WHERE triad_name IS NOT NULL"
        ).fetchall()
    }
    conn.close()

    combos = [f"{adj} {noun}" for adj in WHIMSICAL_ADJECTIVES for noun in WHIMSICAL_NOUNS]
    all_names = list(TRIAD_SPECIFIC_NAMES) + combos
    random.shuffle(all_names)
    for name in all_names:
        if name not in taken:
            return jsonify({"name": name})

    # Fallback: all combinations somehow taken
    import time
    return jsonify({"name": f"Triad{int(time.time())}"})


# ─────────────────────────── Routes — feedback ───────────────────────────

@app.route("/feedback", methods=["POST"])
@login_required
def submit_feedback():
    uid = int(current_user.id)
    now = datetime.utcnow().isoformat() + "Z"
    data = request.get_json(silent=True) or {}

    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "Message is required"}), 400
    if len(message) > 500:
        return jsonify({"error": "Message too long (max 500 characters)"}), 400

    try:
        conn = get_db()
        conn.execute(
            "INSERT INTO feedback (user_id, email, message, created_at) VALUES (?, ?, ?, ?)",
            (uid, current_user.email, message, now),
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except Exception as e:
        print(f"[feedback] error: {e}")
        return jsonify({"error": "Failed to submit feedback"}), 500


@app.route("/admin/feedback")
def admin_feedback():
    password = request.args.get('key', '')
    if password != os.getenv('ADMIN_KEY', ''):
        return {'error': 'unauthorised'}, 401
    db = get_db()
    rows = db.execute(
        "SELECT id, user_id, email, message, created_at FROM feedback ORDER BY created_at DESC"
    ).fetchall()
    return {'feedback': [dict(r) for r in rows]}


@app.route("/admin/reset-password")
def admin_reset_password():
    key = request.args.get('key', '')
    if key != os.getenv('ADMIN_KEY', ''):
        return {'error': 'unauthorised'}, 401
    email = request.args.get('email', '')
    new_password = request.args.get('password', '')
    if not email or not new_password:
        return {'error': 'email and password required'}, 400
    db = get_db()
    user = db.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
    if not user:
        return {'error': 'user not found'}, 404
    hashed = hash_password(new_password)
    db.execute('UPDATE users SET password_hash = ? WHERE email = ?', (hashed, email))
    db.commit()
    return {'success': True, 'message': f'Password reset for {email}'}


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
