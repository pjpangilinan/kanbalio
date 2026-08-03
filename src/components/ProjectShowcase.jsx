import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../../data/projects.json'

const BASE = '/kanbalio/showcase'

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
    screenshots: [`${BASE}/DGOS/customer.png`, `${BASE}/DGOS/kitchen.png`, `${BASE}/DGOS/admin.png`],
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
    screenshots: [`${BASE}/Votechain/screenshot-1.png`, `${BASE}/Votechain/screenshot-2.png`],
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
    screenshots: [`${BASE}/Muse-Journ/image.png`],
  },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
}

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

function MermaidChart({ chart, id, compact }) {
  const ref = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ref.current || !chart) return
    let cancelled = false

    getMermaid()
      .then((m) => {
        if (cancelled) return
        const uid = `mermaid-${id}-${Date.now()}`
        ref.current.innerHTML = ''
        m.render(uid, chart).then(({ svg }) => {
          if (!cancelled && ref.current) {
            ref.current.innerHTML = svg.replace(
              '<svg ',
              '<svg style="max-width:100%;height:auto" ',
            )
          }
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
      className={`flex justify-center rounded-card bg-bg/60 py-4 ${
        compact ? 'max-h-56 overflow-y-auto' : 'overflow-x-auto'
      }`}
    />
  )
}

function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 sm:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass relative flex max-h-full max-w-full flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
                {title}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary h-8 w-8 rounded-full p-0 text-base"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProjectShowcase() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [modal, setModal] = useState(null)
  const [screenshotIdx, setScreenshotIdx] = useState(0)
  const item = SHOWCASE[active]
  const project = projects.find((p) => p.id === item.id)

  const prev = useCallback(() => {
    setDirection(-1)
    setScreenshotIdx(0)
    setActive((i) => (i - 1 + SHOWCASE.length) % SHOWCASE.length)
  }, [])

  const next = useCallback(() => {
    setDirection(1)
    setScreenshotIdx(0)
    setActive((i) => (i + 1) % SHOWCASE.length)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setModal(null); return }
      if (modal === 'screenshot') {
        if (e.key === 'ArrowLeft') setScreenshotIdx(i => (i - 1 + item.screenshots.length) % item.screenshots.length)
        if (e.key === 'ArrowRight') setScreenshotIdx(i => (i + 1) % item.screenshots.length)
        return
      }
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, modal, item.screenshots.length])

  return (
    <section id="showcase" className="px-4 py-20 md:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Showcase
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl md:text-4xl">
            {project ? project.title : ''}
          </h2>
          <p className="max-w-xl text-xs text-text-secondary sm:text-sm">
            {project ? project.description : ''}
          </p>
        </div>

        <div className="mx-auto mb-6 flex max-w-xs items-center gap-3 sm:max-w-sm">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="btn-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-full p-0 text-xl"
          >
            ‹
          </button>

          <div className="flex flex-1 justify-center gap-2">
            {SHOWCASE.map((s, i) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-8 bg-cyan' : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="btn-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-full p-0 text-xl"
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
              <div
                className="glass cursor-pointer p-4 transition-all hover:border-cyan/30 sm:p-6"
                onClick={() => setModal('architecture')}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                    Architecture
                  </p>
                  <span className="font-mono text-[10px] text-cyan/60">
                    click to expand
                  </span>
                </div>
                <MermaidChart chart={item.chart} id={item.id} compact />
              </div>

              <div
                className="glass cursor-pointer p-4 transition-all hover:border-cyan/30 sm:p-6"
                onClick={() => { setScreenshotIdx(0); setModal('screenshot') }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                    Screenshots
                  </p>
                  <span className="font-mono text-[10px] text-cyan/60">
                    {item.screenshots.length} file{item.screenshots.length === 1 ? '' : 's'} · click to view
                  </span>
                </div>
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-card border border-white/10 bg-white/[0.02]">
                  <img
                    src={item.screenshots[0]}
                    alt={`${project?.title} screenshot`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="mt-6 flex flex-col items-center gap-2 font-mono text-xs tracking-widest sm:flex-row sm:justify-between">
          <span className="text-text-secondary">
            {active + 1} / {SHOWCASE.length}
          </span>
          {project?.tech_stack && (
            <div className="flex flex-wrap justify-center gap-2">
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

      <Modal
        open={modal === 'architecture'}
        onClose={() => setModal(null)}
        title="Architecture — full view"
      >
        <div className="min-w-[360px] md:min-w-[700px]">
          <MermaidChart chart={item.chart} id={`${item.id}-modal`} large />
        </div>
      </Modal>

      <Modal
        open={modal === 'screenshot'}
        onClose={() => setModal(null)}
        title="Screenshots"
      >
        <div className="flex min-w-[360px] flex-col gap-4 md:min-w-[600px]">
          <div className="relative">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-card border border-white/10 bg-white/[0.02]">
              <img
                src={item.screenshots[screenshotIdx]}
                alt={`${project?.title} screenshot ${screenshotIdx + 1}`}
                className="h-full w-full object-contain"
              />
            </div>

            {item.screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setScreenshotIdx(i => (i - 1 + item.screenshots.length) % item.screenshots.length) }}
                  aria-label="Previous screenshot"
                  className="btn-secondary absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 text-lg"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setScreenshotIdx(i => (i + 1) % item.screenshots.length) }}
                  aria-label="Next screenshot"
                  className="btn-secondary absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 text-lg"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 font-mono text-xs tracking-widest text-text-secondary">
            {item.screenshots.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === screenshotIdx ? 'w-6 bg-cyan' : 'w-3 bg-white/10'
                }`}
              />
            ))}
            <span className="ml-2">
              {screenshotIdx + 1}/{item.screenshots.length}
            </span>
          </div>
        </div>
      </Modal>
    </section>
  )
}
