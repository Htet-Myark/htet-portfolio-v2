import React, { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <nav className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'nav-open' : ''}`}>
      <a href="#hero" className="nav-logo" onClick={close}>HTET MYARK AUNG</a>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className="nav-links">
        <li><a href="#about" onClick={close}>About</a></li>
        <li><a href="#education" onClick={close}>Education</a></li>
        <li><a href="#experience" onClick={close}>Experience</a></li>
        <li><a href="#projects" onClick={close}>Projects</a></li>
        <li><a href="#skills" onClick={close}>Skills</a></li>
        <li><a href="#contact" onClick={close}>Contact</a></li>
      </ul>
    </nav>
  )
}
