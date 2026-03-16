import React from 'react'

const skills = [
  'HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'SQL',
  'React', 'React Native', 'Vite', 'Node.js', 'Express', 'REST API',
  'MySQL', 'PostgreSQL', 'UiPath', 'Power Automate',
  'Docker', 'AWS Basics', 'CI/CD', 'Git',
]

export default function Skills() {
  return (
    <section id="skills">
      <p className="section-heading reveal">Skills</p>
      <div className="skills-wrap">
        {skills.map((skill, i) => (
          <div
            key={i}
            className={`skill-pill reveal delay-${Math.min((i % 6) + 1, 6)}`}
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  )
}
