import React from 'react'

export default function Contact() {
  return (
    <section id="contact">
      <p className="section-heading reveal">Contact</p>
      <p className="contact-intro reveal delay-1">
        I'm always open to connecting with fellow developers, recruiters, or anyone interested in chatting about tech. Feel free to reach out via email or connect with me on GitHub and LinkedIn!
      </p>
      <div className="contact-row">
        <a href="mailto:htetmyark@gmail.com" className="contact-link reveal delay-2">
          Email
        </a>
        <a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer" className="contact-link reveal delay-3">
          GITHUB
        </a>
        <a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer" className="contact-link reveal delay-4">
          LINKEDIN
        </a>
      </div>
    </section>
  )
}
