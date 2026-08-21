import React from 'react'

const skills = [
  'HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'SQL',
  'React', 'React Native', 'Vite', 'Node.js', 'Express', 'REST API',
  'MySQL', 'PostgreSQL', 'UiPath', 'Power Automate', 'SharePoint','Katalon Studio',
  'Docker', 'AWS Basics', 'CI/CD', 'Git',
  'UI/UX Design', 'Data Analysis', 'Excel', 'Power BI', 'Secure Coding', 'Agile', 'C#', 'Figma','Selenium', 'Jira', 'Postman', 'MongoDB', 'Three.js', 'WebSockets', 'Azure Basics'
]

export default function Skills() {
  return (
    <section id="skills">
      <h2 className="section-heading reveal">Skills</h2>
      <div className="skills-list reveal">
        {skills.map((skill, i) => (
          <div className="skill-pill" key={i}>{skill}</div>
        ))}
      </div>
    </section>
  )
}
