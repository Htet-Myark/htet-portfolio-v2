import React from 'react'
import GitHubActivity from './GitHubActivity'

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-badges" aria-hidden="true">
        <img className="hero-badge-bg hero-badge-bg--saa" src="/aws-saa-badge.png" alt="" />
        <img className="hero-badge-bg hero-badge-bg--ai" src="/aws-ai-badge.png" alt="" />
        <img className="hero-badge-bg hero-badge-bg--ccp" src="/aws-ccp-badge.png" alt="" />
      </div>

      <p className="hero-eyebrow reveal">Software Developer, Singapore</p>

      <h1 className="hero-name">Htet Myark</h1>

      <p className="hero-lede reveal delay-1">
        I build full-stack web apps, RPA workflows and serverless AI tools on AWS.
        AWS Certified Solutions Architect and IT graduate of Singapore Polytechnic,
        with eleven months shipping automation at PSA.
      </p>

      <div className="hero-cta reveal delay-2">
        <a href="#projects" className="btn-primary">See my work</a>
        <a href="#contact" className="btn-secondary">Get in touch</a>
      </div>

      <ul className="hero-links reveal delay-3">
        <li>
          <a href="/Htet_Myark_Aung_Resume.pdf" download="Htet_Myark_Aung_Resume.pdf">Resume (PDF)</a>
        </li>
        <li><a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        <li><a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="mailto:htetmyark@gmail.com">Email</a></li>
      </ul>

      <p className="hero-status reveal delay-3">
        <i aria-hidden="true" />
        Open to opportunities
      </p>


      <div className="hero-showcase">
        <GitHubActivity weeks={52} compact className="reveal delay-4" />
      </div>
    </section>
  )
}
