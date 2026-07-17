import React from 'react'

const skills = [
  'HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'SQL',
  'React', 'React Native', 'Vite', 'Node.js', 'Express', 'REST API',
  'MySQL', 'PostgreSQL', 'UiPath', 'Power Automate', 'SharePoint',
  'Docker', 'AWS Basics', 'CI/CD', 'Git',
  'UI/UX Design', 'Data Analysis', 'Excel', 'Secure Coding', 'Agile', 'C#', 'Figma',
]

const half = Math.ceil(skills.length / 2)
const rowA = skills.slice(0, half)
const rowB = skills.slice(half)

function MarqueeRow({ items, reverse }) {
  return (
    <div className={`marquee${reverse ? ' marquee--reverse' : ''}`}>
      <div className="marquee-track">
        {items.map((skill, i) => (
          <div className="skill-pill" key={i}>{skill}</div>
        ))}
        {/* duplicate set for seamless loop — hidden from AT and reduced-motion */}
        {items.map((skill, i) => (
          <div className="skill-pill marquee-dup" aria-hidden="true" key={`dup-${i}`}>{skill}</div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills">
      <h2 className="section-heading reveal">Skills</h2>
      <div className="reveal">
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>
    </section>
  )
}
