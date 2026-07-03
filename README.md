# 🧠 Myelin — AI Second Brain OS

Myelin is an AI-powered personal knowledge and productivity OS. Store your projects, ideas, habits, and goals as nodes on a 3D neural brain map. The AI reads everything you've stored and helps you brainstorm, improve, and reflect — grounded entirely in your own data, not general hallucination.

Built for the **Google Gen AI Academy APAC — 1000 Builders program.**

**🔗 Live:** [myelin-mu.vercel.app](https://myelin-mu.vercel.app) 

---

## ✨ Features

| Feature | Description | Status |
|---|---|---|
| 🗺️ Brain Map | 3D sphere canvas — nodes on the surface, drag to rotate, mood-reactive color glow | ✅ Live |
| 🧩 Node System | Create nodes with label, type, description — persisted to PostgreSQL | ✅ Live |
| 💬 Myelin Chat (RAG) | AI assistant with your brain as context — Gemini-powered, grounded in your actual nodes | ✅ Live |
| ✨ Brainstorm / Improve | Per-node AI actions — expand an idea or get critical next steps | ✅ Live |
| 🎭 Mood Tracker | 5 moods logged to DB, shifts the entire UI color theme in real time | ✅ Live |
| 🔍 Search | Label-based filtering today, semantic vector search in active development | 🟡 In Progress |
| 📅 Timetable | Weekly calendar, drag nodes into time slots, AI-suggested scheduling | 🔵 Roadmap |
| 🔥 Habit Tracker | Streak counters, daily check-ins, LSTM-based risk scoring | 🔵 Roadmap |
| 📊 Weekly Brain Report | Auto-generated digest of activity, mood patterns, and AI suggestions | 🔵 Roadmap |
| 😮‍💨 Burnout Detection | Logistic regression model scores burnout risk from mood + session data | 🔵 Roadmap |
| 🏷️ Auto-Tagging | Gemini zero-shot classification of new nodes | 🔵 Roadmap |
| 🎙️ Voice Input | Whisper transcription → auto-tagged node | 🔵 Roadmap |
| 🌐 Share My Brain | Public read-only summary page for portfolios | 🔵 Roadmap |

---

## 🏗️ Architecture: Why two tracks

Myelin ships as a **lightweight production build** and is developed further as a **full-featured local build**. This is a deliberate split:

- **Production** (Vercel + Render + Supabase, all free tier) runs the core AI loop — brain map, RAG chat, brainstorm/improve, mood tracking — kept intentionally lean so it deploys reliably on free-tier infrastructure.
- **Local development** is where heavier components (vector search, LangChain orchestration, ML models, background workers) get built and tested against real data before any of it is considered for production. Some of these — like a local vector index or a persistent job queue — need resources free-tier hosting doesn't reliably offer, so they stay local-first by design rather than being force-fit into a constrained deploy.

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite — UI and build tooling
- Tailwind CSS — styling
- Canvas API — 3D brain sphere rendering

**Backend**
- FastAPI (Python) — async API layer
- SQLAlchemy — ORM
- PostgreSQL (via Supabase) — primary datastore

**AI**
- Gemini 2.5 Flash Lite — chat, brainstorm, improve
- Gemini `embedding-001` — node embeddings
- `google-genai` — Python SDK for Gemini

**In active local development**
- pgvector (Supabase Postgres extension) — semantic search, replacing an earlier ChromaDB prototype
- LangChain + LangChain-Google-GenAI — prompt orchestration and retrieval chains
- Celery + Redis — background job queue (weekly reports, batch scoring)
- scikit-learn (Logistic Regression) — burnout classifier
- PyTorch (2-layer LSTM) — habit risk prediction
- OpenAI Whisper — voice-to-node transcription

**Auth & Deployment**
- Supabase — auth + Postgres hosting
- Vercel — frontend, auto-deploy from GitHub
- Render — FastAPI backend

---

## 📁 Project Structure

```
Myelin/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Brain map, nodes, chat, mood, timetable
│   │   ├── pages/          # Route-level pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── constants/      # App-wide constants
│   ├── index.html
│   └── vite.config.js
│
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # AI, embeddings, background tasks
│   │   └── main.py         # App entry point
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or a Supabase project)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

# .env
# DATABASE_URL=...
# GEMINI_API_KEY=...

uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install

# .env
# VITE_API_URL=http://localhost:8000

npm run dev
```

### Database
Tables are created automatically on backend startup via SQLAlchemy. For semantic search work, enable the `vector` extension in your Postgres/Supabase project.

---

## 🗄️ Database Schema

| Table | Key Fields |
|---|---|
| `users` | id, email, password_hash, created_at |
| `nodes` | id, user_id, label, type, description, created_at |
| `moods` | id, user_id, mood, timestamp |
| `habits`* | id, node_id, streak_count, last_checked_in, risk_score |
| `timetable_entries`* | id, user_id, node_id, scheduled_at, duration_minutes |
| `sessions`* | id, user_id, started_at, ended_at, duration_minutes |

\* planned, not yet created

---

## 🤖 AI Prompt Templates

- **Brainstorm** — node content → 5 concrete, actionable ideas
- **Improve** — node content → 3 critical, actionable next steps
- **Chat** — recent messages + relevant nodes + current mood → grounded, context-aware response
- **Weekly Report** *(planned)* — active nodes + mood logs + habit streaks → structured digest

---

## 💡 What Makes This Novel

Most second-brain apps are storage tools. Myelin is different because the AI only knows what you've actually told it — no hallucination about your own life. Every chat response, brainstorm, and improvement is meant to be grounded in your real nodes, retrieved before Gemini ever sees the prompt.
