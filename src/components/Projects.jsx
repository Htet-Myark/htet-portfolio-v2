import React from 'react'

const projects = [
  {
    title: 'Shrtner',
    org: 'Live Demo',
    link: 'https://shrtner.htetmyarkaung.com/',
    desc: 'A lightweight URL shortener that generates compact codes starting at 3 characters, scaling to 4 when collisions occur. It supports custom aliases. The frontend is a static terminal-aesthetic UI, backed by NeonDB (serverless PostgreSQL).',
    tags: [ 'HTML', 'CSS', 'JavaScript','Node.js', 'Express', 'PostgreSQL', 'NeonDB'],
  },
  
  {
    title: 'FOP2 — University Info System',
    org: 'Live Demo',
    link: 'https://files-vkom.onrender.com/FOP2',
    desc: 'A university information project built as part of the Fundamentals of Programming 2 course.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Node.js', 'Express', 'REST API'],
  },
  {
    title: 'Sar Kyi Tite - Library Management System',
    org: 'Live Demo',
    link: 'https://sarkyitite.htetmyarkaung.com/',
    desc: 'A full-stack library management system with user authentication and session timeout, book borrowing and return tracking, bookmarks, automated overdue warnings via email, and a book request system where users can submit requests and admins can reply. The admin panel provides full control over users, books, and borrow records.',
    tags: ['React', 'Vite', 'React Router', 'Axios', 'Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt', 'Nodemailer'],
  },
  {
    title: 'AWS Bedrock Chatbot',
    org: 'GitHub',
    link: 'https://github.com/Htet-Myark/Bedrock-ChatBot',
    desc: 'A serverless ChatGPT-style chatbot powered by Amazon Nova Lite 2 — an AWS-owned, cost-effective foundation model via AWS Bedrock. Built with a Python Lambda backend exposed through API Gateway. Responses are capped at 500 tokens to keep costs low, and AWS Guardrails are applied to detect and block inappropriate or harmful queries before they reach the model.',
    tags: ['Python', 'AWS Bedrock', 'AWS Lambda', 'API Gateway', 'Amazon Nova Lite 2', 'AWS Guardrails'],
  },
  {
    title: 'EduPlayground',
    org: 'GitHub',
    link: 'https://github.com/Htet-Myark/eduplayground',
    desc: 'A gamified learning platform set on an explorable 3D island. Walk your character to a building and step inside: certification exam practice, an AI bedtime storyteller that reads aloud with a neural voice, 3-minute AI movie recaps, real-time multiplayer word battles across devices, a song-guessing game, sleep sounds, and a full kids section — no account required, works instantly in the browser.',
    tags: ['React', 'Vite', 'Three.js', 'Node.js', 'Express', 'websockets',]
  }
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
              {p.link
                ? <a href={p.link} className="project-org" target="_blank" rel="noopener noreferrer">{p.org}</a>
                : <span className="project-org" style={{ opacity: 0.4, cursor: 'default' }}>{p.org}</span>
              }
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
