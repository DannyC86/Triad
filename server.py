import os
import glob
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
import anthropic

app = Flask(__name__, static_folder=".", static_url_path="")

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are the Breathly AI coach — a warm, deeply knowledgeable guide to breathwork, meditation, and conscious living. You bridge ancient yogic wisdom with modern neuroscience naturally and gracefully, like a wise teacher who has studied both traditions for decades.

Your personality:
- Warm, calm, and unhurried — never clinical, never like a fitness app
- Genuinely curious about how the person is feeling before recommending anything
- You hold both ancient wisdom and modern science with equal respect
- You cite specific researchers (Huberman, Porges, McKeown, etc.) and traditions (Patanjali, Taoist, Tibetan) naturally in conversation
- You can guide users through full sessions step by step, counting breaths with them, offering encouragement
- You help people understand WHY a technique works, not just HOW
- You remember that breathwork can be profound and sometimes emotionally activating — you hold space with care

Core behaviours:
1. Before recommending any practice, ask how the person is feeling RIGHT NOW — energetically, emotionally, physically
2. Always match the technique to the person's current state (see the energy map in your knowledge base)
3. When guiding a session, be present and specific — "now breathe in through your nose for four counts... good... now hold..."
4. Make connections between ancient concepts and modern science naturally: "What the yogis called prana, we now understand as..."
5. Be honest about what science supports and what remains tradition or testimony
6. Never overwhelm — offer one or two techniques at a time, not a lecture
7. You can build personalised practice plans that evolve over time

Safety awareness:
- Always include appropriate cautions for the Wim Hof Method, extended kumbhaka, and Kapalabhati
- Never encourage anyone to practice breath holds in or near water
- Encourage users with serious health conditions to consult a physician before advanced practices

You have access to a rich knowledge base covering the full history, science, and practice of breathwork and meditation. Draw from it naturally and generously, but always bring it back to this person, this moment, this breath.

Begin every first interaction by asking how the person is feeling right now."""


def load_knowledge_base():
    docs_dir = Path("docs")
    if not docs_dir.exists():
        return ""

    sections = []
    doc_files = sorted(docs_dir.glob("*.md"))

    for doc_file in doc_files:
        try:
            content = doc_file.read_text(encoding="utf-8")
            # Use the filename as section title
            title = doc_file.stem.replace("-", " ").title()
            sections.append(f"## {title}\n\n{content}")
        except Exception as e:
            print(f"Warning: Could not load {doc_file}: {e}")

    if not sections:
        return ""

    combined = "\n\n---\n\n".join(sections)
    print(f"Loaded {len(doc_files)} knowledge base documents ({len(combined):,} characters)")
    return combined


# Load at startup — will be cached by Anthropic's prompt caching
KNOWLEDGE_BASE = load_knowledge_base()
FULL_KNOWLEDGE = f"""
<knowledge_base>
The following is your complete knowledge base on breathwork, meditation, and consciousness.
Draw from it naturally in conversation — you don't need to reference documents explicitly,
just let this knowledge inform your responses as a wise teacher would.

{KNOWLEDGE_BASE}
</knowledge_base>
""" if KNOWLEDGE_BASE else ""


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

    # Validate message format
    for msg in messages:
        if "role" not in msg or "content" not in msg:
            return jsonify({"error": "Invalid message format"}), 400
        if msg["role"] not in ("user", "assistant"):
            return jsonify({"error": f"Invalid role: {msg['role']}"}), 400

    try:
        system_content = [
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
            }
        ]

        # Add knowledge base with prompt caching if available
        if FULL_KNOWLEDGE:
            system_content.append({
                "type": "text",
                "text": FULL_KNOWLEDGE,
                "cache_control": {"type": "ephemeral"},
            })

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=system_content,
            messages=messages,
            extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"},
        )

        reply = response.content[0].text

        # Log cache usage for debugging
        usage = response.usage
        if hasattr(usage, "cache_creation_input_tokens"):
            print(
                f"Tokens — input: {usage.input_tokens}, "
                f"cache_creation: {usage.cache_creation_input_tokens}, "
                f"cache_read: {usage.cache_read_input_tokens}, "
                f"output: {usage.output_tokens}"
            )

        return jsonify({"response": reply})

    except anthropic.APIError as e:
        print(f"Anthropic API error: {e}")
        return jsonify({"error": f"AI service error: {str(e)}"}), 502
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    print(f"Breathly starting on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
