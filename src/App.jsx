import { useEffect, useState } from 'react'
import './App.css'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }

  return 'dark'
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="app">
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <a className="brand" href="#about" aria-label="Go to about section">
            kanbalio
          </a>

          <div className="nav-actions">
            <div className="nav-links">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.label}
                </a>
              ))}
            </div>

            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section id="about" className="page-section hero-section">
          <div className="section-content">
            <p className="eyebrow">Computer Engineer</p>
            <h1>Building clean, practical software experiences.</h1>
            <p className="section-lead">
              A minimal developer portfolio for showcasing experience, projects,
              and contact information through a fast static website.
            </p>
          </div>
        </section>

        <section id="experience" className="page-section">
          <div className="section-content">
            <p className="eyebrow">Experience</p>
            <h2>Professional background</h2>
            <p className="section-lead">
              Timeline cards will be added here in the next data-driven phase.
            </p>

            <div className="placeholder-card">
              Experience content placeholder
            </div>
          </div>
        </section>

        <section id="projects" className="page-section">
          <div className="section-content">
            <p className="eyebrow">Projects</p>
            <h2>Kanban project showcase</h2>
            <p className="section-lead">
              The three-column project board will live here once JSON data is added.
            </p>

            <div className="placeholder-grid">
              <div className="placeholder-card">To Do</div>
              <div className="placeholder-card">In Progress</div>
              <div className="placeholder-card">Completed</div>
            </div>
          </div>
        </section>

        <section id="contact" className="page-section">
          <div className="section-content">
            <p className="eyebrow">Contact</p>
            <h2>Let’s connect</h2>
            <p className="section-lead">
              Contact links and the resume button will be added later.
            </p>

            <div className="placeholder-card">
              Contact content placeholder
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App