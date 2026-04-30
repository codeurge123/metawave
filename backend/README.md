# MetaWave FastAPI Backend

FastAPI backend for MetaWave authentication and Gemini-powered chatbot.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `.env` with:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET_KEY`
- `GEMINI_API_KEY`

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

API docs are available at `http://localhost:8000/docs`.

## Endpoints

- `GET /health` - service health check
- `POST /auth/signup` - create a user and return an access token
- `POST /auth/signin` - authenticate and return an access token
- `GET /auth/me` - return the current user
- `POST /chat` - send a prompt to Gemini

Use the returned token with:

```http
Authorization: Bearer <access_token>
```
