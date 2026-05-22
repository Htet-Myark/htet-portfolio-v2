import React from 'react'

const projects = [
  {
    title: 'Shrtner',
    org: 'Live Demo',
    link: 'https://shrtner.htetmyarkaung.com/',
    desc: 'A URL shortening service hosted with Render and NeonDB, built with Node.js, Express, and PostgreSQL.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL'],
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
