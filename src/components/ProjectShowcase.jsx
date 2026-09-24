import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../../data/projects.json'

const BASE = `${import.meta.env.BASE_URL}showcase`

const SHOWCASE = [
  {
    id: 'areweupyet',
    chart: `graph TB
      PUSH["GitHub Push"] --> AMP["AWS Amplify Gen 2 (CDK)"]
      AMP --> CF["CloudFront + React SPA"]
      AMP --> COG["Cognito User Pool"]
      AMP --> DDB[("DynamoDB<br/>Endpoints & TTL")]
      EB["EventBridge rate(1m)"] --> DISP["Go Lambda: Dispatcher"]
      DISP -->|Socket-Dial SSRF Guard| EXT["External Targets"]
      DISP --> DDB
      DDB --> NOTIF["Go Lambda: Notifier"]
      NOTIF -->|HMAC-SHA256| HOOK["Customer Webhooks"]`,
    screenshots: [
      `${BASE}/AreWeUpYet/dashboard.png`,
      `${BASE}/AreWeUpYet/status-page.png`,
      `${BASE}/AreWeUpYet/detail.png`,
    ],
  },
  {
    id: 'deony',
    chart: `graph LR
      CLIENT["React 19 PWA"] --> CF["CloudFront"]
      CF --> APIGW["API Gateway"]
      APIGW --> LAMBDA["Lambda Node.js 20 (ARM64)"]
      LAMBDA --> DDB[("DynamoDB")]
      LAMBDA -->|ConverseCommand| BEDROCK["Amazon Bedrock<br/>Claude 3 Haiku"]
      BEDROCK -.->|Prompt Defense & PII Mask| GUARD["Bedrock Guardrails"]
      CLIENT -.->|JWT Auth| COG["Cognito User Pool"]`,
    screenshots: [
      `${BASE}/Deony/chat-roast.png`,
      `${BASE}/Deony/guardrails.png`,
      `${BASE}/Deony/library.png`,
    ],
  },
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
    id: 'maylupa',
    chart: `graph TB
      USER["User Browser"] --> CF["CloudFront CDN"]
      CF --> MAP["MapLibre + Deck.gl<br/>(60 FPS WebGL)"]
      MAP --> APIGW["HTTP API Gateway"]
      APIGW --> LAMBDA["Python 3.12 Lambda (ARM64)"]
      LAMBDA --> PSGC["1,613 LGUs PSGC Store"]
      LAMBDA -->|Methodology Citations| BEDROCK["Amazon Bedrock<br/>Nova Lite / Claude"]`,
    screenshots: [
      `${BASE}/maylupa/map.png`,
      `${BASE}/maylupa/chat.png`,
      `${BASE}/maylupa/composite.png`,
    ],
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

function MermaidChart({ chart, id, minHeight = '340px' }) {
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
              '<svg style="max-width:100%;height:auto;margin:auto" ',
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
      <div
        style={{ minHeight }}
        className="flex w-full items-center justify-center rounded-card border border-white/10 bg-bg/60 p-6 text-sm text-text-secondary"
      >
        Failed to load architecture diagram.
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={{ minHeight }}
      className="flex w-full items-center justify-center overflow-x-auto rounded-card bg-bg/60 p-4 transition-all"
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 sm:p-10 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass relative flex max-h-[90vh] max-w-5xl w-full flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
                {title}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary h-8 w-8 rounded-full p-0 text-base"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">{children}</div>
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
  const [viewMode, setViewMode] = useState('dual') // 'dual' | 'architecture' | 'screenshots'

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

  const selectProject = useCallback((idx) => {
    if (idx === active) return
    setDirection(idx > active ? 1 : -1)
    setScreenshotIdx(0)
    setActive(idx)
  }, [active])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setModal(null); return }
      if (modal === 'screenshot') {
        if (e.key === 'ArrowLeft') setScreenshotIdx((i) => (i - 1 + item.screenshots.length) % item.screenshots.length)
        if (e.key === 'ArrowRight') setScreenshotIdx((i) => (i + 1) % item.screenshots.length)
        return
      }
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, modal, item.screenshots.length])

  return (
    <section id="showcase" className="relative px-6 py-20 md:px-20">
      <div className="mx-auto max-w-container">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            02 · Showcase
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Flagship Systems
          </h2>
          <p className="max-w-xl text-sm text-text-secondary">
            Production cloud architectures and real-time interfaces. Switch systems with ‹ ›, keyboard arrows, or the indicators.
          </p>
        </div>

        {/* Framed Container Matching Kanban Board */}
        <div className="glass mx-auto flex max-w-5xl flex-col p-6 md:p-10">
          {/* Top Switcher Bar (Mirrors Kanban Board Navigation) */}
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous system"
              className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
            >
              ‹
            </button>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                  System 0{active + 1} of 0{SHOWCASE.length} · {project?.title.split('—')[0].trim()}
                </span>
                {active === 0 && (
                  <span className="rounded bg-cyan/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">
                    Lead
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {SHOWCASE.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectProject(i)}
                    aria-label={`Switch to system 0${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? 'w-8 bg-cyan' : 'w-4 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next system"
              className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
            >
              ›
            </button>
          </div>

          {/* Active System Details & Controls */}
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-primary sm:text-2xl">
                {project?.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
                {project?.description}
              </p>

              {project?.tech_stack && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech_stack.map((t) => (
                    <span key={t} className="label-tech py-0.5 px-2 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions & View Mode Toggle */}
            <div className="flex flex-col items-start gap-3 pt-2 md:items-end md:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                {project?.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-1.5 px-3.5 font-mono text-xs"
                  >
                    Live Demo ↗
                  </a>
                )}
                {project?.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-1.5 px-3.5 font-mono text-xs"
                  >
                    Source ↗
                  </a>
                )}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('dual')}
                  className={`rounded px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    viewMode === 'dual'
                      ? 'bg-cyan text-bg font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('architecture')}
                  className={`rounded px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    viewMode === 'architecture'
                      ? 'bg-cyan text-bg font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Architecture
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('screenshots')}
                  className={`rounded px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    viewMode === 'screenshots'
                      ? 'bg-cyan text-bg font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Interface ({item.screenshots.length})
                </button>
              </div>
            </div>
          </div>

          {/* Main Visual Stage */}
          <div className="relative min-h-[460px]">
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
                {/* Side-by-Side View */}
                {viewMode === 'dual' && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left: Architecture */}
                    <div
                      className="glass group flex cursor-pointer flex-col overflow-hidden border border-white/10 p-4 transition-all hover:border-cyan/40"
                      onClick={() => setModal('architecture')}
                    >
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                          Architecture Flow
                        </span>
                        <span className="font-mono text-[10px] text-cyan/70 transition-colors group-hover:text-cyan">
                          Full View ↗
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-center">
                        <MermaidChart chart={item.chart} id={`${item.id}-dual`} minHeight="320px" />
                      </div>
                    </div>

                    {/* Right: Interface Preview */}
                    <div className="glass group flex flex-col overflow-hidden border border-white/10 p-4 transition-all hover:border-cyan/40">
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                          Interface ({screenshotIdx + 1}/{item.screenshots.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setModal('screenshot')}
                          className="font-mono text-[10px] text-cyan/70 transition-colors hover:text-cyan"
                        >
                          Fullscreen ↗
                        </button>
                      </div>

                      <div
                        className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-card border border-white/10 bg-black/40"
                        onClick={() => setModal('screenshot')}
                      >
                        <img
                          src={item.screenshots[screenshotIdx]}
                          alt={`${project?.title} screenshot`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        {item.screenshots.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setScreenshotIdx((i) => (i - 1 + item.screenshots.length) % item.screenshots.length)
                              }}
                              className="btn-secondary absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full p-0 text-base backdrop-blur"
                              aria-label="Previous screenshot"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setScreenshotIdx((i) => (i + 1) % item.screenshots.length)
                              }}
                              className="btn-secondary absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full p-0 text-base backdrop-blur"
                              aria-label="Next screenshot"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails */}
                      {item.screenshots.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                          {item.screenshots.map((s, idx) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setScreenshotIdx(idx)}
                              className={`relative h-11 w-18 shrink-0 overflow-hidden rounded border transition-all ${
                                idx === screenshotIdx
                                  ? 'border-cyan ring-1 ring-cyan'
                                  : 'border-white/10 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={s} alt="" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Architecture Single Focus View */}
                {viewMode === 'architecture' && (
                  <div
                    className="glass group flex cursor-pointer flex-col overflow-hidden border border-white/10 p-5 transition-all hover:border-cyan/40"
                    onClick={() => setModal('architecture')}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                        Architecture & Data Flow
                      </span>
                      <span className="font-mono text-[10px] text-cyan/70 transition-colors group-hover:text-cyan">
                        Expand full-screen ↗
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                      <MermaidChart chart={item.chart} id={`${item.id}-single`} minHeight="420px" />
                    </div>
                  </div>
                )}

                {/* Interface Single Focus View */}
                {viewMode === 'screenshots' && (
                  <div className="glass group flex flex-col overflow-hidden border border-white/10 p-5 transition-all hover:border-cyan/40">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                        Interface ({screenshotIdx + 1}/{item.screenshots.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setModal('screenshot')}
                        className="font-mono text-[10px] text-cyan/70 transition-colors hover:text-cyan"
                      >
                        Fullscreen ↗
                      </button>
                    </div>

                    <div
                      className="relative flex aspect-video max-h-[500px] cursor-pointer items-center justify-center overflow-hidden rounded-card border border-white/10 bg-black/40"
                      onClick={() => setModal('screenshot')}
                    >
                      <img
                        src={item.screenshots[screenshotIdx]}
                        alt={`${project?.title} screenshot`}
                        className="h-full w-full object-contain"
                      />
                      {item.screenshots.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setScreenshotIdx((i) => (i - 1 + item.screenshots.length) % item.screenshots.length)
                            }}
                            className="btn-secondary absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full p-0 text-lg backdrop-blur"
                            aria-label="Previous screenshot"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setScreenshotIdx((i) => (i + 1) % item.screenshots.length)
                            }}
                            className="btn-secondary absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full p-0 text-lg backdrop-blur"
                            aria-label="Next screenshot"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {item.screenshots.length > 1 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {item.screenshots.map((s, idx) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setScreenshotIdx(idx)}
                            className={`relative h-14 w-24 shrink-0 overflow-hidden rounded border transition-all ${
                              idx === screenshotIdx
                                ? 'border-cyan ring-1 ring-cyan'
                                : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={s} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Architecture Full View Modal */}
      <Modal
        open={modal === 'architecture'}
        onClose={() => setModal(null)}
        title={`${project?.title} — Architecture Full View`}
      >
        <div className="w-full">
          <MermaidChart chart={item.chart} id={`${item.id}-modal`} minHeight="520px" />
        </div>
      </Modal>

      {/* Screenshot Lightbox Modal */}
      <Modal
        open={modal === 'screenshot'}
        onClose={() => setModal(null)}
        title={`${project?.title} — Screenshot ${screenshotIdx + 1} of ${item.screenshots.length}`}
      >
        <div className="flex flex-col gap-4">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-card border border-white/10 bg-black/60">
            <img
              src={item.screenshots[screenshotIdx]}
              alt={`${project?.title} screenshot ${screenshotIdx + 1}`}
              className="h-full w-full object-contain"
            />

            {item.screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setScreenshotIdx((i) => (i - 1 + item.screenshots.length) % item.screenshots.length)
                  }}
                  aria-label="Previous screenshot"
                  className="btn-secondary absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 text-xl"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setScreenshotIdx((i) => (i + 1) % item.screenshots.length)
                  }}
                  aria-label="Next screenshot"
                  className="btn-secondary absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 text-xl"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {item.screenshots.length > 1 && (
            <div className="flex items-center justify-center gap-2 font-mono text-xs tracking-widest text-text-secondary">
              {item.screenshots.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScreenshotIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === screenshotIdx ? 'w-6 bg-cyan' : 'w-3 bg-white/20'
                  }`}
                  aria-label={`Jump to screenshot ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </section>
  )
}
