"""
Breathly server — slim and cost-conscious.

API surface:
  GET  /          → serves index.html (frontend is the whole app)
  POST /ask       → calls Claude with a short system prompt + optional per-request context

The big change from v1: we no longer attach the full 163K-character docs knowledge base
to every request. The frontend now owns all reference content (technique tabs, library,
profile, gamification) as static data and only calls the API for two things:

  1. My Plan generation and follow-up
  2. "Ask about this technique" — frontend ships a tiny context blob built from the
     single relevant technique's content, which we cache (cache_control: ephemeral).

Estimated input-token reduction: ~99% vs. the old knowledge-base-in-prompt approach.
"""

import os
from flask import Flask, request, jsonify, send_from_directory
import anthropic
from dotenv import load_dotenv

load_dotenv()  # loads ANTHROPIC_API_KEY (and any overrides) from .env

app = Flask(__name__, static_folder=".", static_url_path="")
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

MODEL = "claude-sonnet-4-6"
MAX_OUTPUT_TOKENS = 2048

# Short system prompt — used for every call. ~200 words.
SYSTEM_PROMPT = """You are the Breathly AI coach — a warm, deeply knowledgeable guide to breathwork and meditation. You bridge ancient yogic wisdom with modern neuroscience naturally and gracefully, the way a wise teacher who has studied both traditions for decades would speak.

Tone: warm, calm, unhurried. Curious about how the person is feeling before recommending. Never clinical, never like a fitness app.

When building a personalised plan:
- Tailor practices to the user's stated goal, experience level, and time available.
- For a 30-day plan, group the days into four weekly phases: Foundation, Building, Deepening, Integration. Give each week a short overview and then list each day's 2–4 specific practices.
- Name specific techniques and meditations directly so the user can find them in the app: 4-7-8 Breathing, Box Breathing, Wim Hof Method, Buteyko Method, Nadi Shodhana, Kapalabhati, Bhramari, Ujjayi, Kumbhaka, Physiological Sigh, Body Scan, Loving-Kindness, Yoga Nidra, Trataka, Open Awareness, Mindfulness of Breath.

When answering a technique-specific question, you will be given a small <technique_context> block as authoritative reference for that practice. Draw from it directly, supplemented by your general knowledge, but don't pretend to know more than the context gives. Keep answers focused on the specific technique.

Safety: always note appropriate cautions for Wim Hof, extended kumbhaka, and Kapalabhati. Never advise breath holds in or near water. Encourage medical consultation for serious conditions before advanced practice."""

# Hard cap on context size — keeps input tokens predictable
MAX_CONTEXT_CHARS = 12000


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/ask", methods=["POST"])
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

    # Optional per-request context. For "Ask about this technique" the frontend sends
    # only that practice's data. For plan generation, it's None.
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
                # Cache the per-technique context across follow-up turns in the same conversation
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
            "input_tokens": getattr(u, "input_tokens", 0) or 0,
            "output_tokens": getattr(u, "output_tokens", 0) or 0,
            "cache_creation_input_tokens": getattr(u, "cache_creation_input_tokens", 0) or 0,
            "cache_read_input_tokens": getattr(u, "cache_read_input_tokens", 0) or 0,
        }

        print(
            "Tokens — "
            f"input: {usage_dict['input_tokens']}, "
            f"cache_creation: {usage_dict['cache_creation_input_tokens']}, "
            f"cache_read: {usage_dict['cache_read_input_tokens']}, "
            f"output: {usage_dict['output_tokens']}, "
            f"context_chars: {len(context)}"
        )

        return jsonify({"response": reply, "usage": usage_dict, "model": MODEL})

    except anthropic.APIError as e:
        print(f"Anthropic API error: {e}")
        return jsonify({"error": f"AI service error: {str(e)}"}), 502
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("WARNING: ANTHROPIC_API_KEY is not set. Create a .env file or export it.")
    print(f"Breathly starting on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
