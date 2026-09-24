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
    <section id="showcase" className="px-4 py-20 sm:px-6 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            02 · Showcase
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Flagship System Architectures
          </h2>
          <p className="max-w-2xl text-xs text-text-secondary sm:text-sm">
            Interactive deep-dives into production cloud systems, event-driven backends, and agentic workflows.
          </p>
        </div>

        {/* Side + Showcase Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Rail: System Index */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Select System
              </span>
              <span className="font-mono text-xs text-cyan">
                0{active + 1} / 0{SHOWCASE.length}
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {SHOWCASE.map((s, idx) => {
                const p = projects.find((proj) => proj.id === s.id)
                const isActive = idx === active
                const shortTitle = p ? p.title.split('—')[0].trim() : s.id
                const subtitle = p ? (p.title.split('—')[1]?.trim() || p.description) : ''

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectProject(idx)}
                    className={`flex shrink-0 flex-col items-start gap-1 rounded-card border p-3.5 text-left transition-all duration-200 w-64 lg:w-full ${
                      isActive
                        ? 'border-cyan/70 bg-cyan/10 shadow-[0_0_24px_rgba(0,212,255,0.18)]'
                        : 'border-white/10 bg-white/[0.02] text-text-secondary hover:border-white/20 hover:bg-white/[0.05] hover:text-text-primary'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className={`font-mono text-xs ${isActive ? 'font-bold text-cyan' : 'text-text-secondary/60'}`}>
                        0{idx + 1}
                      </span>
                      {idx === 0 && (
                        <span className="rounded bg-cyan/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">
                          Lead
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-semibold leading-snug ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {shortTitle}
                    </span>
                    <span className="line-clamp-1 text-[11px] text-text-secondary/70">
                      {subtitle}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 hidden items-center justify-between px-1 font-mono text-[11px] text-text-secondary/50 lg:flex">
              <span>Navigate: ← → keys</span>
              <span>{SHOWCASE.length} systems</span>
            </div>
          </aside>

          {/* Right Stage: Interactive Showcase Canvas */}
          <main className="lg:col-span-8 xl:col-span-9">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={item.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="glass flex flex-col gap-6 p-6 sm:p-8"
              >
                {/* Active System Header Bar */}
                <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
                        System 0{active + 1}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-cyan/60" />
                      <span className="font-mono text-xs text-text-secondary">
                        {project?.date || '2026'}
                      </span>
                    </div>

                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                      {project?.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {project?.description}
                    </p>

                    {project?.tech_stack && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tech_stack.map((t) => (
                          <span key={t} className="label-tech py-0.5 px-2.5 text-[11px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Links */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2 pt-2 md:pt-0">
                    {project?.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-2 px-4 font-mono text-xs"
                      >
                        Live System ↗
                      </a>
                    )}
                    {project?.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary py-2 px-4 font-mono text-xs"
                      >
                        Repository ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* View Switcher Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-white/10 bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('dual')}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                        viewMode === 'dual'
                          ? 'bg-cyan text-bg font-semibold shadow'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Side-by-Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('architecture')}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                        viewMode === 'architecture'
                          ? 'bg-cyan text-bg font-semibold shadow'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Architecture
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('screenshots')}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                        viewMode === 'screenshots'
                          ? 'bg-cyan text-bg font-semibold shadow'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Screenshots ({item.screenshots.length})
                    </button>
                  </div>

                  <span className="font-mono text-xs text-text-secondary/60">
                    Click cards to expand full-screen
                  </span>
                </div>

                {/* Main Content Area */}
                {viewMode === 'dual' && (
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* Architecture Card */}
                    <div
                      className="glass group flex cursor-pointer flex-col overflow-hidden border border-white/10 p-5 transition-all hover:border-cyan/40"
                      onClick={() => setModal('architecture')}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                          Architecture Diagram
                        </span>
                        <span className="font-mono text-[11px] text-cyan/70 transition-colors group-hover:text-cyan">
                          Full View ↗
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-center">
                        <MermaidChart chart={item.chart} id={`${item.id}-dual`} minHeight="360px" />
                      </div>
                    </div>

                    {/* Screenshot Card */}
                    <div className="glass group flex flex-col overflow-hidden border border-white/10 p-5 transition-all hover:border-cyan/40">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                          Interface Preview ({screenshotIdx + 1}/{item.screenshots.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setModal('screenshot')}
                          className="font-mono text-[11px] text-cyan/70 transition-colors hover:text-cyan"
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
                              className={`relative h-12 w-20 shrink-0 overflow-hidden rounded border transition-all ${
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

                {viewMode === 'architecture' && (
                  <div
                    className="glass group flex cursor-pointer flex-col overflow-hidden border border-white/10 p-6 transition-all hover:border-cyan/40"
                    onClick={() => setModal('architecture')}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                        Architecture & Data Flow
                      </span>
                      <span className="font-mono text-[11px] text-cyan/70 transition-colors group-hover:text-cyan">
                        Expand full-screen ↗
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                      <MermaidChart chart={item.chart} id={`${item.id}-single`} minHeight="460px" />
                    </div>
                  </div>
                )}

                {viewMode === 'screenshots' && (
                  <div className="glass group flex flex-col overflow-hidden border border-white/10 p-6 transition-all hover:border-cyan/40">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                        Screenshots & UI ({screenshotIdx + 1}/{item.screenshots.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setModal('screenshot')}
                        className="font-mono text-[11px] text-cyan/70 transition-colors hover:text-cyan"
                      >
                        Fullscreen ↗
                      </button>
                    </div>

                    <div
                      className="relative flex aspect-video max-h-[560px] cursor-pointer items-center justify-center overflow-hidden rounded-card border border-white/10 bg-black/40"
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
                            className="btn-secondary absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 text-xl backdrop-blur"
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
                            className="btn-secondary absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 text-xl backdrop-blur"
                            aria-label="Next screenshot"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {item.screenshots.length > 1 && (
                      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                        {item.screenshots.map((s, idx) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setScreenshotIdx(idx)}
                            className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-card border transition-all ${
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
          </main>
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
