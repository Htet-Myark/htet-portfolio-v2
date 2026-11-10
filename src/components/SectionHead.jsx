import React from 'react'
import { PLACES } from './World'
import { STORY } from './FlightMap'

/* Each section is a stop on the flight that starts in the hero. The eyebrow
   names the stop and its place on the island; the line under it carries the
   story from one stop to the next. `aside` sits opposite the headline. */
const KEY = { certifications: 'certs' }

export default function SectionHead({ eyebrow, title, aside = null }) {
  const id = KEY[eyebrow.toLowerCase()] || eyebrow.toLowerCase()
  const n = PLACES.findIndex((p) => p.id === id), place = PLACES[n]
  return (
    <header className="section-head reveal">
      <div>
        <p className="section-eyebrow">
          {place && <><b>Stop {String(n + 1).padStart(2, '0')}</b><span>{place.name}</span></>}
          <span>{eyebrow}</span>
        </p>
        <h2 className="section-heading">{title}</h2>
        {place && <p className="section-story">{STORY[id]}</p>}
      </div>
      {aside && <div className="section-aside">{aside}</div>}
    </header>
  )
}
