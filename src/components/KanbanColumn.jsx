import KanbanCard from './KanbanCard.jsx'

const BORDER_BY_KEY = {
  todo: 'border-violet/50',
  inProgress: 'border-cyan/60 animate-pulse-border',
  done: 'border-emerald-400/50',
}

export default function KanbanColumn({ columnKey, label, items }) {
  const borderClass = BORDER_BY_KEY[columnKey] ?? 'border-white/10'

  return (
    <div className="flex h-full flex-col">
      <header className="mb-6 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
          {label}
        </h3>
        <span className="font-mono text-xs text-text-secondary">
          {items.length} card{items.length === 1 ? '' : 's'}
        </span>
      </header>

      <ul className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <li className="glass flex flex-1 items-center justify-center p-6 text-center text-sm text-text-secondary">
            Nothing here yet.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id ?? item.title}
              className={`rounded-card border ${borderClass} p-0`}
            >
              <KanbanCard item={item} isActive={columnKey === 'inProgress'} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
