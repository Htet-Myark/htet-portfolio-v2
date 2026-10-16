import React from 'react'
import SectionHead from './SectionHead'

const education = [
  {
    date: 'Apr 2023 – Apr 2026',
    degree: 'Diploma in Information Technology',
    field: 'Software Development',
    org: 'Singapore Polytechnic',
    gpa: '3.6 / 4.0',
  },
]

export default function Education() {
  return (
    <section id="education">
      <SectionHead eyebrow="Education" title="Where the foundations were laid." />
      {education.map((edu, i) => (
        <article className="job job--compact reveal" key={i}>
          <header className="job-head">
            <div>
              <h3 className="job-role">{edu.degree}</h3>
              <p className="job-org">{edu.field}, {edu.org}</p>
            </div>
            <span className="chip chip--blue">{edu.date}</span>
          </header>
          {edu.gpa && (
            <dl className="job-metrics job-metrics--single">
              <div className="job-metric">
                <dt>{edu.gpa.replace(' / 4.0', '')}</dt>
                <dd>GPA out of 4.0</dd>
              </div>
            </dl>
          )}
        </article>
      ))}
    </section>
  )
}
