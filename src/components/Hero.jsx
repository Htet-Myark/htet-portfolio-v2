import React from 'react'
import GitHubActivity from './GitHubActivity'

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
)

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-meta reveal">
        <span>Software Developer</span>
        <span>Singapore</span>
        <span className="hero-status">
          <i aria-hidden="true" />
          Open to opportunities
        </span>
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-name">Htet Myark</h1>

          <p className="hero-lede reveal delay-1">
            I build full-stack web apps, RPA workflows and small AI tools.
            IT graduate of Singapore Polytechnic, with eleven months shipping
            automation at PSA.
          </p>

          <div className="hero-cta reveal delay-2">
            <a href="#projects" className="btn-primary">
              Selected work
              <Arrow />
            </a>
            <a href="#contact" className="btn-secondary">Get in touch</a>
          </div>

          <ul className="hero-links reveal delay-3">
            <li>
              <a href="/Htet_Myark_Aung_Resume.pdf" download="Htet_Myark_Aung_Resume.pdf">Resume (PDF)</a>
            </li>
            <li><a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="mailto:htetmyark@gmail.com">htetmyark@gmail.com</a></li>
          </ul>
        </div>

        <aside className="hero-aside">
          <GitHubActivity weeks={26} compact className="reveal delay-3" />
        </aside>
      </div>
    </section>
  )
}
