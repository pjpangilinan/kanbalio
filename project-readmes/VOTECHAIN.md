# VOTECHAIN

> Blockchain-based electronic voting system with multi-factor authentication, immutable vote records, and a real-time public transparency dashboard.

<p>
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
</p>

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=raspberrypi&logoColor=white" />
  <img src="https://img.shields.io/badge/Blockchain-121D33?style=for-the-badge&logo=bitcoin&logoColor=white" />
</p>

## 🔗 Links
- **Live:** https://votechain-7b4va.ondigitalocean.app
- **Repo:** https://github.com/pjpangilinan/votechain

---

## 📸 Screenshots

> Replace with 2–3 real screenshots: voter UI, admin panel, public dashboard.

| Voter UI | Admin Panel | Public Dashboard |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🏗 Architecture

```
┌──────────────┐   vote    ┌──────────────┐  write  ┌──────────────┐
│   Voter UI   │ ────────▶ │   FastAPI    │ ──────▶ │  Blockchain  │
│   (React)    │           │   Backend    │         │  (Raspberry) │
└──────────────┘           └──────────────┘         └──────────────┘
       ▲                          │                        │
       │                          ▼                        ▼
       │                   ┌──────────────┐         ┌──────────────┐
       └────── results ─── │  WebSockets  │ ◀────── │  Public Dash │
                           │   Realtime   │  push   │   (React)    │
                           └──────────────┘         └──────────────┘
```

**Components**
- **Frontend (React):** Voter UI, Admin panel, Public transparency dashboard
- **Backend (Python/FastAPI):** Vote validation, MFA, block submission
- **Blockchain (Raspberry Pi):** Immutable vote ledger, consensus
- **WebSockets:** Real-time result push to the public dashboard

---

## 🚀 Quick Start

```bash
git clone https://github.com/pjpangilinan/votechain.git
cd votechain

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## 🧠 What I Learned

- How blockchain consensus works at a small scale
- WebSocket patterns for real-time public dashboards
- Multi-factor auth flow (TOTP + password)
- Running a node on constrained hardware (Raspberry Pi)

---

## 📜 License

MIT
