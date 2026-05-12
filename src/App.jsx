import { useEffect, useState } from 'react'
import './App.css'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const projectColumns = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const basePath = import.meta.env.BASE_URL

        const [projectsResponse, experienceResponse] = await Promise.all([
          fetch(`${basePath}data/projects.json`),
          fetch(`${basePath}data/experience.json`),
        ])

        if (!projectsResponse.ok || !experienceResponse.ok) {
          throw new Error('Unable to load portfolio data.')
        }

        const [projectsData, experienceData] = await Promise.all([
          projectsResponse.json(),
          experienceResponse.json(),
        ])

        setProjects(projectsData)
        setExperience(experienceData)
      } catch (error) {
        console.error(error)
        setDataError('Portfolio data could not be loaded. Check the JSON files.')
      }
    }

    loadPortfolioData()
  }, [])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  function getProjectLink(project) {
    return project.live_url || project.github_url
  }

  return (
    <div className="app">
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <a className="brand" href="#about" onClick={closeMenu}>
            kanbalio
          </a>

          <div className="desktop-nav">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}

            <button className="theme-toggle" type="button" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <button
            className="menu-button"
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </nav>

        <div
          id="mobile-menu"
          className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`}
        >
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={closeMenu}>
              {section.label}
            </a>
          ))}

          <button type="button" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
        </div>
      </header>

      <main>
        <section id="about" className="page-section hero-section">
          <div className="section-content">
            <p className="eyebrow">Computer Engineer</p>
            <h1>Building reliable software with clean, practical design.</h1>
            <p className="section-lead">
              I create responsive web experiences, organize technical projects, and build
              simple systems that are easy to maintain and improve.
            </p>
          </div>
        </section>

        <section id="experience" className="page-section">
          <div className="section-content">
            <p className="eyebrow">Experience</p>
            <h2>Professional background</h2>
            <p className="section-lead">
              A concise overview of roles, responsibilities, and technical growth.
            </p>

            {dataError && <p className="data-error">{dataError}</p>}

            <div className="timeline" aria-label="Professional experience timeline">
              {experience.map((item, index) => (
                <article className="timeline-item" key={`${item.role}-${item.company}`}>
                  <div className="timeline-marker" aria-hidden="true">
                    <span>{index + 1}</span>
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div>
                        <h3>{item.role}</h3>
                        <p>{item.company}</p>
                      </div>

                      <span>
                        {item.start_date} — {item.end_date}
                      </span>
                    </div>

                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="page-section">
          <div className="section-content">
            <p className="eyebrow">Projects</p>
            <h2>Kanban project showcase</h2>
            <p className="section-lead">
              Project cards are grouped by status from a local JSON file.
            </p>

            {dataError && <p className="data-error">{dataError}</p>}

            <div className="kanban-board">
              {projectColumns.map((column) => {
                const columnProjects = projects.filter(
                  (project) => project.status === column.id,
                )

                return (
                  <section className="kanban-column" key={column.id}>
                    <div className="kanban-column-header">
                      <div>
                        <h3>{column.label}</h3>
                        <p>
                          {columnProjects.length} project
                          {columnProjects.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>

                    <div className="kanban-card-list">
                      {columnProjects.length === 0 && (
                        <div className="empty-project-card">
                          No projects yet
                        </div>
                      )}

                      {columnProjects.map((project) => (
                        <a
                          className="project-card"
                          href={getProjectLink(project)}
                          target="_blank"
                          rel="noreferrer"
                          key={project.id}
                        >
                          <span className="project-status-label">
                            {column.label}
                          </span>

                          <h4>{project.title}</h4>
                          <p>{project.description}</p>

                          <div className="tech-tags">
                            {project.tech_stack.map((tech) => (
                              <span key={tech}>{tech}</span>
                            ))}
                          </div>

                          <span className="project-card-action">
                            Open project
                          </span>
                        </a>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="page-section contact-section">
          <div className="section-content">
            <p className="eyebrow">Contact</p>
            <h2>Let’s connect</h2>
            <p className="section-lead">
              Reach out by email, explore the code, or view the latest resume PDF.
            </p>

            <div className="contact-grid">
              <a className="contact-card" href="mailto:patrickjpangilinan@protonmail.com">
                <span>Email</span>
                <strong>patrickjpangilinan@protonmail.com</strong>
              </a>

              <a
                className="contact-card"
                href="https://github.com/pjpangilinan"
                target="_blank"
                rel="noreferrer"
              >
                <span>GitHub</span>
                <strong>github.com/pjpangilinan</strong>
              </a>

              <a
                className="contact-card"
                href="https://www.linkedin.com/in/patrick-james-pangilinan-490a41329/"
                target="_blank"
                rel="noreferrer"
              >
                <span>LinkedIn</span>
                <strong>linkedin.com/in/patrick-james-pangilinan-490a41329</strong>
              </a>
            </div>

            <a
              className="resume-button"
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App