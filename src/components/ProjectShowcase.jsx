import { motion } from 'framer-motion'
import projects from '../../data/projects.json'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ProjectShowcase() {
  const items = projects.filter(
    (p) => p.type === 'Project' && (p.status === 'done' || p.status === 'in-progress'),
  )

  return (
    <section id="showcase" className="px-6 py-20 md:px-20">
      <div className="mx-auto max-w-container">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Showcase
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Project Archive
          </h2>
          <p className="max-w-xl text-sm text-text-secondary">
            A deeper look into selected projects — architecture, design decisions,
            and what makes each one worth talking about.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <motion.article
              key={item.id}
              variants={card}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="glass glass-hover flex h-full flex-col gap-3 p-6"
            >
              <header className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                {item.id && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    #{item.id}
                  </span>
                )}
              </header>

              {item.description && (
                <p className="text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              )}

              {item.tech_stack?.length > 0 && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {item.tech_stack.slice(0, 6).map((t) => (
                    <li key={t} className="label-tech">
                      {t}
                    </li>
                  ))}
                  {item.tech_stack.length > 6 && (
                    <li className="label-tech-violet">
                      +{item.tech_stack.length - 6}
                    </li>
                  )}
                </ul>
              )}

              <footer className="mt-auto flex flex-wrap gap-3 pt-3 font-mono text-xs">
                {item.github_url && (
                  <a
                    href={item.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline"
                  >
                    Source ↗
                  </a>
                )}
                {item.live_url && (
                  <a
                    href={item.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:underline"
                  >
                    Live ↗
                  </a>
                )}
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
