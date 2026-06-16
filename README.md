# 🧠 Myelin — Your Personal Second Brain OS

Myelin is an AI-powered personal knowledge and productivity OS. Store your projects, ideas, habits, and goals as nodes on a brain-shaped map. The AI reads everything you've stored and helps you brainstorm, improve, schedule, and reflect — while tracking your mood and predicting burnout before it happens.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Brain Map** | Network of nodes rendered inside a brain silhouette. Nodes auto-connect by semantic similarity. |
| 🧩 **Node System** | Every node has a type, description, status, and child branches. AI can brainstorm or improve any node. |
| 💬 **Myelin Chat** | AI assistant with your entire brain as context. Answers based on your actual nodes via RAG. |
| 🎭 **Mood Tracker** | 5 moods (Focused, Creative, Tired, Stressed, Calm). Brain glow changes color. AI adapts responses. |
| 📅 **Timetable** | Weekly calendar. Drag nodes into time slots. AI suggests optimal scheduling based on mood history. |
| 🔥 **Habit Tracker** | Streak counters, daily check-ins, and an LSTM-based risk score per habit. |
| 📊 **Weekly Brain Report** | Auto-generated Monday digest: activity, mood patterns, habit streaks, AI suggestions. |
| 🔍 **Semantic Search** | Natural language search powered by ChromaDB vector similarity + PostgreSQL fallback. |
| 😮‍💨 **Burnout Detection** | Logistic regression model scores burnout risk from mood + session data. Fires warning at 0.7+. |
| 🏷️ **Auto-Tagging** | Gemini zero-shot classifies new nodes and suggests similar existing ones. |
| 🎙️ **Voice Input** | Speak a thought → Whisper transcribes → auto-tagged and saved as a node. |
| 🌐 **Share My Brain** | Public summary page of your top nodes for portfolio or APAC submission. |

---

## 🛠️ Tech Stack

### Frontend
- **React + Vite** — UI and build tooling
- **Tailwind CSS** — utility-first styling
- **React Flow** — brain map canvas (draggable nodes, edges, zoom/pan)
- **Framer Motion** — animations and transitions
- **Chart.js** — mood charts, habit graphs, weekly report visualizations
- **Wavesurfer.js** — waveform display for voice notes
- **Canvas API** — brain silhouette shape rendering

### Backend
- **FastAPI (Python)** — async backend, all API endpoints
- **SQLAlchemy** — ORM for PostgreSQL
- **PostgreSQL** — main database (nodes, moods, habits, sessions)
- **ChromaDB** — vector database for semantic search and RAG
- **Celery + Redis** — background job queue for embeddings and reports

### AI / ML
- **Gemini 1.5 Flash** — chat, brainstorm, improve, auto-tagging, weekly reports
- **LangChain + LangChain-Google-GenAI** — prompt orchestration and retrieval chains
- **Sentence Transformers (all-MiniLM-L6-v2)** — local embedding model
- **PyTorch (2-layer LSTM)** — habit risk prediction
- **scikit-learn (Logistic Regression)** — burnout classifier
- **OpenAI Whisper (base)** — speech-to-text for voice input

### Auth & Deployment
- **Supabase** — auth, sessions, PostgreSQL hosting
- **Vercel** — frontend hosting (auto-deploy from GitHub)
- **Render** — FastAPI backend + Celery workers

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
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # AI, embeddings, Celery tasks
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
- PostgreSQL
- Redis

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt

# Create a .env file with:
# DATABASE_URL=...
# GEMINI_API_KEY=...
# SUPABASE_URL=...
# SUPABASE_KEY=...

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install

# Create a .env file with:
# VITE_API_URL=http://localhost:8000
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

npm run dev
```

---

## 🗄️ Database Schema

| Table | Key Fields |
|---|---|
| `users` | id, email, password_hash, created_at |
| `nodes` | id, user_id, name, type, description, status, parent_id |
| `node_embeddings` | id, node_id, chroma_id |
| `moods` | id, user_id, mood, timestamp |
| `habits` | id, node_id, streak_count, last_checked_in, risk_score |
| `timetable_entries` | id, user_id, node_id, scheduled_at, duration_minutes |
| `sessions` | id, user_id, started_at, ended_at, duration_minutes |

---

## 🤖 AI Prompt Templates

- **Brainstorm** — node content + 5 similar nodes → creative expansion
- **Improve** — node content + status → critical, actionable feedback
- **Chat** — last 10 messages + 5 relevant nodes + mood → context-aware conversation
- **Weekly Report** — active nodes + mood logs + habit streaks → structured digest

---

