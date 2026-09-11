import React from 'react'

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
  return (
    <section id="skills">
      <h2 className="section-heading reveal">Skills</h2>
      <div className="skills-groups">
        {skillGroups.map((group, g) => (
          <div
            className="skill-group reveal"
            key={group.label}
            style={{ transitionDelay: `${g * 70}ms` }}
          >
            <h3 className="skill-group-label">
              {group.label}
              <span className="skill-group-count">{group.items.length}</span>
            </h3>
            <div className="skills-list">
              {group.items.map((skill) => (
                <div className="skill-pill" key={skill}>{skill}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
