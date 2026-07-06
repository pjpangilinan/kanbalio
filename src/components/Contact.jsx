import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/pjpangilinan' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/patrick-james-pangilinan-490a41329/' },
  { label: 'Email', href: 'mailto:patrickjpangilinan@protonmail.com' },
]

const STATUS_LINE = {
  idle: (
    <span>
      <span className="text-cyan">./send_message</span>
      <span className="text-text-secondary/60"> —return</span>
    </span>
  ),
  sending: (
    <span className="text-yellow-400/80">
      transmitting
      <span className="inline-block w-1 animate-pulse">_</span>
    </span>
  ),
  sent: (
    <span className="text-green-400">
      ./send_message → 200 OK ✓
    </span>
  ),
  error: (
    <span className="text-red-400">
      ./send_message → connection refused{' '}
      <span className="text-text-secondary/60">(click to retry)</span>
    </span>
  ),
}

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focusField, setFocusField] = useState(null)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(serviceId, templateId, form, { publicKey })
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  const cursor = (field) =>
    focusField === field ? (
      <span className="inline-block h-4 w-2 animate-pulse bg-cyan" />
    ) : null

  return (
    <section id="contact" className="px-6 py-20 md:px-20">
      <div className="mx-auto max-w-[640px]">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            04 · Contact
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Let's talk.
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="glass overflow-hidden"
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs tracking-wide text-text-secondary">
              contact.sh — bash — {form.name || 'anonymous'}
            </span>
          </div>

          <div className="flex flex-col gap-0 p-4 font-mono text-sm">
            <div className="flex items-center gap-2 pb-2 text-text-secondary/60">
              <span className="text-green-400">$</span>
              <span>cat &lt;&lt; EOF | ./send_message</span>
            </div>

            <div className="flex items-center gap-2 border-l-2 border-cyan/30 py-1.5 pl-4">
              <span className="text-text-secondary/60 w-10 shrink-0">To:</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusField('name')}
                onBlur={() => setFocusField(null)}
                required
                placeholder="your name"
                className="flex-1 bg-transparent font-mono text-sm text-text-primary outline-none placeholder:text-text-secondary/30"
              />
              {cursor('name')}
            </div>

            <div className="flex items-center gap-2 border-l-2 border-cyan/30 py-1.5 pl-4">
              <span className="text-text-secondary/60 w-10 shrink-0">From:</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
                required
                placeholder="you@domain.com"
                className="flex-1 bg-transparent font-mono text-sm text-text-primary outline-none placeholder:text-text-secondary/30"
              />
              {cursor('email')}
            </div>

            <div className="flex gap-2 border-l-2 border-cyan/30 py-1.5 pl-4">
              <span className="text-text-secondary/60 w-10 shrink-0 pt-0.5">
                Body:
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={() => setFocusField('message')}
                onBlur={() => setFocusField(null)}
                required
                rows={3}
                placeholder="your message..."
                className="flex-1 bg-transparent font-mono text-sm text-text-primary outline-none resize-none placeholder:text-text-secondary/30"
              />
              {cursor('message')}
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
              <span className="text-green-400">$</span>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="text-left transition-colors hover:text-cyan disabled:opacity-60"
              >
                {STATUS_LINE[status]}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2 text-text-secondary/40">
              <span className="text-green-400/60">$</span>
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf?v=${__BUILD_DATE__}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary/60 transition-colors hover:text-cyan"
              >
                cat resume.pdf
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-text-secondary">
              <span className="text-green-400/60">$</span>
              <span>Open ports:</span>
              {SOCIALS.map((s, i) => (
                <span key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan transition-colors hover:text-violet"
                  >
                    {s.label.toLowerCase()}
                  </a>
                  {i < SOCIALS.length - 1 && (
                    <span className="ml-1 text-text-secondary/30">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
