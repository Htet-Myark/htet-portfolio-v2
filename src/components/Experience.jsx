import React from 'react'

const experiences = [
  {
    date: 'APR 2025\n—\nFEB 2026',
    role: 'RPA Developer (Intern)',
    org: 'PSA Corporation Ltd',
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
      <p className="section-heading reveal">Experience</p>
      {experiences.map((exp, i) => (
        <div className="exp-item reveal" key={i}>
          <div className="exp-date" style={{ whiteSpace: 'pre-line' }}>{exp.date}</div>
          <div>
            <div className="exp-role">{exp.role}</div>
            <div className="exp-org">{exp.org}</div>
            <ul className="exp-bullets">
              {exp.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  )
}
