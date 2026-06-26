import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/pjpangilinan' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/patrick-james-pangilinan-490a41329/' },
  { label: 'Email', href: 'mailto:patrickjpangilinan@protonmail.com' },
]

const STATUS = {
  idle: 'Send Message',
  sending: 'Sending…',
  sent: 'Sent ✓',
  error: 'Failed — retry',
}

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

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
      setTimeout(() => setStatus('idle'), 2400)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="px-6 py-20 md:px-20">
      <div className="mx-auto max-w-[560px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            04 · Contact
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Let's talk.
          </h2>
          <p className="text-sm text-text-secondary">
            Have a project in mind? Drop a message and I'll get back to you.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="glass glass-hover flex flex-col gap-4 p-8"
        >
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="input-field"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@domain.com"
              className="input-field"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Message
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell me about the project…"
              className="input-field resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary mt-2 disabled:opacity-60"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {STATUS[status]}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href={`${import.meta.env.BASE_URL}resume.pdf?v=${__BUILD_DATE__}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-1"
          >
            View Résumé ↗
          </a>
        </form>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover inline-flex items-center rounded-pill px-4 py-2 font-mono text-xs text-text-primary"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
