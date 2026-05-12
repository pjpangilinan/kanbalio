# Kanbalio

A modern, static developer portfolio built for Patrick Pangilinan using React, Vite, and GitHub Pages.

Kanbalio showcases projects, professional experience, technical skills, contact links, and a LaTeX-generated resume in a clean single-page portfolio layout.

# Features

- Modern responsive portfolio UI
- Project kanban-style board
- Experience timeline
- Resume download support
- Static JSON-based content management
- Automated deployment with GitHub Actions
- LaTeX resume compilation pipeline
- Zero backend required
- Fast static hosting via GitHub Pages

---

# Tech Stack

- React
- Vite
- CSS
- GitHub Pages
- GitHub Actions
- LaTeX

---

# Project Structure

```txt
kanbalio/
├── public/
│   ├── data/
│   │   ├── projects.json
│   │   └── experience.json
│   ├── favicon.svg
│   └── resume.pdf
│
├── resume/
│   └── resume.tex
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── index.html
├── package.json
└── vite.config.js
```

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm

Download Node.js here:

https://nodejs.org/

---

## Installation

Clone the repository:

```bash
git clone https://github.com/pjpangilinan/kanbalio.git
```

Navigate into the project folder:

```bash
cd kanbalio
```

Install dependencies:

```bash
npm install
```

---

# Local Development

Start the development server:

```bash
npm run dev
```

The application will be available locally through the Vite development server.

---

# Production Build

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# Portfolio Content Management

All portfolio content is stored locally using JSON files.

No database or backend server is required.

---

# Editing Projects

Project data is located at:

```txt
public/data/projects.json
```

Each project entry uses the following structure:

```json
{
  "id": "project-id",
  "title": "Project Title",
  "description": "Short project description.",
  "status": "todo",
  "tech_stack": ["React", "Vite", "CSS"],
  "github_url": "https://github.com/username/project",
  "live_url": "https://example.com"
}
```

## Valid Project Status Values

```txt
todo
in-progress
done
```

---

# Editing Experience

Experience data is located at:

```txt
public/data/experience.json
```

Each experience entry uses the following structure:

```json
{
  "role": "Computer Engineer",
  "company": "Company Name",
  "start_date": "2024-01",
  "end_date": "Present",
  "description": "Short description of the role."
}
```

---

# Resume Management

The resume source file is stored in:

```txt
resume/resume.tex
```

When resume files are updated and pushed to the repository, GitHub Actions automatically:

1. Compiles the LaTeX source
2. Generates an updated PDF
3. Deploys the latest resume to GitHub Pages

Generated resume output:

```txt
public/resume.pdf
```

Live resume URL:

https://pjpangilinan.github.io/kanbalio/resume.pdf

---

# Deployment

Kanbalio is automatically deployed using GitHub Actions and GitHub Pages.

Every push to the `main` branch triggers:

- Production build
- Resume compilation
- Static site deployment

Deployment workflow file:

```txt
.github/workflows/deploy.yml
```

---

# Design Philosophy

Kanbalio focuses on:

- Simplicity
- Performance
- Maintainability
- Static-first architecture
- Developer-focused presentation

The project avoids unnecessary backend complexity and keeps all portfolio content easily editable through structured JSON files.

---

# License

This project is open-source and available under the MIT License.

