import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KanbanColumn from './KanbanColumn.jsx'
import projects from '../../data/projects.json'

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
}

export default function KanbanBoard() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const grouped = useMemo(() => {
    return projects.reduce((acc, p) => {
      const key = p.status ?? 'todo'
      if (!acc[key]) acc[key] = []
      acc[key].push(p)
      return acc
    }, {})
  }, [])

  const prev = () => {
    setDirection(-1)
    setActive((i) => (i - 1 + COLUMNS.length) % COLUMNS.length)
  }
  const next = () => {
    setDirection(1)
    setActive((i) => (i + 1) % COLUMNS.length)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const col = COLUMNS[active]
  const items = grouped[col.key] ?? []

  return (
    <section id="projects" className="relative px-6 py-20 md:px-20">
      <div className="mx-auto max-w-container">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            03 · Projects
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Kanban Board
          </h2>
          <p className="max-w-xl text-sm text-text-secondary">
            Real work, real status. Projects and certifications — one column at a
            time. Use the arrows, or swipe with ← →.
          </p>
        </div>

        <div className="glass mx-auto flex max-w-5xl flex-col p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous column"
              className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
            >
              ‹
            </button>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
                {col.label} · {items.length}
              </span>
              <div className="flex gap-2">
                {COLUMNS.map((c, i) => (
                  <span
                    key={c.key}
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
              aria-label="Next column"
              className="btn-secondary h-10 w-10 rounded-full p-0 text-lg"
            >
              ›
            </button>
          </div>

          <div className="relative min-h-[480px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={col.key}
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
