import React from 'react'

export default function Contact() {
  return (
    <section id="contact">
      <p className="section-heading reveal">Contact</p>
      <p className="contact-intro reveal delay-1">
        Open to internship opportunities, junior developer roles, and interesting collaborations.
        Reach out — I respond.
      </p>
      <div className="contact-row">
        <a href="mailto:htetmyark@gmail.com" className="contact-link reveal delay-2">
          MAIL → htetmyark@gmail.com
        </a>
        <a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer" className="contact-link reveal delay-3">
          GITHUB
        </a>
        <a href="https://www.linkedin.com/in/htet-myark-8a" target="_blank" rel="noopener noreferrer" className="contact-link reveal delay-4">
          LINKEDIN
        </a>
      </div>
    </section>
  )
}
