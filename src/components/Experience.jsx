import React from 'react'

const experiences = [
  {
    date: 'APR 2025\n—\nFEB 2026',
    role: 'RPA Developer (Intern)',
    org: 'PSA Corporation Ltd',
    bullets: [
      'Created and maintained RPA solutions using UiPath and Power Automate',
      'Provided Level 1 helpdesk support and liaised with stakeholders to resolve issues',
      'Contributed to technical decisions on product features and improvements',
      'Conducted testing and technical development for project workflows',
      'Collaborated with cross-functional teams to ensure smooth project delivery',
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
