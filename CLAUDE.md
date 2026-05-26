# Breathly — Claude Code Instructions

## CRITICAL — Cost Control
- NEVER run the server during any build
- NEVER make live API calls to test
- NEVER start python server.py or ./start.sh
- NEVER use curl to test endpoints
- Edit files only — the developer tests manually in the browser
- If you want to verify something, check the source code directly, do not run it

## Project
Breathly is a breathwork and meditation web app.
- Backend: server.py (Flask)
- Frontend: index.html (single page app)
- All content is static in index.html — zero API calls for browsing
- Only two API call sites: My Plan generation and Ask technique questions

## .env variables
- `FLASK_SECRET_KEY` — required in production for persistent sessions
- `ANTHROPIC_API_KEY` — required for AI features
- `ADMIN_KEY` — required for admin endpoints
- `DATABASE_PATH=users.db` — local dev only; on Railway the DB lives at /data/users.db (persistent volume)
