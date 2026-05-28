import React, { useEffect, useState } from 'react'


const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => {
    const els = LINKS.map(l => document.getElementById(l.href.slice(1))).filter(Boolean)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) }),
      { rootMargin: '-30% 0px -60% 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <div className={`nav-wrap${scrolled ? ' nav-scrolled' : ''}`}>
      <nav className={`nav-pill${menuOpen ? ' nav-open' : ''}`}>
        <a href="#hero" className="nav-logo" onClick={close}>HTET MYARK</a>
        <ul className="nav-links">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={active === href ? 'active' : ''} onClick={close}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {LINKS.map(({ href, label }) => (
            <a key={href} href={href} className={active === href ? 'active' : ''} onClick={close}>
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}