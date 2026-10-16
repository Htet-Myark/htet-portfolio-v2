import React, { useState } from 'react'
import SectionHead from './SectionHead'

const skillGroups = [
  {
    label: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'React Native', 'Vite', 'Three.js', 'UI/UX Design', 'Figma'],
  },
  {
    label: 'Backend',
    items: ['Java', 'J2EE', 'C#', 'Python', 'Node.js', 'Express', 'REST API', 'WebSockets'],
  },
  {
    label: 'Database',
    items: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    label: 'Cloud',
    items: [
      'AWS', 'EC2', 'Lambda', 'S3', 'CloudFront', 'API Gateway', 'Bedrock', 'CloudFormation',
      'Azure Basics', 'Docker', 'Kubernetes Basics', 'CI/CD', 'Linux Basics',
    ],
  },
  {
    label: 'Security',
    items: ['OWASP Top 10', 'Secure Coding'],
  },
  {
    label: 'Automation',
    items: ['UiPath', 'Power Automate', 'Selenium', 'Katalon Studio'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Jira', 'Postman', 'Power BI', 'Excel', 'Data Analysis', 'Agile'],
  },
]

export default function Skills() {
  const [current, setCurrent] = useState(0)
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0)
  const group = skillGroups[current]

  /* arrow keys move between tabs, as the ARIA tabs pattern expects */
  const onKey = (e) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (current + delta + skillGroups.length) % skillGroups.length
    setCurrent(next)
    document.getElementById(`skill-tab-${next}`)?.focus()
  }

  return (
    <section id="skills">
      <SectionHead
        eyebrow="Skills"
        title="The toolkit."
        aside={<p className="section-note"><strong>{total}</strong> tools across {skillGroups.length} areas</p>}
      />

      <div className="segmented reveal" role="tablist" aria-label="Skill areas" onKeyDown={onKey}>
        {skillGroups.map((g, i) => (
          <button
            key={g.label}
            id={`skill-tab-${i}`}
            role="tab"
            aria-selected={i === current}
            aria-controls="skill-panel"
            tabIndex={i === current ? 0 : -1}
            className={i === current ? 'is-active' : undefined}
            onClick={() => setCurrent(i)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div
        id="skill-panel"
        className="skill-panel reveal"
        role="tabpanel"
        aria-labelledby={`skill-tab-${current}`}
      >
        <div className="skill-panel-head">
          <h3 className="skill-panel-title">{group.label}</h3>
          <span className="skill-panel-count">{group.items.length} tools</span>
        </div>
        {/* keyed so the chips replay their entrance on every tab change */}
        <ul className="skill-grid" key={group.label}>
          {group.items.map((skill, i) => (
            <li className="skill-tile" key={skill} style={{ animationDelay: `${i * 30}ms` }}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
