import { motion } from 'framer-motion'

export default function KanbanCard({ item, isActive }) {
  const isProject = item.type === 'Project'
  const isCert = item.type === 'Certification'
  const accent = isProject ? 'cyan' : 'violet'
  const tagClass = isProject ? 'label-tech' : 'label-tech-violet'
  const typeLabel = isProject ? 'PROJECT' : isCert ? 'CERTIFICATION' : (item.type || '').toUpperCase()

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`glass glass-hover flex flex-col gap-3 p-6 ${
        isActive ? 'animate-pulse-border' : ''
      }`}
    >
      <header className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
        <div className="flex flex-col items-end gap-1">
          {typeLabel && (
            <span
              className={`font-mono text-[10px] uppercase tracking-widest ${
                isProject ? 'text-cyan' : 'text-violet'
              }`}
            >
              {typeLabel}
            </span>
          )}
          {item.id && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              #{item.id}
            </span>
          )}
        </div>
      </header>

      {item.description && (
        <p className="text-sm leading-relaxed text-text-secondary">
          {item.description}
        </p>
      )}

      {item.tech_stack?.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-2">
          {item.tech_stack.map((t) => (
            <li key={t} className={tagClass}>
              {t}
            </li>
          ))}
        </ul>
      )}

      <Footer item={item} isProject={isProject} accent={accent} />
    </motion.article>
  )
}

function Footer({ item, isProject, accent }) {
  const linkClass = `font-mono text-xs ${accent === 'cyan' ? 'text-cyan' : 'text-violet'} hover:underline`

  if (isProject) {
    if (!item.github_url && !item.live_url) return null
    return (
      <footer className="mt-2 flex flex-wrap gap-3 pt-2">
        {item.github_url && (
          <a href={item.github_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Source ↗
          </a>
        )}
        {item.live_url && (
          <a href={item.live_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Live ↗
          </a>
        )}
      </footer>
    )
  }

  return (
    <footer className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 font-mono text-xs text-text-secondary">
      {item.issuer && <span>{item.issuer}</span>}
      {item.issuer && item.date && <span className="opacity-50">·</span>}
      {item.date && <span>{item.date}</span>}
      {item.credential_url && (
        <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Credential ↗
        </a>
      )}
    </footer>
  )
}
