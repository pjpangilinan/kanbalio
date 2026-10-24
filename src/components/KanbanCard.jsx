import { useState } from 'react'
import { motion } from 'framer-motion'

const MAX_VISIBLE_TAGS = 5

export default function KanbanCard({ item, isActive }) {
  const [showAllTags, setShowAllTags] = useState(false)
  const isProject = item.type === 'Project'
  const isCert = item.type === 'Certification'
  const accent = isProject ? 'cyan' : 'violet'
  const tagClass = isProject ? 'label-tech' : 'label-tech-violet'
  const typeLabel = isProject
    ? 'PROJECT'
    : isCert
      ? 'CERTIFICATION'
      : (item.type || '').toUpperCase()

  const tags = item.tech_stack ?? []
  const visibleTags = showAllTags ? tags : tags.slice(0, MAX_VISIBLE_TAGS)
  const hiddenCount = tags.length - visibleTags.length

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={`glass glass-hover flex flex-col gap-2.5 p-4 sm:p-5 ${
        isActive ? 'animate-pulse-border' : ''
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-text-primary">
          {item.title}
        </h3>
        {typeLabel && (
          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${
              isProject ? 'text-cyan' : 'text-violet'
            }`}
          >
            {typeLabel}
          </span>
        )}
      </header>

      {item.description && (
        <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
          {item.description}
        </p>
      )}

      {tags.length > 0 && (
        <ul className="flex flex-wrap items-center gap-1.5 pt-1">
          {visibleTags.map((t) => (
            <li key={t} className={`${tagClass} px-2.5 py-0.5 text-[11px]`}>
              {t}
            </li>
          ))}
          {hiddenCount > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setShowAllTags(true)}
                className="rounded-full border border-white/15 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-cyan/40 hover:text-cyan"
              >
                +{hiddenCount} more
              </button>
            </li>
          )}
        </ul>
      )}

      <Footer item={item} isProject={isProject} accent={accent} />
    </motion.article>
  )
}

function Footer({ item, isProject, accent }) {
  const linkClass = `font-mono text-xs ${
    accent === 'cyan' ? 'text-cyan' : 'text-violet'
  } hover:underline`

  if (isProject) {
    if (!item.github_url && !item.live_url) return null
    return (
      <footer className="mt-1 flex flex-wrap gap-4 border-t border-white/5 pt-2.5">
        {item.live_url && (
          <a
            href={item.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Live Demo ↗
          </a>
        )}
        {item.github_url && (
          <a
            href={item.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Source ↗
          </a>
        )}
      </footer>
    )
  }

  return (
    <footer className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-white/5 pt-2.5 font-mono text-[11px] text-text-secondary">
      {item.issuer && <span>{item.issuer}</span>}
      {item.issuer && item.date && <span className="opacity-50">·</span>}
      {item.date && <span>{item.date}</span>}
      {item.credential_url && (
        <a
          href={item.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`ml-auto ${linkClass}`}
        >
          Credential ↗
        </a>
      )}
    </footer>
  )
}
