import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../../data/projects.json'

const BASE = `${import.meta.env.BASE_URL}showcase`

const SHOWCASE = [
  {
    id: 'areweupyet',
    shortName: 'AreWeUpYet',
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
    shortName: 'Deony',
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
    shortName: 'DGOS',
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
    shortName: 'maylupa',
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
    shortName: 'Votechain',
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
    shortName: 'Muse Journal',
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
      className="flex w-full items-center justify-center overflow-x-auto rounded-card bg-black/40 p-6 transition-all"
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="glass relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
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
  const [modal, setModal] = useState(null)
  const [screenshotIdx, setScreenshotIdx] = useState(0)
  const [viewMode, setViewMode] = useState('screenshots') // 'screenshots' | 'architecture'

  const item = SHOWCASE[active]
  const project = projects.find((p) => p.id === item.id)

  const prev = useCallback(() => {
    setScreenshotIdx(0)
    setActive((i) => (i - 1 + SHOWCASE.length) % SHOWCASE.length)
  }, [])

  const next = useCallback(() => {
    setScreenshotIdx(0)
    setActive((i) => (i + 1) % SHOWCASE.length)
  }, [])

  const selectProject = useCallback(
    (idx) => {
      if (idx === active) return
      setScreenshotIdx(0)
      setActive(idx)
    },
    [active],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setModal(null)
        return
      }
      if (modal === 'screenshot') {
        if (e.key === 'ArrowLeft')
          setScreenshotIdx(
            (i) => (i - 1 + item.screenshots.length) % item.screenshots.length,
          )
        if (e.key === 'ArrowRight')
          setScreenshotIdx((i) => (i + 1) % item.screenshots.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, item.screenshots.length])

  return (
    <section id="showcase" className="relative px-6 py-20 md:px-16 lg:px-20">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center gap-2.5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
            02 · Showcase
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Flagship Systems
          </h2>
          <p className="max-w-md text-sm text-text-secondary">
            Explore live interfaces and cloud architectures across my core deployments.
          </p>
        </div>

        {/* Clean Project Selector Pills */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {SHOWCASE.map((s, i) => {
            const isSelected = i === active
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => selectProject(i)}
                className={`rounded-full px-4 py-2 font-mono text-xs transition-all ${
                  isSelected
                    ? 'bg-cyan font-semibold text-bg shadow-[0_0_16px_rgba(0,212,255,0.3)]'
                    : 'border border-white/10 bg-white/5 text-text-secondary hover:border-white/25 hover:text-text-primary'
                }`}
              >
                {s.shortName}
              </button>
            )
          })}
        </div>

        {/* Calm 2-Column Card on Desktop / Clean Stack on Mobile */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="glass grid grid-cols-1 gap-6 p-6 md:p-8 lg:grid-cols-12 lg:items-center lg:gap-8"
          >
            {/* Left Column: Focused Summary & Actions */}
            <div className="flex flex-col items-start gap-4 lg:col-span-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                  0{active + 1} / 0{SHOWCASE.length}
                </span>
                {active === 0 && (
                  <span className="rounded bg-cyan/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan">
                    Lead System
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold leading-snug text-text-primary sm:text-2xl">
                {project?.title.split('—')[0].trim()}
                {project?.title.includes('—') && (
                  <span className="mt-1 block text-sm font-normal text-text-secondary">
                    {project.title.split('—')[1].trim()}
                  </span>
                )}
              </h3>

              <p className="text-sm leading-relaxed text-text-secondary">
                {project?.description}
              </p>

              {project?.tech_stack && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tech_stack.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="label-tech px-2.5 py-0.5 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project?.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-4 py-2 font-mono text-xs"
                  >
                    Live Demo ↗
                  </a>
                )}
                {project?.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-4 py-2 font-mono text-xs"
                  >
                    Source ↗
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Single Clean Visual Stage (Preview OR Architecture) */}
            <div className="flex flex-col gap-3 lg:col-span-7">
              {/* Simple Stage Header with 2-way toggle */}
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('screenshots')}
                    className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                      viewMode === 'screenshots'
                        ? 'bg-cyan font-semibold text-bg'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Preview ({item.screenshots.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('architecture')}
                    className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                      viewMode === 'architecture'
                        ? 'bg-cyan font-semibold text-bg'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Architecture
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setModal(
                      viewMode === 'screenshots' ? 'screenshot' : 'architecture',
                    )
                  }
                  className="font-mono text-xs text-cyan/80 transition-colors hover:text-cyan"
                >
                  Expand ↗
                </button>
              </div>

              {/* Stage Content */}
              {viewMode === 'screenshots' ? (
                <div className="flex flex-col gap-3">
                  <div
                    className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-card border border-white/10 bg-black/50"
                    onClick={() => setModal('screenshot')}
                  >
                    <img
                      src={item.screenshots[screenshotIdx]}
                      alt={`${project?.title} screenshot`}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    {item.screenshots.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setScreenshotIdx(
                              (i) =>
                                (i - 1 + item.screenshots.length) %
                                item.screenshots.length,
                            )
                          }}
                          className="btn-secondary absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 p-0 text-base backdrop-blur"
                          aria-label="Previous screenshot"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setScreenshotIdx(
                              (i) => (i + 1) % item.screenshots.length,
                            )
                          }}
                          className="btn-secondary absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 p-0 text-base backdrop-blur"
                          aria-label="Next screenshot"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Subtle screenshot dot indicators */}
                  {item.screenshots.length > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {item.screenshots.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setScreenshotIdx(idx)}
                          aria-label={`View screenshot ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === screenshotIdx
                              ? 'w-6 bg-cyan'
                              : 'w-2.5 bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="cursor-pointer overflow-hidden rounded-card border border-white/10 transition-colors hover:border-cyan/40"
                  onClick={() => setModal('architecture')}
                >
                  <MermaidChart
                    chart={item.chart}
                    id={`${item.id}-stage`}
                    minHeight="310px"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Architecture Full View Modal */}
      <Modal
        open={modal === 'architecture'}
        onClose={() => setModal(null)}
        title={`${project?.title} — Architecture`}
      >
        <div className="w-full">
          <MermaidChart
            chart={item.chart}
            id={`${item.id}-modal`}
            minHeight="500px"
          />
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
                    setScreenshotIdx(
                      (i) =>
                        (i - 1 + item.screenshots.length) %
                        item.screenshots.length,
                    )
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
                    setScreenshotIdx(
                      (i) => (i + 1) % item.screenshots.length,
                    )
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
