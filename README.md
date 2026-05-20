# Kanbalio

A static portfolio website built with React, Vite, and GitHub Pages.

Live site:

https://pjpangilinan.github.io/kanbalio/

## Features

- Responsive single-page portfolio
- Portfolio board for projects, certifications, training, and other items
- Experience timeline
- Contact and resume section
- JSON-based content
- GitHub Pages deployment
- LaTeX resume PDF build

## Tech Stack

- React
- Vite
- CSS
- GitHub Pages
- GitHub Actions
- LaTeX

## Project Structure

```txt
kanbalio/
├── public/
│   ├── data/
│   │   ├── projects.json
│   │   └── experience.json
│   ├── favicon.svg
│   └── resume.pdf
├── resume/
│   └── resume.tex
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/pjpangilinan/kanbalio.git
```

Go into the project folder:

```bash
cd kanbalio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Content

The site uses local JSON files for portfolio content.

### Portfolio Board

Board data is stored in:

```txt
public/data/projects.json
```

This file can include projects, certifications, training, courses, and other portfolio items.

Example item:

```json
{
  "id": "portfolio-site",
  "title": "Portfolio Website",
  "type": "Project",
  "description": "A static portfolio built with React, Vite, and GitHub Pages.",
  "status": "done",
  "tech_stack": ["React", "Vite", "CSS"],
  "issuer": "",
  "date": "",
  "credential_url": "",
  "github_url": "https://github.com/pjpangilinan/kanbalio",
  "live_url": "https://pjpangilinan.github.io/kanbalio/"
}
```

Valid status values:

```txt
todo
in-progress
done
```

Suggested type values:

```txt
Project
Certification
Training
Course
Experiment
Research
Open Source
```

Card link priority:

```txt
live_url
credential_url
github_url
```

If no link is provided, the card shows `Details coming soon`.

### Experience

Experience data is stored in:

```txt
public/data/experience.json
```

Example entry:

```json
{
  "role": "Computer Engineer",
  "company": "Company Name",
  "start_date": "2024-01",
  "end_date": "Present",
  "description": "Short description of the role."
}
```

## Resume

The resume source is stored in:

```txt
resume/resume.tex
```

The generated PDF is stored in:

```txt
public/resume.pdf
```

Live resume:

https://pjpangilinan.github.io/kanbalio/resume.pdf

## Deployment

The site deploys through GitHub Actions and GitHub Pages.

Workflow file:

```txt
.github/workflows/deploy.yml
```

Pushing to `main` builds and deploys the site.

When resume files change, the workflow also compiles the LaTeX resume and updates the PDF.

## License

MIT License