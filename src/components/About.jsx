import React, { useEffect, useRef, useState } from 'react'
import { certs } from './Certificates'
import { projects } from './Projects'
import SectionHead from './SectionHead'

/* Counts derive from the real section data so they can never drift out of sync.
   Only hand-written figures live here. */
const stats = [
  { value: certs.length,    label: 'Certifications' },
  { value: projects.length, label: 'Projects shipped' },
  { value: 11,              label: 'Months in industry' },
]

const format = (n) => n.toLocaleString('en-US')

/* Counts up once, the first time the strip scrolls into view. */
function useCountUp(target, duration = 1200) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setValue(target)
      return
    }

    let frame
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(target * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return [ref, value]
}

function Stat({ value, suffix, label }) {
  const [ref, current] = useCountUp(value)
  return (
    <div className="stat-cell" ref={ref}>
      <div className="stat-value">
        {format(current)}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about">
      <SectionHead eyebrow="About" title="Logic first, then the pixels." />

      {/* bento: one large story tile, then facts at mixed sizes */}
      <div className="bento">
        <article className="tile tile--story reveal">
          <p className="tile-label">Who I am</p>
          <p className="tile-statement">
            I'm an <strong>aspiring software developer</strong> with a strong foundation in both
            front-end and back-end technologies. My journey into IT was driven by
            a love for math and logic.
          </p>
          <p className="tile-body">
            Since then I've built across enterprise systems, RPA workflows and web
            applications. I enjoy the whole stack, from crafting clean UIs to
            integrating APIs and deploying containerised services. Always learning,
            always shipping.
          </p>
        </article>

        {stats.map((s, i) => (
          <article className={`tile tile--stat reveal delay-${i + 1}`} key={s.label}>
            <Stat {...s} />
          </article>
        ))}

        <article className="tile tile--dark reveal delay-2">
          <p className="tile-label">Right now</p>
          <p className="tile-title">
            <span className="live-dot" aria-hidden="true" />
            Open to opportunities
          </p>
          <p className="tile-body">Based in Singapore. Looking for software developer and automation roles.</p>
        </article>

        <article className="tile reveal delay-3">
          <p className="tile-label">Studied</p>
          <p className="tile-title">Diploma in IT</p>
          <p className="tile-body">Singapore Polytechnic, Software Development. GPA 3.6 / 4.0</p>
        </article>

        <article className="tile reveal delay-4">
          <p className="tile-label">Worked</p>
          <p className="tile-title">PSA Corporation</p>
          <p className="tile-body">RPA Developer intern, Apr 2025 to Feb 2026</p>
        </article>

        <article className="tile tile--blue reveal delay-5">
          <p className="tile-label">Speaks</p>
          <p className="tile-title">Rakhine, Burmese &amp; English</p>
        </article>
      </div>
    </section>
  )
}
