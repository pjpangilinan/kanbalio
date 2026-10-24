import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendChatMessage } from '../lib/rag-api'

const WELCOME = {
  role: 'bot',
  text: "Hi! I'm Patrick's AI assistant. Ask me about his projects, skills, certifications, or experience.",
}

const SUGGESTIONS = [
  'What AWS projects has Patrick built?',
  'What certifications does he have?',
  'Tell me about his tech stack',
]

function Dots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan/60 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan/60 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan/60 [animation-delay:300ms]" />
    </span>
  )
}

function renderInline(str) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  const parts = str.split(tokenRegex)

  return parts.map((part, idx) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-cyan"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan underline hover:text-violet"
        >
          {linkMatch[1]}
        </a>
      )
    }
    return part
  })
}

function FormattedMessage({ text }) {
  if (!text) return null

  // Normalize single-line flattened markdown (headings and inline bullets)
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/([^\n])\s*(#{1,4}\s+)/g, '$1\n$2')
    .replace(/(:\s*|\.\s+|\?\s+|!\s+|;\s+|"\s+)-\s+(\*\*|[A-Z])/g, '$1\n- $2')
    .replace(/([^\n])\s+-\s+(\*\*[^*]+\*\*:)/g, '$1\n- $2')

  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean)
  const blocks = []
  let currentList = []

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList })
      currentList = []
    }
  }

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/)
    if (headingMatch) {
      flushList()
      blocks.push({
        type: 'heading',
        content: headingMatch[2].replace(/:$/, ''),
      })
      return
    }

    const bulletMatch = line.match(/^[-*•]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/)
    if (bulletMatch) {
      currentList.push(bulletMatch[1])
      return
    }

    flushList()
    blocks.push({ type: 'paragraph', content: line })
  })
  flushList()

  return (
    <div className="flex flex-col gap-2 text-xs leading-relaxed sm:text-sm">
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          return (
            <p
              key={i}
              className="mt-1 border-b border-white/10 pb-1 font-mono text-xs font-semibold uppercase tracking-wider text-cyan"
            >
              {renderInline(b.content)}
            </p>
          )
        }
        if (b.type === 'list') {
          return (
            <ul key={i} className="flex flex-col gap-1.5 pl-1">
              {b.items.map((itemText, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/70" />
                  <span className="flex-1">{renderInline(itemText)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="leading-relaxed">
            {renderInline(b.content)}
          </p>
        )
      })}
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const answer = await sendChatMessage(msg)
      setMessages((prev) => [...prev, { role: 'bot', text: answer }])
    } catch (err) {
      setError('Something went wrong. Try again.')
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-bg shadow-lg transition-shadow hover:shadow-[0_0_24px_rgba(0,212,255,0.5)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[80] flex w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-white/10 bg-bg/95 shadow-2xl backdrop-blur-xl sm:w-[420px]"
          >
            {/* Header */}
            <div className="border-b border-white/10 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                Ask about Patrick
              </p>
              <p className="mt-0.5 text-[11px] text-text-secondary">
                RAG-powered · Bedrock + Lambda
              </p>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
              style={{ maxHeight: '420px' }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-cyan/20 text-text-primary'
                        : 'border border-white/10 bg-white/5 text-text-secondary'
                    }`}
                  >
                    {m.role === 'user' ? m.text : <FormattedMessage text={m.text} />}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <Dots />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-center text-xs text-red-400">{error}</p>
              )}
            </div>

            {/* Suggestions (show only when no messages beyond welcome) */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-text-secondary transition-colors hover:border-cyan/30 hover:text-cyan"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/10 px-4 py-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={loading}
                  className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan/50 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan text-bg transition-opacity hover:opacity-90 disabled:opacity-30"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
