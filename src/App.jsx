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
              Experience entries below are loaded from a local JSON file.
            </p>

            {dataError && <p className="data-error">{dataError}</p>}

            <div className="experience-list">
              {experience.map((item) => (
                <article className="experience-card" key={`${item.role}-${item.company}`}>
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                  </div>

                  <span>
                    {item.start_date} — {item.end_date}
                  </span>

                  <p>{item.description}</p>
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
              Project cards below are grouped by status from a local JSON file.
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
                      <h3>{column.label}</h3>
                      <span>{columnProjects.length}</span>
                    </div>

                    <div className="kanban-card-list">
                      {columnProjects.map((project) => (
                        <a
                          className="project-card"
                          href={getProjectLink(project)}
                          target="_blank"
                          rel="noreferrer"
                          key={project.id}
                        >
                          <h4>{project.title}</h4>
                          <p>{project.description}</p>

                          <div className="tech-tags">
                            {project.tech_stack.map((tech) => (
                              <span key={tech}>{tech}</span>
                            ))}
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )
              })}
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
