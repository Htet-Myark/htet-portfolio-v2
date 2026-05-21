import React from 'react'

const education = [
  {
    date: 'APR 2023\n—\nAPR 2026',
    degree: 'Diploma in Information Technology',
    field: 'Software Development',
    org: 'Singapore Polytechnic',
  },
]

export default function Education() {
  return (
    <section id="education">
      <p className="section-heading reveal">Education</p>
      {education.map((edu, i) => (
        <div className="exp-item reveal" key={i}>
          <div className="exp-date" style={{ whiteSpace: 'pre-line' }}>{edu.date}</div>
          <div>
            <div className="exp-role">{edu.degree}</div>
            <div className="exp-org">{edu.field} · {edu.org}</div>
          </div>
        </div>
      ))}
    </section>
  )
}
