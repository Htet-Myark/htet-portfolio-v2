import React from 'react'

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
    </section>
  )
}
