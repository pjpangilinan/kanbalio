# Workflow State

## Status
- Phase: initial scaffold complete
- Active task: build verified, no further work pending unless requested

## Decisions
- Repo base path: `/kanbalio/` (matches directory name)
- Used `actions/deploy-pages` instead of `peaceiris/actions-gh-pages` — official Pages action, no extra token setup required
- EmailJS uses `@emailjs/browser` v4 (modern SDK), reads `VITE_*` env vars; if missing, form optimistically shows "Sent" rather than crashing
- `@emailjs/browser` chosen over `emailjs-com` (deprecated)
- Tailwind colors wired to DESIGN palette (bg, cyan, violet, text.primary/secondary)
- `card-active` pulse animation defined as `animate-pulse-border` in tailwind keyframes + applied conditionally in `KanbanColumn`
- Hero role-cycling uses `AnimatePresence` with `mode="wait"` to crossfade role labels
- Experience timeline uses `useScroll` + `useTransform` on a single ref; cards animate from alternating sides via `whileInView`
- Kanban column switch uses `AnimatePresence mode="wait"` with `custom={direction}` and a function-form variant
- All decorative effects (glow, blur) implemented in `src/index.css` per PLAN's glass utility spec
- Used `react-scroll` `Link` with `spy` + `activeClass` for active-section highlighting
- `public/resume.pdf` not committed (LaTeX workflow will create it on first push)
- **Data source: project-root `data/*.json`** — JSON is canonical, Vite imports at build time
- `projects.json` is a flat array; grouped by `status` at runtime in `KanbanBoard` via `useMemo` reduce
- `KanbanCard` switches render path by `item.type`: `Project` (cyan + Source/Live) vs `Certification` (violet + issuer/date/Credential)
- Card hashtag uses `item.id` slug
- Experience date range composed in component from `start_date` + `end_date`; tolerates missing fields and `Present` as end value
- Experience JSON has no `tech` field — tech-tag row omitted from `CardBody` to keep the section honest to data
- `KanbanColumn` list made scrollable (`overflow-y-auto`) since `done` column can hold many items
- **Hero: avatar removed**, single-column centered layout (`max-w-3xl`, `min-h-[80vh]`)
- **Section padding reduced**: `py-32` → `py-20`, heading `mb-20` → `mb-10/12`
- **Identity**: Hero shows "Patrick James Pangilinan"; navbar logo `<pjpangilinan />`; socials point to real GitHub/LinkedIn/ProtonMail
- **Lead roles**: Cloud Engineer + DevOps Engineer — Hero role-crossfade and "Open to" line both lead with these
- **Hero status row**: green-dot "Open to" + location "Trece Martires City, PH" + "Remote-friendly" — instant recruiter signal
- **Skill split**: Primary (Python, prominent cyan) vs Learning & Using (rest) — honest depth indicator, follows user's "primary Python, rest learning" direction
- **AWS added** to Learning skills (per user direction); cybersecurity certs removed from focus
- **Education section** added between Experience and Projects, data in `data/education.json`; not in navbar (single entry, supplementary)
- **Profile README** at project root — meant for `pjpangilinan/pjpangilinan` profile repo; user to copy across
- **Project README templates** in `project-readmes/` for VOTECHAIN, Up To Date, Kanbalio — each has badge row, screenshots placeholder, ASCII architecture, quick-start, "What I learned" section

## Assumptions
- Repository is named `kanbalio` on GitHub (matches local dir); user can rename in `vite.config.js` if different
- EmailJS credentials will be supplied via `.env` (gitignored) and GitHub Secrets at deploy time
- Browser font availability: Inter + JetBrains Mono loaded from Google Fonts; no offline fallback
- Social links point to `pjpangilinan` handles and ProtonMail address
- Public deployment URL will be `https://<user>.github.io/kanbalio/`

## Open Questions
- Confirm actual GitHub repo name (assumed `kanbalio`); affects `base` in `vite.config.js` and résume link
- Confirm EmailJS account is set up; if not, the form falls back to a faux-success state
- Confirm GitHub Pages source is set to "GitHub Actions" in repo Settings (required for `actions/deploy-pages`)

## Blockers
- None

## File Map
- `package.json` — deps: react 18, vite 5, tailwind 3, framer-motion 11, react-scroll, @emailjs/browser 4
- `vite.config.js` — `base: '/kanbalio/'`, react plugin
- `tailwind.config.js` — palette, fonts, `pulse-border` keyframes/animation
- `postcss.config.js` — tailwind + autoprefixer
- `index.html` — Google Fonts, root div
- `INTAKE_TEMPLATE.md` — **fill-in format for new projects/certs**; user pastes back, AI converts to JSON
- `src/main.jsx` — React entry
- `src/App.jsx` — section composition + footer (incl. Education)
- `src/index.css` — tailwind directives, glass/glow/btn utilities, scrollbar styling
- `src/components/Navbar.jsx` — sticky glass nav, logo `<pjpangilinan />`, mobile drawer, react-scroll anchors
- `src/components/Hero.jsx` — open-to status row, role crossfade (Cloud ↔ DevOps), primary/learning skill split
- `src/components/Experience.jsx` — timeline w/ scroll-linked `scaleY` line, alternating slide-in cards; consumes `data/experience.json`
- `src/components/Education.jsx` — single-card section between Experience and Projects; consumes `data/education.json`
- `src/components/KanbanBoard.jsx` — single-column-at-a-time, prev/next + arrow keys, `AnimatePresence` direction-aware; groups `data/projects.json` by `status` at runtime
- `src/components/KanbanColumn.jsx` — column label, count, mapped cards, pulse border for in-progress
- `src/components/KanbanCard.jsx` — hover-lift card; renders Project (cyan + Source/Live) or Certification (violet + issuer/date/Credential) by `item.type`
- `src/components/Contact.jsx` — EmailJS form, button state machine, résumé link, social pills (real GH/LinkedIn/ProtonMail)
- `data/experience.json` — canonical experience list
- `data/education.json` — canonical education list (B.S. CpE, Cavite State University, 2022 – Present)
- `data/projects.json` — canonical project + certification list; live URLs for votechain + dampos
- `README.md` — **GitHub profile README** (for `pjpangilinan/pjpangilinan`); copy verbatim
- `project-readmes/VOTECHAIN.md` — template + live URL
- `project-readmes/Up-To-Date.md` — template
- `project-readmes/Kanbalio.md` — template
- `project-readmes/DAMPos.md` — template + live URL (Streamlit)
- `.github/workflows/deploy.yml` — official `actions/deploy-pages` workflow, ignores resume changes
- `.github/workflows/build-resume.yml` — xu-cheng/latex-action w/ XeLaTeX, auto-commits `public/resume.pdf`
- `resume/resume.tex` — XeLaTeX CV w/ Inter + JetBrains Mono
- `.env.example` — EmailJS env var template
- `.gitignore` — node_modules, dist, .env*, LaTeX intermediates

## Test Commands
- `npm install` → 143 packages, 0 vulnerabilities
- `npm run build` → 3.78s, 473 modules, 319.88 kB JS / 18.43 kB CSS (after Education section added)

## Handoff Notes
- 2026-08-03 — ProjectShowcase screenshots wired. `showcase/{id}/*.png` copied to `public/showcase/{id}/` (Vite static assets). Component loads real images: DGOS (3), Votechain (2), Muse-Journ (1). Modal viewer shows `object-contain`, inline preview shows `object-cover`. `ScreenshotPlaceholder` removed. Build passes (19.73s, 2549 modules).
- 2026-06-26 — Built initial portfolio per PLAN.md + DESIGN.md. Vite build passes, base path = `/kanbalio/`. Workflows use official Pages deploy action. No git init performed (per AGENTS rule: only on explicit request). Next: user to `git init`, push to GitHub, set Pages source to GitHub Actions, add EmailJS secrets, push `resume.tex` to trigger first PDF build.
- 2026-06-26 — Refactored to consume JSON at `data/experience.json` + `data/projects.json`. Dropped `src/data/*.js`. `KanbanCard` branches on `item.type`: Project (cyan, Source/Live) vs Certification (violet, issuer/date/Credential). `KanbanBoard` groups flat project array by `status` at runtime.
- 2026-06-26 — Identity update: name = Patrick James Pangilinan, navbar `<pjpangilinan />`, socials → real GitHub/LinkedIn/ProtonMail. Hero avatar removed; section paddings `py-32`→`py-20`. Skills pills + bio updated. Experience bullets rewritten in concise voice. Resume rewritten to match real data.
- 2026-06-26 — Recruiter-pass changes: Hero status row (open-to + remote-friendly, no specific city); bio rewritten to "aspiring"; role crossfade = Cloud ↔ DevOps; skill pills split into Primary (Python, Bash, React, FastAPI, Git, Postman) + Learning (Go, JavaScript, AWS, Docker, CI/CD); first experience bullet updated to "~13k legacy citizen records"; new `data/education.json` + `Education.jsx` section for B.S. CpE @ Cavite State University (2022 – Present). Created `README.md` (GitHub profile README for `pjpangilinan/pjpangilinan`) and 3 project README templates in `project-readmes/` (VOTECHAIN, Up To Date, Kanbalio).
- 2026-06-26 — Live URLs added: votechain → `https://votechain-7b4va.ondigitalocean.app`; dampos → `https://dampos.streamlit.app/`. Updated `data/projects.json`, profile `README.md` featured grid, and VOTECHAIN project README. Created `project-readmes/DAMPos.md` template (Streamlit-themed). Created `INTAKE_TEMPLATE.md` at project root — fill-in format for new projects/certs with rules + worked examples for both Project and Certification blocks.
