import React from 'react'

const skills = [
  'HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'SQL',
  'React', 'React Native', 'Vite', 'Node.js', 'Express', 'REST API',
  'MySQL', 'PostgreSQL', 'UiPath', 'Power Automate', 'SharePoint',
  'Docker', 'AWS Basics', 'CI/CD', 'Git',
  'UI/UX Design', 'Data Analysis', 'Excel', 'Secure Coding', 'Agile', 'C#', 'Figma',
]

export default function Skills() {
  return (
    <section id="skills">
      <p className="section-heading reveal">Skills</p>
      <div className="skills-wrap">
        {skills.map((skill, i) => (
          <div
            key={i}
            className="skill-pill reveal"
            /* stagger 45ms per pill, cap at 360ms so last pills aren't too delayed */
            style={{ transitionDelay: `${Math.min(i * 45, 360)}ms` }}
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  )
}
