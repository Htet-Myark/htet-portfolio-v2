import React from 'react'

export default function Hero() {
  return (
    <section id="hero">
      <p className="hero-eyebrow reveal">Portfolio</p>

      <h1 className="hero-name reveal delay-1">Htet Myark</h1>

      <p className="hero-title-line2 reveal delay-2">
        IT Student &amp; Developer
      </p>

      <p className="hero-sub reveal delay-3">
        <strong>
          Fresh graduate with a Diploma in Information Technology from Singapore Polytechnic.
          Hands-on experience across full-stack development, RPA automation, and AI systems.
          Building at the intersection of code and craft.
        </strong>
      </p>

      <div className="hero-badges reveal delay-4">
        <span className="badge">Singapore Polytechnic</span>
        <span className="badge">Software Development</span>
        <span className="badge">Graduated Apr 2026</span>
      </div>

      <div className="hero-cta reveal delay-5">
        <a href="#projects" className="btn-primary">Projects</a>
        <a href="#contact" className="btn-secondary">Connect</a>
      </div>

      <div className="status-bar reveal delay-6">
        <span className="dot" />
        Available for opportunities — Singapore
      </div>
    </section>
  )
}
