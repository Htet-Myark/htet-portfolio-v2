import React, { useEffect, useState } from 'react'
import { PLACES } from './World'

/* The story of the page is one flight: seven stops in order, from home base
   to the radio tower. This small map follows the reader down the page, moving
   the drone along the route as they scroll, so scrolling and flying are the
   same journey. */

export const STORY = {
  about: 'Start here: who I am.',
  education: 'Where I learned to build.',
  experience: 'My first real work: automation at PSA.',
  projects: 'What I build on my own time.',
  skills: 'The tools I work with.',
  certs: 'What I have proven so far.',
  contact: 'End of the flight. Call me in.',
}

const pts = PLACES.map((p) => `${p.x},${p.z}`).join(' ')

export default function FlightMap() {
  const [at, setAt] = useState({ i: -1, x: 0, z: 0 })

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = scrollY + innerHeight * 0.45
      const tops = PLACES.map((p) => { const el = document.getElementById(p.id); return el ? el.getBoundingClientRect().top + scrollY : Infinity })
      let i = -1
      tops.forEach((t, k) => { if (line >= t) i = k })
      if (i < 0) { setAt({ i, x: 0, z: 0 }); return }
      const a = PLACES[i], b = PLACES[i + 1]
      const t = b ? Math.min(1, Math.max(0, (line - tops[i]) / (tops[i + 1] - tops[i]))) : 0
      // sit at the stop for the first 60% of a section, then fly to the next one
      const k = b ? Math.max(0, (t - 0.6) / 0.4) : 0
      setAt({ i, x: a.x + ((b?.x ?? a.x) - a.x) * k, z: a.z + ((b?.z ?? a.z) - a.z) * k })
      try { // reading a section counts as visiting its landmark
        const seen = JSON.parse(localStorage.getItem('world-seen')) || []
        if (!seen.includes(a.id)) { seen.push(a.id); localStorage.setItem('world-seen', JSON.stringify(seen)); dispatchEvent(new Event('world-seen')) }
      } catch { /* private mode */ }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll)
    update()
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const here = PLACES[at.i]
  return (
    <aside className={`flight-map ${here ? 'is-on' : ''}`} aria-label="Where you are on the page">
      <svg viewBox="-30 -30 60 60" role="img" aria-label="Route map of the island">
        <circle r="27" className="fm-isle" />
        <polyline points={`0,0 ${pts}`} className="fm-route" />
        {PLACES.map((p, k) => (
          <a key={p.id} href={`#${p.id}`} aria-label={`Stop ${k + 1}: ${p.name}`}>
            <circle cx={p.x} cy={p.z} r="5" className="fm-hit" />
            <circle cx={p.x} cy={p.z} r={k === at.i ? 2.6 : 1.9} className={`fm-stop ${k < at.i ? 'done' : ''} ${k === at.i ? 'here' : ''}`} />
          </a>
        ))}
        <g transform={`translate(${at.x} ${at.z})`} className="fm-drone"><circle r="4.2" /><circle r="1.5" /></g>
      </svg>
      {here && <p><b>Stop {at.i + 1}/{PLACES.length}</b>{here.name}</p>}
    </aside>
  )
}
