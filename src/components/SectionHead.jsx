import React from 'react'

/* Eyebrow names the section (and matches the nav); the headline says
   something about it. `aside` sits opposite the headline on wide screens. */
export default function SectionHead({ eyebrow, title, aside = null }) {
  return (
    <header className="section-head reveal">
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="section-heading">{title}</h2>
      </div>
      {aside && <div className="section-aside">{aside}</div>}
    </header>
  )
}
