import React, { useEffect } from 'react'
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
import FieldBackground from './components/FieldBackground'
import CircuitTrace from './components/CircuitTrace'
import FlightMap from './components/FlightMap'
import './index.css'

export default function App() {
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
    const SELECTOR = '.reveal, .reveal-left, .reveal-scale, .reveal-clip'
    const observeAll = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el)
      })
    observeAll()
    // pick up elements mounted later (hot reload, lazily rendered content)
    const mutations = new MutationObserver(observeAll)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])

  return (
    <>
      {/* progress driven by CSS animation-timeline: scroll(root) */}
      <div className="scroll-progress" aria-hidden="true" />
      {/* GitHub contribution year as 3D terrain; scrolling walks back through it */}
      <FieldBackground />
      {/* 3D drone floating over the whole page (click-through) */}
      <Nav />
      <main>
        {/* circuit trace in the left margin that draws itself as you scroll */}
        <CircuitTrace />
        <FlightMap />
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
