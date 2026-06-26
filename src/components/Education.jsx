import { motion } from 'framer-motion'
import education from '../../data/education.json'

export default function Education() {
  return (
    <section className="px-6 py-10 md:px-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            Education
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {education.map((entry) => (
            <motion.li
              key={entry.school}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="glass glass-hover p-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                {entry.start_date} – {entry.end_date}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-text-primary">
                {entry.degree}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">{entry.school}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
