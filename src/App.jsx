import React, { useEffect, useRef } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import './index.css'

export default function App() {
  const spotlightRef = useRef(null)

  /* scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-clip')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* cursor-tracking glow + tilt on cards — delegated, only on pointer devices */
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e) => {
      const card = e.target.closest?.('.glow-card')
      if (!card) return
      const r = card.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      card.style.setProperty('--mx', `${x}px`)
      card.style.setProperty('--my', `${y}px`)
      if (card.classList.contains('tilt-card')) {
        card.style.setProperty('--rx', `${(y / r.height - 0.5) * -4}deg`)
        card.style.setProperty('--ry', `${(x / r.width - 0.5) * 4}deg`)
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  /* cursor spotlight — smooth lerp via rAF, only on pointer devices */
  useEffect(() => {
    const el = spotlightRef.current
    if (!el || window.matchMedia('(hover: none)').matches) return

    let raf
    let tx = -1000, ty = -1000
    let cx = -1000, cy = -1000

    const onMove = (e) => { tx = e.clientX - 350; ty = e.clientY - 350 }
    window.addEventListener('mousemove', onMove, { passive: true })

    const loop = () => {
      cx += (tx - cx) * 0.09
      cy += (ty - cy) * 0.09
      el.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* progress driven by CSS animation-timeline: scroll(root) */}
      <div className="scroll-progress" aria-hidden="true" />
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Projects />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </>
  )
}
