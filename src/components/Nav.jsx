import React, { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#certs', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const sentinelRef = useRef(null)

  /* scrolled state via IntersectionObserver on a top-of-page sentinel */
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting)
    )
    observer.observe(el)
    return () => observer.disconnect()
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

  /* close menu on route change or resize */
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('resize', close, { passive: true })
    return () => window.removeEventListener('resize', close)
  }, [])

  const close = () => setMenuOpen(false)

  const navClass = [
    scrolled ? 'scrolled' : '',
    menuOpen ? 'nav-open' : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <div ref={sentinelRef} className="nav-sentinel" aria-hidden="true" />
      <nav className={navClass || undefined}>
        <a href="#hero" className="nav-logo" onClick={close}>HTET MYARK</a>

        <ul className="nav-links">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={active === href ? 'active' : undefined}
                onClick={close}
              >
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
          {LINKS.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              className={active === href ? 'active' : undefined}
              onClick={close}
              /* staggered mask reveal */
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
