import React from 'react'
import SectionHead from './SectionHead'

const experiences = [
  {
    date: 'Apr 2025 – Feb 2026',
    role: 'RPA Developer (Intern)',
    org: 'PSA Corporation Ltd',
    /* the measurable results, pulled out of the bullets below */
    highlights: [
      { value: '2', label: 'production RPA bots shipped' },
      { value: '1,000+', label: 'rows processed per run, zero manual steps' },
      { value: '100%', label: 'of source rows written back with a status' },
      { value: '0', label: 'missed certificate renewals' },
    ],
    bullets: [
      'Built 2 production RPA solutions across UiPath and Power Automate, automating workflows that process 1,000+ row datasets from SharePoint Excel and submit each record through the internal portal\'s REST API with zero manual intervention',
      'Cut hours of repetitive manual data entry per processing cycle to near-zero, freeing the team to focus on higher-value tasks',
      'Engineered structured error handling that writes a success/failure status back to all 1,000+ source rows and triggers automated Outlook alerts on unrecoverable errors, delivering a 100% audit trail and faster incident response',
      'Developed a UiPath bot that monitors a certificate register and auto-sends expiry reminders, reducing missed renewals to 0 by flagging lapses days in advance',
      'User-tested a new internal system with 100+ invalid and edge-case inputs, verifying input validation and API responses while documenting every defect found',
      'Provided Level 1 helpdesk support, resolving user issues and liaising with stakeholders across cross-functional teams to keep project delivery on track',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience">
      <SectionHead eyebrow="Experience" title="Eleven months automating real operations." />
      {experiences.map((exp, i) => (
        <article className="job reveal" key={i}>
          <header className="job-head">
            <div>
              <h3 className="job-role">{exp.role}</h3>
              <p className="job-org">{exp.org}</p>
            </div>
            <span className="chip chip--blue">{exp.date}</span>
          </header>

          <dl className="job-metrics">
            {exp.highlights.map((h) => (
              <div className="job-metric" key={h.label}>
                <dt>{h.value}</dt>
                <dd>{h.label}</dd>
              </div>
            ))}
          </dl>

          <ul className="job-bullets">
            {exp.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}
