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
      {/* ambient mesh orbs */}
      <div className="hero-orb hero-orb--emerald" aria-hidden="true" />
      <div className="hero-orb hero-orb--violet" aria-hidden="true" />

      <p className="hero-eyebrow reveal">
        <span className="dot" aria-hidden="true" />
        Software Developer · Singapore
      </p>

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
          <span className="btn-icon" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </a>
        <a href="#contact" className="btn-secondary">
          Connect
        </a>
      </div>

      <div className="hero-links reveal delay-5">
        <a
          href="/Htet_Myark_Aung_Resume.pdf"
          download="Htet_Myark_Aung_Resume.pdf"
          className="link-resume"
        >
          Download Resume
        </a>
        <a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:htetmyark@gmail.com">Email</a>
      </div>

      <div className="status-bar reveal delay-6">
        <span className="dot" aria-hidden="true" />
        Open to opportunities
      </div>
    </section>
  )
}
