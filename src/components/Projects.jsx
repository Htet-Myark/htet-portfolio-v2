import React, { useEffect, useRef, useState } from 'react'
import SectionHead from './SectionHead'

export const projects = [
  {
    title: 'Device Lab: 3D Assembly & Repair Simulator',
    image: '/projects/device-lab.jpg',
    imageAlt: 'Device Lab 3D workbench with a technician in an ESD vest beside an open tower case',
    links: [
      { org: 'Live Demo', link: 'https://device-lab-3d.vercel.app' },
      { org: 'GitHub', link: 'https://github.com/Htet-Myark/device-lab' },
    ],
    desc: 'A browser-based 3D simulator for practising hardware assembly before touching real parts. Build a desktop PC in 60 steps (PSU, CPU, cooler, RAM, drives, expansion cards, internal and front-panel cables) and boot it to a POST screen, plus separate laptop, phone and tablet labs. It catches the classic mistakes, such as handling RAM before grounding, misaligned CPU Pin 1, a GPU in an x1 slot or reversed LED polarity, and explains why each one matters in real life. Practice and Challenge modes, with a 2D version for low-end machines. No install, account or build step.',
    tags: ['JavaScript', 'Three.js', 'WebGL', 'HTML', 'CSS', 'SVG', 'Vercel'],
  },
  {
    title: 'Servio: IT Service Management',
    image: '/projects/servio.jpg',
    imageAlt: 'Servio agent dashboard with open incidents by priority and SLA status',
    links: [
      { org: 'Live Demo', link: 'https://servio-snowy.vercel.app' },
      { org: 'GitHub', link: 'https://github.com/Htet-Myark/servio' },
    ],
    desc: 'A self-hosted ITSM app modelled on how a real service desk runs: incidents, service requests, changes and problems, plus a self-service portal and knowledge base. Incident priority comes from impact × urgency with resolution SLAs that go on-track, at-risk and breached; catalog requests route to the requester’s manager for approval; changes need Change Advisory Board sign-off before they can be scheduled. Server-rendered with no JS framework, deployed on Vercel in Tokyo next to its Supabase database. Demo logins are on the sign-in page (e.g. alex / password).',
    tags: ['Python', 'FastAPI', 'Jinja2', 'PostgreSQL', 'Supabase', 'Vercel', 'pytest'],
  },
 
  {
    title: 'AWS Bedrock Chatbot',
    image: '/projects/bedrock.jpg',
    imageAlt: 'AWS Bedrock chatbot interface with suggested prompts',
    org: 'GitHub',
    link: 'https://github.com/Htet-Myark/Bedrock-ChatBot',
    desc: 'A serverless ChatGPT-style chatbot powered by Amazon Nova Lite 2, an AWS-owned, cost-effective foundation model via AWS Bedrock. Built with a Python Lambda backend exposed through API Gateway. Responses are capped at 500 tokens to keep costs low, and AWS Guardrails are applied to detect and block inappropriate or harmful queries before they reach the model.',
    tags: ['Python', 'AWS Bedrock', 'AWS Lambda', 'API Gateway', 'Amazon Nova Lite 2', 'AWS Guardrails'],
  },
  {
    title: 'EduPlayground',
    image: '/projects/eduplayground.jpg',
    imageAlt: 'EduPlayground 3D island world with buildings and a player character',
    org: 'Live Demo',
    link: 'https://eduplayground-client-nuia.vercel.app/',
    desc: 'A gamified learning platform set on an explorable 3D island. Walk your character to a building and step inside: certification exam practice, an AI bedtime storyteller with a neural voice, 3-minute AI movie recaps, real-time multiplayer word battles, a song-guessing game, sleep sounds, and a full kids section. No account required, works instantly in the browser.',
    tags: ['React', 'Vite', 'Three.js', 'Node.js', 'Express', 'WebSockets','Microsoft Foundry','MCP']
  },
  {
    title: 'Cross-Road Chaos',
    image: '/projects/cross-road-chaos.jpg',
    imageAlt: 'Cross-Road Chaos intersection with the autopilot planning its route',
    links: [
      { org: 'Live Demo', link: 'https://cross-road-chaos.vercel.app' },
      { org: 'Watch Autopilot', link: 'https://cross-road-chaos.vercel.app/?autopilot=1' },
    ],
    desc: 'A browser arcade game where you play a courier crossing four lanes of traffic against a clock, dodging rival couriers and a thief who steals your parcel off the ground. Written in plain JavaScript on HTML5 Canvas with no build step and no dependencies. Press B and an autopilot takes over: a planning bot that forecasts every vehicle 1.8 s ahead using the game’s own signal and braking rules, then picks the safest heading toward its goal, with an overlay that draws its route and the traffic it is watching. In a headless benchmark against the real game code it never lost a 400-second run. It also ships with a password-protected analytics dashboard: a serverless collector writes anonymous visit and run statistics to Neon Postgres, grouping visitors by a daily-rotating hash so no stored row points back at a person.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'Path Planning', 'Node.js', 'Vercel Functions', 'PostgreSQL', 'NeonDB'],
  },
  {
    title: '3-Tier Serverless Web App on AWS',
    image: '/projects/three-tier.jpg',
    imageAlt: 'Serverless web app returning a user record from DynamoDB',
    links: [
      { org: 'Live Demo', link: 'https://d3vebm23m2k9w6.cloudfront.net/' },
      { org: 'Write-up', link: 'https://3tierdocs-226748456235-us-east-1-an.s3.us-east-1.amazonaws.com/index.html' },
    ],
    desc: 'A serverless three-tier application that looks up a user by ID: a static front end in S3 served over HTTPS through CloudFront with origin access control, an API Gateway route calling a Node.js Lambda, and DynamoDB behind it. The write-up walks through the six errors I hit wiring the services together, what each one actually meant, plus the running cost and the teardown steps.',
    tags: ['AWS S3', 'CloudFront', 'API Gateway', 'AWS Lambda', 'DynamoDB', 'Node.js', 'JavaScript', 'IAM'],
  },
  {
    title: 'FOP2: University Info System',
    image: '/projects/fop2.jpg',
    imageAlt: 'FOP2 university information pages with salary and employment queries',
    org: 'Live Demo',
    link: 'https://files-vkom.onrender.com/FOP2',
    desc: 'A university information project built as part of the Fundamentals of Programming 2 course.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Node.js', 'Express', 'REST API'],
  },
   {
    title: 'Shrtner',
    image: '/projects/shrtner.jpg',
    imageAlt: 'Shrtner URL shortener with its terminal-style interface',
    org: 'Live Demo',
    link: 'https://shrtner.htetmyarkaung.com/',
    desc: 'A lightweight URL shortener that generates compact codes starting at 3 characters, scaling to 4 when collisions occur. It supports custom aliases. The frontend is a static terminal-aesthetic UI, backed by NeonDB (serverless PostgreSQL).',
    tags: [ 'HTML', 'CSS', 'JavaScript','Node.js', 'Express', 'PostgreSQL', 'NeonDB'],
  }
]


const pad2 = n => String(n).padStart(2, '0')

/* flat cover tones, cycled per card */
const COVERS = ['cover--blue', 'cover--black', 'cover--sky', 'cover--stone']

const Arrow = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
  </svg>
)

export default function Projects() {
  const trackRef = useRef(null)
  const [shown, setShown] = useState({ first: 0, last: 0 })
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /* which cards are actually on screen, and whether either end has been reached.
     A laptop fits about three cards, so "leftmost card" alone tops out at 06 / 08
     and the last two never get a number; the range (06-08 / 08) is right on any
     width or orientation, and collapses to one number when one card fits */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const update = () => {
      const cards = [...track.children]
      const left = track.scrollLeft
      const box = track.getBoundingClientRect()
      const viewL = Math.max(box.left, 0), viewR = Math.min(box.right, window.innerWidth)
      const visible = []
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect()
        const seen = Math.min(r.right, viewR) - Math.max(r.left, viewL)
        if (seen >= r.width * 0.9) visible.push(i)              // mostly on screen
      })
      if (!visible.length) {                                    // mid-swipe: take the one most in view
        let best = 0, bestSeen = -Infinity
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect()
          const seen = Math.min(r.right, viewR) - Math.max(r.left, viewL)
          if (seen > bestSeen) { bestSeen = seen; best = i }
        })
        visible.push(best)
      }
      const first = visible[0], last = visible[visible.length - 1]
      setShown(prev => (prev.first === first && prev.last === last ? prev : { first, last }))
      setAtStart(left < 8)
      setAtEnd(left + track.clientWidth > track.scrollWidth - 8)
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const step = (dir) => {
    const track = trackRef.current
    const card = track?.children[0]
    if (!card) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  const controls = (
    <div className="carousel-controls">
      <span className="carousel-count" aria-live="polite">
        <strong>
          {pad2(shown.first + 1)}
          {shown.last > shown.first && <>&ndash;{pad2(shown.last + 1)}</>}
        </strong> / {pad2(projects.length)}
      </span>
      <button className="round-btn" onClick={() => step(-1)} disabled={atStart} aria-label="Previous project">
        <Arrow dir="prev" />
      </button>
      <button className="round-btn" onClick={() => step(1)} disabled={atEnd} aria-label="Next project">
        <Arrow dir="next" />
      </button>
    </div>
  )

  return (
    <section id="projects">
      <SectionHead eyebrow="Projects" title="Things I've built and shipped." aside={controls} />

      <ol className="carousel reveal" ref={trackRef}>
        {projects.map((p, i) => {
          const links = p.links ?? [{ org: p.org, link: p.link }]
          return (
            <li className="project" key={i}>
              <div className={`project-cover ${p.image ? 'has-photo' : COVERS[i % COVERS.length]}`}>
                {p.image && (
                  <img className="project-photo" src={p.image} alt={p.imageAlt ?? ''}
                       width="1200" height="900" loading="lazy" decoding="async" />
                )}
                <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="project-title">{p.title}</h3>
                <span className="project-lead">{p.tags[0]}</span>
              </div>
              <div className="project-body">
                <p className="project-desc">{p.desc}</p>
                <ul className="project-tags">
                  {p.tags.map((t) => <li className="chip" key={t}>{t}</li>)}
                </ul>
                <div className="project-links">
                  {links.map((l, j) => (
                    l.link
                      ? <a href={l.link} className={j === 0 ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'} target="_blank" rel="noopener noreferrer" key={j}>{l.org}</a>
                      : <span className="btn-secondary btn-sm is-off" key={j}>{l.org}</span>
                  ))}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
