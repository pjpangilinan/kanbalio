# Kanbalio

> Glassmorphic personal portfolio with a status-based kanban board for projects, JSON-driven content, and an automated LaTeX → PDF résumé pipeline. Deployed to GitHub Pages.

<p>
  <img src="https://img.shields.io/badge/status-live-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/github/actions/workflow/status/pjpangilinan/kanbalio/deploy.yml?style=flat-square&label=deploy" alt="Deploy" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-222?style=for-the-badge&logo=githubpages&logoColor=white" />
  <img src="https://img.shields.io/badge/LaTeX-008080?style=for-the-badge&logo=latex&logoColor=white" />
</p>

## 🔗 Links
- **Live:** https://pjpangilinan.github.io/kanbalio/
- **Repo:** https://github.com/pjpangilinan/kanbalio

---

## 📸 Screenshots

> Replace with 2–3 real screenshots: hero, kanban, contact.

| Hero | Kanban | Contact |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Actions                            │
├──────────────────────────────┬──────────────────────────────────┤
│  build-resume.yml            │  deploy.yml                      │
│  resume/*.tex → PDF          │  npm ci && npm run build         │
│       │                      │       │                          │
│       ▼                      │       ▼                          │
│  public/resume.pdf           │  dist/ → GitHub Pages            │
└──────────────────────────────┴──────────────────────────────────┘
                                       ▲
                                       │  vite build
                                       │
                          ┌────────────────────────┐
                          │  React + Vite + Tailwind │
                          │  Framer Motion           │
                          │  react-scroll · emailjs  │
                          └────────────────────────┘
                                       ▲
                                       │  imported at build
                                       │
                              data/*.json  (single source of truth)
```

**Components**
- **Frontend:** React 18 + Vite + Tailwind, Framer Motion animations
- **Content:** `data/experience.json`, `data/projects.json`, `data/education.json` — edit, push, live
- **CI (deploy.yml):** Builds on push to `main`, publishes to GitHub Pages
- **CI (build-resume.yml):** Compiles `resume.tex` to PDF, commits back to repo
- **Routing:** `vite.config.js` sets `base: '/kanbalio/'` for Pages

---

## 🚀 Quick Start

```bash
git clone https://github.com/pjpangilinan/kanbalio.git
cd kanbalio

npm install
npm run dev        # http://localhost:5173

# Build
npm run build
npm run preview
```

---

## ✏️ Updating Content

Edit the JSON files in `data/`, push to `main`. The site rebuilds automatically.

```bash
# Add an experience entry
vim data/experience.json
git commit -am "Add new role"
git push origin main
```

---

## 🧠 What I Learned

- Designing a focused glassmorphism system (depth via blur + glow, not shadows)
- Direction-aware AnimatePresence for the kanban column transitions
- GitHub Actions for both static deploy AND LaTeX compilation
- Treating JSON as the single source of truth for content

---

## 📜 License

MIT
