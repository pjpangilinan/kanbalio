import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'

const ROLES = ['Cloud Engineer', 'DevOps Engineer', 'Agentic Engineer']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const PRIMARY = ['Python', 'Go', 'TypeScript', 'React', 'AWS CDK', 'Docker', 'CI/CD', 'LangGraph']
const LEARNING = ['Kubernetes', 'Terraform', 'Rust']

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
      className="relative flex min-h-screen items-center px-6 pt-24 pb-16 md:px-16 lg:px-20"
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-5 lg:col-span-7"
        >
          <motion.p
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.25em] text-cyan"
          >
            System Online · Portfolio
          </motion.p>

          <motion.h1
            variants={item}
            className="font-sans text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl"
          >
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
              Patrick James Pangilinan
            </span>
            .
          </motion.h1>

          <motion.div variants={item} className="flex h-8 items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="font-mono text-base text-text-secondary sm:text-lg"
              >
                {ROLES[roleIndex]}
                <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-cyan" />
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              Available now
            </span>
            <span className="text-text-secondary/40">·</span>
            <span>Remote-friendly</span>
            <span className="text-text-secondary/40">·</span>
            <span>Philippines</span>
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base"
          >
            Cloud, DevOps, and Agentic Engineer. I design and deploy
            full-stack applications with Python, Go, React, and Docker, focusing
            on automated CI/CD pipelines, clean serverless infrastructure, and
            AI-augmented systems on AWS.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3 pt-1">
            <Link to="showcase" smooth duration={600}>
              <span className="btn-primary cursor-pointer">View Projects</span>
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}resume.pdf?v=${__BUILD_DATE__}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Download CV
            </a>
          </motion.div>

          {/* Mobile-only inline stack tags (preserves exact mobile feel) */}
          <motion.div variants={item} className="flex flex-col gap-3 pt-3 lg:hidden">
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

        {/* Desktop-only balanced Stack & Snapshot Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass hidden flex-col gap-5 p-6 lg:col-span-5 lg:flex"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
              Stack & Focus
            </span>
            <span className="font-mono text-[11px] text-text-secondary">
              AWS · Go · LangGraph
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              Core Stack
            </span>
            <ul className="flex flex-wrap gap-1.5" aria-label="Primary skills">
              {PRIMARY.map((t) => (
                <li key={t} className="label-tech border-cyan/50 text-cyan">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              Expanding Into
            </span>
            <ul className="flex flex-wrap gap-1.5" aria-label="Skills in progress">
              {LEARNING.map((t) => (
                <li key={t} className="label-tech">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
            <div className="rounded bg-black/25 px-2 py-2">
              <p className="font-mono text-lg font-bold text-text-primary">6+</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                Live Systems
              </p>
            </div>
            <div className="rounded bg-black/25 px-2 py-2">
              <p className="font-mono text-lg font-bold text-cyan">255+</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                Automated Tests
              </p>
            </div>
            <div className="rounded bg-black/25 px-2 py-2">
              <p className="font-mono text-lg font-bold text-text-primary">10</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                Certifications
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
