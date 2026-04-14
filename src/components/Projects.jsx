import React from 'react'

const projects = [
  {
    title: 'Shrtner',
    org: 'Live Demo',
    link: 'https://files-vkom.onrender.com',
    desc: 'A URL shortening service hosted with Render and NeonDB, built with Node.js, Express, and PostgreSQL.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL'],
  },
  
  {
    title: 'FOP2 — University Info System',
    org: 'Live Demo',
    link: 'https://files-vkom.onrender.com/FOP2',
    desc: 'A university information project built as part of the Fundamentals of Programming 2 course.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Node.js', 'Express', 'REST API'],
  }
  // {
  //   title: 'Bedrock - Nova Lite 2 Chatbot',
  //   org: 'Live Demo',
  //   link: 'https://bedrock-chatbot-1.onrender.com',
  //   desc: 'A chatbot built with Amazon Bedrock - Nova Lite 2 project, showcasing natural language processing capabilities.',
  //   tags: ['HTML', 'CSS', 'JavaScript', 'Python', 'AWS Lambda', 'API Gateway','Amazon Bedrock'],
  // }
]

export default function Projects() {
  return (
    <section id="projects">
      <p className="section-heading reveal">Projects</p>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div className={`project-card reveal delay-${i + 1}`} key={i}>
            <div className="project-top">
              <div className="project-title">{p.title}</div>
              <a href={p.link} className="project-org" target="_blank" rel="noopener noreferrer">
                {p.org}
              </a>
            </div>
            <p className="project-desc">{p.desc}</p>
            <div className="tags">
              {p.tags.map((t, j) => <span className="tag" key={j}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
