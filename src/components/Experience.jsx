import React from 'react'

const experiences = [
  {
    date: 'APR 2025\n—\nFEB 2026',
    role: 'RPA Developer (Intern)',
    org: 'PSA Corporation Ltd',
    bullets: [
      'Built an end-to-end Power Automate flow that reads 1,000+ row datasets from SharePoint Excel files, navigates an internal web portal, and submits each record via the system\'s REST API calls — all without manual intervention',
      'Implemented structured error handling and result logging: each processed row is written back to the source Excel file with a success or failure status, providing a full audit trail for traceability',
      'Configured automated Outlook email alerts to notify the intern and supervisor whenever an unrecoverable error halted the flow mid-run, enabling rapid response and minimising data loss',
      'Eliminated repetitive manual data-entry work, saving significant man-hours per cycle and freeing the team to focus on higher-value tasks',
      'Developed a UiPath RPA bot that scans a SharePoint Excel register of certificates, calculates days to expiry, and automatically sends Outlook email reminders to the team before certificates lapse',
      'Acted as a user tester for a new internal system — submitted invalid and edge-case data to verify input validation, confirmed all API calls returned correct responses, and documented defects found',
      'Participated in domain decision-making discussions, contributing technical input on system design and workflow feasibility for newly proposed features',
      'Created and maintained RPA solutions using UiPath and Power Automate',
      'Provided Level 1 helpdesk support and liaised with stakeholders to resolve issues',
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
