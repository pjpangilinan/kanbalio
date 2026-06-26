import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Experience from './components/Experience.jsx'
import Education from './components/Education.jsx'
import KanbanBoard from './components/KanbanBoard.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Education />
        <KanbanBoard />
        <Contact />
      </main>
      <footer className="border-t border-white/5 py-10 text-center font-mono text-xs text-text-secondary">
        <p>Built with React · Vite · Tailwind · Framer Motion</p>
      </footer>
    </div>
  )
}
