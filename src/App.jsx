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
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-clip')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* progress driven by CSS animation-timeline: scroll(root) */}
      <div className="scroll-progress" aria-hidden="true" />
      {/* film-grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
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
