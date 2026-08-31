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
    title: 'FOP2: University Info System',
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
    desc: 'A serverless ChatGPT-style chatbot powered by Amazon Nova Lite 2, an AWS-owned, cost-effective foundation model via AWS Bedrock. Built with a Python Lambda backend exposed through API Gateway. Responses are capped at 500 tokens to keep costs low, and AWS Guardrails are applied to detect and block inappropriate or harmful queries before they reach the model.',
    tags: ['Python', 'AWS Bedrock', 'AWS Lambda', 'API Gateway', 'Amazon Nova Lite 2', 'AWS Guardrails'],
  },
  {
    title: 'EduPlayground',
    org: 'Live Demo',
    link: 'https://eduplayground-client-nuia.vercel.app/',
    desc: 'A gamified learning platform set on an explorable 3D island. Walk your character to a building and step inside: certification exam practice, an AI bedtime storyteller with a neural voice, 3-minute AI movie recaps, real-time multiplayer word battles, a song-guessing game, sleep sounds, and a full kids section. No account required, works instantly in the browser.',
    tags: ['React', 'Vite', 'Three.js', 'Node.js', 'Express', 'WebSockets','Microsoft Foundry','MCP']
  },
  {
    title: 'Cross-Road Chaos',
    org: 'Live Demo',
    link: 'https://cross-road-chaos.vercel.app',
    desc: 'A browser arcade game where you play a courier crossing four lanes of traffic against a clock, dodging rival couriers and a thief who steals your parcel off the ground. Written in plain JavaScript on HTML5 Canvas with no build step and no dependencies, so it runs straight from a file. It ships with a password-protected analytics dashboard: a serverless collector writes anonymous visit and run statistics to Neon Postgres, grouping visitors by a daily-rotating hash so no stored row points back at a person.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'Node.js', 'Vercel Functions', 'PostgreSQL', 'NeonDB'],
  }
]


export default function Projects() {
  return (
    <section id="projects">
      <h2 className="section-heading reveal">Projects</h2>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div className={`project-card reveal delay-${i + 1}`} key={i}>
            <div className="card-core">
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
          </div>
        ))}
      </div>
    </section>
  )
}
