import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-bg/60 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-container items-center justify-between px-6 py-4 md:px-20">
        <Link
          to="about"
          smooth
          duration={600}
          className="cursor-pointer font-mono text-sm font-medium tracking-widest text-cyan"
        >
          {'<pjpangilinan />'}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link
                to={s.id}
                smooth
                duration={600}
                spy
                activeClass="text-cyan"
                className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-card border border-white/10 md:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-text-primary transition-transform ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-text-primary transition-opacity ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-text-primary transition-transform ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/10 bg-bg/80 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link
                    to={s.id}
                    smooth
                    duration={600}
                    onClick={() => setOpen(false)}
                    className="block cursor-pointer rounded-card px-4 py-3 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
