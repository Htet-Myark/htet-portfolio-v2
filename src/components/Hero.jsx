import React from 'react'
import World from './World'

/* The hero is a small playable world (see World.jsx). The text sits over
   its top-left corner; the full site carries on below for anyone who scrolls. */
export default function Hero() {
  return (
    <>
      <section id="hero">
        <World />

        <div className="hero-copy">
          <p className="hero-eyebrow"><span>Software Developer</span><span>Singapore</span></p>
          <h1 className="hero-name">Htet Myark<i aria-hidden="true">.</i></h1>
          <p className="hero-lede">
            I build full-stack web apps, RPA workflows and serverless AI tools on AWS.
          </p>
          <div className="hero-cta">
            <a href="#about" className="btn-primary">See my story <span aria-hidden="true">↓</span></a>
            <a href="/Htet_Myark_Aung_Resume.pdf" download="Htet_Myark_Aung_Resume.pdf" className="btn-secondary">Resume</a>
          </div>
          <p className="hero-status"><i aria-hidden="true" />Open to opportunities</p>
        </div>
      </section>

      <section className="hero-after">
        <ul className="hero-links">
          <li><a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="mailto:htetmyark@gmail.com">Email</a></li>
        </ul>
      </section>
    </>
  )
}
