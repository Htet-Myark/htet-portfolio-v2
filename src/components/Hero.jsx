import React from 'react'

export default function Hero() {
  return (
    <section id="hero">
      <p className="hero-eyebrow reveal">
        INITIALIZING PORTFOLIO_v2.1.0
        <span className="cursor-blink" />
      </p>

      <h1 className="hero-name reveal delay-1">
        <span className="name-accent" data-text="HTET MYARK">HTET MYARK</span>
      </h1>

      <p className="hero-title-line2 reveal delay-2">
        IT Student &amp; Developer
      </p>

      <p className="hero-sub reveal delay-3">
        <strong>
        Final-year Diploma in Information Technology student at Singapore Polytechnic.
        Hands-on experience across full-stack development, RPA automation, and AI systems.
        Building at the intersection of code and craft.</strong>
      </p>

      <div className="hero-badges reveal delay-4">
        <span className="badge">Singapore Polytechnic</span>
        <span className="badge">Software Development</span>
        <span className="badge">Graduating Apr 2026</span>
      </div>

      <div className="hero-cta reveal delay-5">
        <a href="#projects" className="btn-primary">PROJECTS ↓</a>
        <a href="#contact" className="btn-secondary">CONNECT</a>
      </div>

      <div className="status-bar reveal delay-6">
        <span className="dot" />
        SYSTEM ONLINE // AVAILABLE FOR OPPORTUNITIES // LOCATION: SINGAPORE
      </div>
    </section>
  )
}
