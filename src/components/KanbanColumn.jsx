import KanbanCard from './KanbanCard.jsx'

const BORDER_BY_KEY = {
  todo: 'border-violet/40',
  'in-progress': 'border-cyan/50 animate-pulse-border',
  done: 'border-emerald-400/40',
}

const DOT_BY_KEY = {
  todo: 'bg-violet',
  'in-progress': 'bg-cyan shadow-[0_0_8px_rgba(0,212,255,0.7)]',
  done: 'bg-emerald-400',
}

export default function KanbanColumn({ columnKey, label, items }) {
  const borderClass = BORDER_BY_KEY[columnKey] ?? 'border-white/10'
  const dotClass = DOT_BY_KEY[columnKey] ?? 'bg-white/40'

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-text-primary">
            {label}
          </h3>
        </div>
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-text-secondary">
          {items.length}
        </span>
      </header>

      <ul className="flex flex-1 flex-col gap-3.5 overflow-y-auto pr-1.5">
        {items.length === 0 ? (
          <li className="flex flex-1 items-center justify-center rounded-card border border-dashed border-white/10 p-6 text-center font-mono text-xs text-text-secondary">
            No items in {label.toLowerCase()}.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id ?? item.title}
              className={`rounded-card border ${borderClass} p-0`}
            >
              <KanbanCard item={item} isActive={columnKey === 'in-progress'} />
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
