import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import experience from '../../data/experience.json'

function formatRange(start, end) {
  const s = start?.trim()
  const e = end?.trim()
  if (s && e) return `${s} – ${e}`
  return s || e || ''
}

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="experience"
      ref={ref}
      className="relative px-6 py-20 md:px-20"
    >
      <div className="mx-auto max-w-container">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            02 · Experience
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Career Trajectory
          </h2>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block">
            <motion.div
              style={{ scaleY, transformOrigin: 'top' }}
              className="h-full w-px bg-gradient-to-b from-cyan/0 via-cyan to-cyan/0"
            />
          </div>

          <ol className="flex flex-col gap-12 md:gap-16">
            {experience.map((entry, idx) => {
              const isEven = idx % 2 === 0
              return (
                <motion.li
                  key={`${entry.company}-${entry.start_date}-${idx}`}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative md:grid md:grid-cols-2 md:gap-12"
                >
                  <div
                    className={`hidden md:block ${
                      isEven ? 'md:col-start-1 md:text-right' : 'md:col-start-2'
                    }`}
                  >
                    <div className="glass glass-hover inline-block p-6 text-left">
                      <CardBody entry={entry} align={isEven ? 'right' : 'left'} />
                    </div>
                  </div>

                  <div
                    className={`hidden md:flex md:items-center md:justify-center ${
                      isEven ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-cyan shadow-[0_0_18px_rgba(0,212,255,0.7)]" />
                  </div>

                  <div className="md:hidden">
                    <div className="glass glass-hover p-6">
                      <CardBody entry={entry} align="left" />
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function CardBody({ entry, align }) {
  const dates = formatRange(entry.start_date, entry.end_date)
  const isRight = align === 'right'

  return (
    <div className={`flex flex-col gap-3 ${isRight ? 'items-end' : 'items-start'}`}>
      {dates && (
        <p className="font-mono text-xs uppercase tracking-widest text-cyan">
          {dates}
        </p>
      )}
      <h3 className="text-xl font-semibold text-text-primary">{entry.role}</h3>
      <p className="text-sm text-text-secondary">
        {entry.company}
        {entry.location && (
          <span className="text-text-secondary/70"> · {entry.location}</span>
        )}
      </p>
      <ul
        className={`mt-2 flex flex-col gap-2 text-sm text-text-secondary ${
          isRight ? 'items-end text-right' : 'items-start text-left'
        }`}
      >
        {entry.bullets.map((b) => (
          <li key={b} className="max-w-md">
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}
