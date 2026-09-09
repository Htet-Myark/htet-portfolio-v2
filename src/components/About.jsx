import React, { useEffect, useRef, useState } from 'react'
import { certs } from './Certificates'
import { projects } from './Projects'

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
      <h2 className="section-heading reveal">About</h2>
      <div className="about-grid">
        <div className="about-text">
          <p className="reveal delay-1">
            I'm an <strong>aspiring software developer</strong> with a strong foundation in both
            front-end and back-end technologies. My journey into IT was driven by
            a love for math and logic, and I've since built experience across
            enterprise systems, RPA workflows, and web applications.
          </p>
          <p className="reveal delay-2">
            I enjoy working across the full stack, from crafting clean UIs to
            integrating APIs and deploying containerised services. Always learning,
            always shipping.
          </p>
        </div>
        <ul className="detail-list">
          <li className="reveal-left delay-1">Singapore Polytechnic · Diploma in IT (Software Dev)</li>
          <li className="reveal-left delay-2">Intern @ PSA Corporation Ltd</li>
          <li className="reveal-left delay-3">Speaks Rakhine, Burmese &amp; English</li>
        </ul>
      </div>
      <div className="stat-strip reveal delay-3">
        <div className="card-core">
          {stats.map((s, i) => <Stat key={i} {...s} />)}
        </div>
      </div>
    </section>
  )
}
