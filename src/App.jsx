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
  const progressRef = useRef(null)
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

  /* scroll progress bar */
  useEffect(() => {
    const el = progressRef.current
    if (!el) return
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
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
