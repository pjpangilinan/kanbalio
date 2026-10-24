import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KanbanColumn from './KanbanColumn.jsx'
import projects from '../../data/projects.json'

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const FILTERS = [
  { key: 'Project', label: 'Projects' },
  { key: 'Certification', label: 'Certifications' },
  { key: 'all', label: 'All' },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
}

export default function KanbanBoard() {
  const [active, setActive] = useState(2) // default to 'Done' on mobile where most shipped work lives
  const [direction, setDirection] = useState(1)
  const [typeFilter, setTypeFilter] = useState('Project')

  const grouped = useMemo(() => {
    const filtered =
      typeFilter === 'all'
        ? projects
        : projects.filter((p) => p.type === typeFilter)

    return filtered.reduce((acc, p) => {
      const key = p.status ?? 'todo'
      if (!acc[key]) acc[key] = []
      acc[key].push(p)
      return acc
    }, {})
  }, [typeFilter])

  const countsByType = useMemo(() => {
    return {
      Project: projects.filter((p) => p.type === 'Project').length,
      Certification: projects.filter((p) => p.type === 'Certification').length,
      all: projects.length,
    }
  }, [])

  const prev = () => {
    setDirection(-1)
    setActive((i) => (i - 1 + COLUMNS.length) % COLUMNS.length)
  }
  const next = () => {
    setDirection(1)
    setActive((i) => (i + 1) % COLUMNS.length)
  }

  const col = COLUMNS[active]
  const items = grouped[col.key] ?? []

  return (
    <section id="projects" className="relative px-6 py-16 md:px-16 lg:px-20">
      <div className="mx-auto max-w-container">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
            03 · Projects & Credentials
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Kanban Board
          </h2>
          <p className="max-w-lg text-sm text-text-secondary">
            Real work, real status. Filter between shipped engineering projects
            and industry certifications.
          </p>

          {/* Filter Pills */}
          <div className="mt-2 inline-flex items-center rounded-lg border border-white/10 bg-black/40 p-1">
            {FILTERS.map((f) => {
              const isSelected = typeFilter === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setTypeFilter(f.key)}
                  className={`rounded-md px-3.5 py-1.5 font-mono text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan font-semibold text-bg'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {f.label}{' '}
                  <span
                    className={`ml-1 text-[10px] ${
                      isSelected ? 'text-bg/80' : 'text-text-secondary/60'
                    }`}
                  >
                    ({countsByType[f.key]})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Desktop 3-Column True Kanban View (lg+) */}
        <div className="hidden grid-cols-3 gap-6 lg:grid">
          {COLUMNS.map((c) => {
            const colItems = grouped[c.key] ?? []
            return (
              <div
                key={c.key}
                className="glass flex max-h-[600px] flex-col p-5"
              >
                <KanbanColumn
                  columnKey={c.key}
                  label={c.label}
                  items={colItems}
                />
              </div>
            )
          })}
        </div>

        {/* Mobile / Tablet Single-Column Carousel (< lg) */}
        <div className="glass mx-auto flex max-w-2xl flex-col p-6 lg:hidden">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous column"
              className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
            >
              ‹
            </button>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                {col.label} · {items.length}
              </span>
              <div className="flex items-center gap-2">
                {COLUMNS.map((c, i) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setDirection(i > active ? 1 : -1)
                      setActive(i)
                    }}
                    aria-label={`Switch to ${c.label}`}
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
              aria-label="Next column"
              className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
            >
              ›
            </button>
          </div>

          <div className="relative min-h-[460px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={`${col.key}-${typeFilter}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <KanbanColumn
                  columnKey={col.key}
                  label={col.label}
                  items={items}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
