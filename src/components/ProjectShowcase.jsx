import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../../data/projects.json'

const SHOWCASE = [
  {
    id: 'dgos-restaurant-ordering',
    chart: `graph TB
      QR["Customer QR Code"] --> CF["CloudFront × 3"]
      subgraph SPAs
        C["Customer SPA"]
        K["Kitchen SPA"]
        A["Admin SPA"]
      end
      CF --> C & K & A
      C & K & A --> COG["Cognito Auth"]
      COG --> API["API Gateway"]
      API --> L["Lambda × N<br/>(Node.js/TS)"]
      API --> WS["WebSocket Kitchen"]
      L --> DDB["DynamoDB"]
      WS --> K`,
    screenshots: 3,
  },
  {
    id: 'muse-journ',
    chart: `graph LR
      subgraph "GitHub Actions"
        S["Schedule"] --> COLL["Collector<br/>(Go bin)"]
      end
      COLL --> SPOT["Spotify API"]
      COLL --> SQL["SQLite DB"]
      subgraph "GitHub Pages"
        FE["Static Frontend<br/>(Tailwind)"]
      end
      SQL --> FE`,
    screenshots: 2,
  },
  {
    id: 'votechain',
    chart: `graph TB
      VOTER["Voter UI<br/>(React)"] --> BACK["FastAPI Backend"]
      BACK --> PI["Raspberry Pi<br/>Blockchain Node"]
      BACK --> WS2["WebSocket Push"]
      PI --> DASH["Public Dashboard<br/>(React)"]
      WS2 --> DASH
      ADMIN["Admin Panel<br/>(React)"] --> BACK`,
    screenshots: 2,
  },
]

let mermaidPromise = null

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const m = mod.default || mod
      m.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          background: '#0A0F1E',
          primaryColor: '#15234e',
          primaryTextColor: '#F0F4FF',
          primaryBorderColor: '#1e3056',
          lineColor: '#00D4FF',
          secondaryColor: '#7C3AED',
          tertiaryColor: '#1e3056',
          fontSize: '13px',
          fontFamily: '"Inter", sans-serif',
          edgeLabelBackground: '#0A0F1E',
        },
      })
      return m
    })
  }
  return mermaidPromise
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
}

function MermaidChart({ chart, id }) {
  const ref = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ref.current || !chart) return
    let cancelled = false

    getMermaid()
      .then((m) => {
        if (cancelled) return
        const uid = `mermaid-${id}`
        ref.current.innerHTML = ''
        m.render(uid, chart).then(({ svg }) => {
          if (!cancelled && ref.current) ref.current.innerHTML = svg
        })
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-card border border-white/10 bg-bg/60 py-6 text-sm text-text-secondary">
        Failed to load architecture diagram.
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="flex justify-center overflow-x-auto rounded-card border border-white/10 bg-bg/60 py-6"
    />
  )
}

function ScreenshotPlaceholder({ index }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-card border-2 border-dashed border-white/10 bg-white/[0.02]">
      <div className="flex flex-col items-center gap-2 text-text-secondary">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary/60">
          screenshot {index}
        </span>
      </div>
    </div>
  )
}

export default function ProjectShowcase() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const item = SHOWCASE[active]
  const project = projects.find((p) => p.id === item.id)

  const prev = useCallback(() => {
    setDirection(-1)
    setActive((i) => (i - 1 + SHOWCASE.length) % SHOWCASE.length)
  }, [])

  const next = useCallback(() => {
    setDirection(1)
    setActive((i) => (i + 1) % SHOWCASE.length)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <section id="showcase" className="px-6 py-20 md:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
          >
            ‹
          </button>

          <div className="flex flex-col items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
              Showcase
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
              {project ? project.title : ''}
            </h2>
            <p className="max-w-xl text-center text-sm text-text-secondary">
              {project ? project.description : ''}
            </p>
            <div className="mt-1 flex gap-2">
              {SHOWCASE.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    i === active ? 'bg-cyan' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
          >
            ›
          </button>
        </div>

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="flex flex-col gap-6">
              <div className="glass p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                  Architecture
                </p>
                <MermaidChart chart={item.chart} id={item.id} />
              </div>

              <div className="glass p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                  Screenshots
                </p>
                <div
                  className={`grid gap-4 ${
                    item.screenshots === 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {Array.from({ length: item.screenshots }, (_, i) => (
                    <ScreenshotPlaceholder key={i} index={i + 1} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="mt-6 flex items-center justify-between font-mono text-xs tracking-widest text-text-secondary">
          <span>
            {active + 1} / {SHOWCASE.length}
          </span>
          {project?.tech_stack && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 4).map((t) => (
                <span key={t} className="label-tech">
                  {t}
                </span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="label-tech-violet">
                  +{project.tech_stack.length - 4}
                </span>
              )}
            </div>
          )}
        </footer>
      </div>
    </section>
  )
}
