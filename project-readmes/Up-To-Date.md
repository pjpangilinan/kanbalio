# Up To Date

> AI-powered news dashboard with RSS feeds, Hacker News feeds, custom sources, keyboard shortcuts, PWA support, and Groq-powered article summaries.

<p>
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" />
</p>

## 🔗 Links
- **Live:** _add when deployed_
- **Repo:** https://github.com/pjpangilinan/tech-dashboard

---

## 📸 Screenshots

> Replace with 2–3 real screenshots: dashboard, summary view, settings.

| Dashboard | Article Summary | Settings |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🏗 Architecture

```
┌──────────────┐   fetch    ┌──────────────┐   parse   ┌──────────────┐
│  RSS / HN    │ ────────▶  │   FastAPI    │ ────────▶ │  Summarizer  │
│  Sources     │            │   Ingest     │           │  (Groq LLM)  │
└──────────────┘            └──────────────┘           └──────────────┘
                                  │                          │
                                  ▼                          ▼
                           ┌──────────────┐           ┌──────────────┐
                           │  PostgreSQL  │ ◀──────── │   Cache     │
                           │  Articles    │  store    │  (Redis)    │
                           └──────────────┘           └──────────────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │  React PWA   │
                           │  Dashboard   │
                           └──────────────┘
```

**Components**
- **Frontend (React PWA):** Dashboard, keyboard shortcuts, offline support
- **Backend (Python/FastAPI):** RSS/HN ingestion, summarization orchestration
- **Summarizer (Groq LLM):** Article summarization
- **Storage (PostgreSQL/Redis):** Article persistence, summary cache

---

## 🚀 Quick Start

```bash
git clone https://github.com/pjpangilinan/tech-dashboard.git
cd tech-dashboard

# Backend
cd backend
cp .env.example .env   # add GROQ_API_KEY
docker compose up -d
uvicorn main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## 🧠 What I Learned

- Building a PWA that works offline and installs to the home screen
- Prompt design for article summarization
- Keyboard-first UX patterns (j/k navigation, `/` search)
- Caching strategies for repeated LLM calls

---

## 📜 License

MIT
