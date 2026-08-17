# AI Social Media Content Generator

A full-stack application that generates ready-to-post social media content — captions and matching visuals — for LinkedIn, Instagram, and X/Twitter using a locally-run LLM.

## Features

- Generate platform-specific captions (LinkedIn, Instagram, X/Twitter) with adjustable tone
- Generate a matching AI image for each post
- Edit generated content before saving
- Save posts to a persistent database
- View and delete saved posts

## Tech Stack

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** FastAPI (Python)
- **LLM:** Llama 3.2, run locally via [Ollama](https://ollama.com)
- **Image Generation:** Pollinations.ai (text-to-image API)
- **Database:** SQLite via SQLAlchemy

## Why a local LLM?

This project originally used the OpenAI API, but was switched to a locally-run model (Llama 3.2 via Ollama) to keep the project fully free to run and self-contained — no API keys or billing required to try it out.

## Architecture
```
React/Next.js (Frontend)
        ↓
FastAPI (Backend)
        ↓
Ollama (LLM) + Pollinations.ai (Image)
        ↓
SQLite (Database)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Generate a caption from topic, platform, tone |
| POST | `/generate-image` | Generate an image from topic |
| POST | `/posts` | Save a post to the database |
| GET | `/posts` | Get all saved posts |
| DELETE | `/posts/{id}` | Delete a saved post |

## Setup & Run Locally

### Prerequisites
- Python 3.10+
- Node.js (LTS)
- [Ollama](https://ollama.com) installed, with the `llama3.2` model pulled:

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install fastapi uvicorn python-dotenv sqlalchemy pydantic ollama
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000` (interactive docs at `/docs`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## What I'd Improve

- Add authentication so multiple users can have their own saved posts
- Move from SQLite to PostgreSQL for production use
- Add streaming responses so captions appear as they generate instead of after a delay
- Support scheduling posts, not just generating and saving them

## Author

Built by Syeda Samiya Urooj as part of exploring full-stack + LLM integration.