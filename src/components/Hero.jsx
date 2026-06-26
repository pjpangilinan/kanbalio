import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'

const ROLES = ['Cloud Engineer', 'DevOps Engineer']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const PRIMARY = ['Python', 'Bash', 'React', 'FastAPI', 'Git', 'Postman']
const LEARNING = ['Go', 'JavaScript', 'AWS', 'Docker', 'CI/CD']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2800,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="about"
      className="relative flex min-h-[80vh] items-center px-6 pt-28 md:px-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6"
      >
        <motion.p
          variants={item}
          className="font-mono text-xs uppercase tracking-[0.3em] text-cyan"
        >
          System Online · Portfolio v1
        </motion.p>

        <motion.h1
          variants={item}
          className="font-sans text-5xl font-extrabold leading-tight tracking-tight text-text-primary md:text-6xl"
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
            Patrick James Pangilinan
          </span>
          .
        </motion.h1>

        <motion.div variants={item} className="flex h-9 items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="font-mono text-lg text-text-secondary"
            >
              {ROLES[roleIndex]}
              <span className="ml-1 inline-block h-5 w-2 translate-y-0.5 animate-pulse bg-cyan" />
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            Open to: Cloud & DevOps Engineer roles
          </span>
          <span className="text-text-secondary/40">·</span>
          <span>Remote-friendly</span>
        </motion.div>

        <motion.p
          variants={item}
          className="max-w-2xl text-base leading-relaxed text-text-secondary"
        >
          Aspiring Cloud and DevOps engineer. I design and deploy full-stack
          applications with Python, React, and Docker, and I care about
          automated CI/CD pipelines and clean infrastructure. Currently
          levelling up on AWS and infrastructure-as-code through hands-on
          projects.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
          <Link to="projects" smooth duration={600}>
            <span className="btn-primary cursor-pointer">View Projects</span>
          </Link>
          <a
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Download CV
          </a>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-20 font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">
              Primary
            </span>
            <ul className="flex flex-wrap gap-2" aria-label="Primary skills">
              {PRIMARY.map((t) => (
                <li key={t} className="label-tech border-cyan/60 text-cyan">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary">
              Learning
            </span>
            <ul className="flex flex-wrap gap-2" aria-label="Skills in progress">
              {LEARNING.map((t) => (
                <li key={t} className="label-tech">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
