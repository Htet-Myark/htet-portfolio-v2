import React from 'react'

export default function About() {
  return (
    <section id="about">
      <p className="section-heading reveal">About</p>
      <div className="about-grid">
        <div className="about-text">
          <p className="reveal delay-1">
            I'm a <strong>software development student</strong> with a strong foundation in both
            front-end and back-end technologies. My journey into IT was driven by
            a love for math and logic — I've since built experience across
            enterprise systems, RPA workflows, and web applications.
          </p>
          <p className="reveal delay-2">
            I enjoy working across the full stack — from crafting clean UIs to
            integrating APIs and deploying containerised services. Always learning,
            always shipping.
          </p>
        </div>
        <ul className="detail-list">
          <li className="reveal-left delay-1">Singapore Polytechnic — Dip. IT (Software Dev)</li>
          <li className="reveal-left delay-2">Intern @ PSA Corporation Ltd</li>
          <li className="reveal-left delay-3">Fluent in Burmese &amp; English</li>
        </ul>
      </div>
    </section>
  )
}
