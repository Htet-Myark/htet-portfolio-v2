import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const formRef = useRef()
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setStatus('success')
        formRef.current.reset()
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return (
    <section id="contact">
      <p className="section-heading reveal">Contact</p>
      <p className="contact-intro reveal delay-1">
        I'm always open to connecting with fellow developers, recruiters, or anyone interested in chatting about tech. Feel free to reach out via the form below or connect with me directly!
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="contact-form reveal delay-2">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="user_name">Name</label>
            <input id="user_name" name="user_name" type="text" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="user_email">Email</label>
            <input id="user_email" name="user_email" type="email" placeholder="your@email.com" required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" placeholder="What's on your mind?" required />
        </div>
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
        {status === 'success' && (
          <p className="form-feedback form-feedback--ok">Message sent! I'll get back to you soon.</p>
        )}
        {status === 'error' && (
          <p className="form-feedback form-feedback--err">Something went wrong. Please try again.</p>
        )}
      </form>

      <div className="contact-row reveal delay-3" style={{ marginTop: '2.5rem' }}>
        <a href="mailto:htetmyark@gmail.com" className="contact-link">Email</a>
        <a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer" className="contact-link">GITHUB</a>
        <a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer" className="contact-link">LINKEDIN</a>
      </div>
    </section>
  )
}
