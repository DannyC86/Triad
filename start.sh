#!/usr/bin/env bash
# Breathly launcher — one command to set up and run the app.
#   ./start.sh            → start on port 5000
#   PORT=5050 ./start.sh  → override port
set -euo pipefail

cd "$(dirname "$0")"

# 1. Activate a venv if one exists, else create one (best-effort — falls back to system python)
if [[ -d .venv ]]; then
  # shellcheck source=/dev/null
  source .venv/bin/activate
elif [[ -d venv ]]; then
  # shellcheck source=/dev/null
  source venv/bin/activate
else
  echo "[start.sh] No venv found. Creating one at .venv …"
  if python3 -m venv .venv 2>/dev/null; then
    # shellcheck source=/dev/null
    source .venv/bin/activate
  else
    echo "[start.sh] venv module unavailable — falling back to system python3."
  fi
fi

# 2. Install deps if needed
PYTHON_BIN="$(command -v python3 || command -v python)"
if ! "$PYTHON_BIN" -c "import flask, anthropic, dotenv" 2>/dev/null; then
  echo "[start.sh] Installing dependencies from requirements.txt …"
  "$PYTHON_BIN" -m pip install --quiet -r requirements.txt
fi

# 3. Sanity-check .env
if [[ ! -f .env ]]; then
  echo "[start.sh] ERROR: .env not found. Create one with ANTHROPIC_API_KEY=sk-ant-…"
  exit 1
fi
if ! grep -q '^ANTHROPIC_API_KEY=' .env; then
  echo "[start.sh] ERROR: .env is missing ANTHROPIC_API_KEY."
  exit 1
fi

# 4. Run the server. server.py loads .env itself via python-dotenv.
echo "[start.sh] Starting Breathly on http://localhost:${PORT:-5000}"
exec "$PYTHON_BIN" server.py
