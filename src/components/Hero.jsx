import React, { useEffect, useState } from 'react'

const ROLES = [
  'Software Developer',
  'Full-Stack Builder',
  'RPA Developer',
  'Problem Solver',
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = ROLES[roleIndex]
    let timeout

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIndex])

  return (
    <section id="hero">
      {/* ambient background blobs */}
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />
      <div className="hero-blob hero-blob--3" aria-hidden="true" />

      {/* rising accent sparks */}
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <h1 className="hero-name">Htet Myark</h1>

      <p className="hero-title-line2 reveal delay-2">
        Poly Graduate &amp;{' '}
        <span className="hero-typewriter">
          {displayed}
          <span className="hero-cursor" aria-hidden="true" />
        </span>
      </p>

      <p className="hero-sub reveal delay-3">
        Fresh graduate in IT from <strong>Singapore Polytechnic</strong>, with
        hands-on experience across <strong>full-stack development</strong>,{' '}
        <strong>RPA automation</strong>, and <strong>AI systems</strong>.
      </p>

      <div className="hero-cta reveal delay-4">
        <a href="#projects" className="btn-primary">
          View Projects
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href="#contact" className="btn-secondary">
          Connect
        </a>
      </div>

      <div className="status-bar reveal delay-5">
        <span className="dot" aria-hidden="true" />
        Open to opportunities in Singapore
      </div>
    </section>
  )
}
