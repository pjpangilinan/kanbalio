import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Experience from './components/Experience.jsx'
import KanbanBoard from './components/KanbanBoard.jsx'
import ProjectShowcase from './components/ProjectShowcase.jsx'
import Contact from './components/Contact.jsx'

function MouseGlow() {
  const [pos, setPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    const onLeave = () => setPos({ x: -999, y: -999 })
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-500"
      style={{
        background: `radial-gradient(300px at ${pos.x}px ${pos.y}px, rgba(0, 212, 255, 0.06), transparent 80%)`,
        opacity: pos.x === -999 ? 0 : 1,
      }}
    />
  )
}

let rippleId = 0

function ClickRipple() {
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    const onClick = (e) => {
      const id = ++rippleId
      setRipples((prev) => [...prev, { x: e.clientX, y: e.clientY, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 800)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return ripples.map((r) => (
    <React.Fragment key={r.id}>
      <span
        className="pointer-events-none fixed z-[60] rounded-full"
        style={{
          left: r.x - 150,
          top: r.y - 150,
          width: 300,
          height: 300,
          border: '1.5px solid rgba(0, 212, 255, 0.5)',
          boxShadow: 'inset 0 0 30px rgba(0, 212, 255, 0.08)',
          animation: 'ripple-expand 0.8s ease-out forwards',
        }}
      />
      <span
        className="pointer-events-none fixed z-[60] rounded-full"
        style={{
          left: r.x - 2,
          top: r.y - 2,
          width: 4,
          height: 4,
          background: '#7C3AED',
          boxShadow: '0 0 8px rgba(124, 58, 237, 0.8)',
          animation: 'ripple-dot 0.8s ease-out forwards',
        }}
      />
    </React.Fragment>
  ))
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <MouseGlow />
      <ClickRipple />
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <KanbanBoard />
        <ProjectShowcase />
        <Contact />
      </main>
      <footer className="border-t border-white/5 py-10 text-center font-mono text-xs text-text-secondary">
        <p>Built with React · Vite · Tailwind · Framer Motion</p>
      </footer>
    </div>
  )
}
