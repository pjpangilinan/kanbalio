import { useState, useEffect } from 'react'
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
        background: `radial-gradient(600px at ${pos.x}px ${pos.y}px, rgba(0, 212, 255, 0.06), transparent 80%)`,
        opacity: pos.x === -999 ? 0 : 1,
      }}
    />
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <MouseGlow />
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
