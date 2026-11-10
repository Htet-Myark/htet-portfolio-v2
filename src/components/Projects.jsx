import React from 'react'
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
    imageAlt: 'Cross-Road Chaos intersection with traffic, the courier and a parcel waiting to be picked up',
    links: [
      { org: 'Live Demo', link: 'https://cross-road-chaos.vercel.app' },
    ],
    desc: 'A browser arcade game where you play a courier crossing four lanes of traffic against a clock, dodging rival couriers and a thief who steals your parcel off the ground. Written in plain JavaScript on HTML5 Canvas with no build step and no dependencies. It also ships with a password-protected analytics dashboard: a serverless collector writes anonymous visit and run statistics to Neon Postgres, grouping visitors by a daily-rotating hash so no stored row points back at a person.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'Node.js', 'Vercel Functions', 'PostgreSQL', 'NeonDB'],
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

/* "Name: what it is" titles split into a name and a subtitle. */
const splitTitle = (t) => { const i = t.indexOf(': '); return i < 0 ? [t, ''] : [t.slice(0, i), t.slice(i + 2)] }
/* The first sentence is the pitch; the rest is the detail behind "How it works". */
const splitDesc = (d) => { const m = d.match(/^.*?[.!?](?=\s|$)/); return m ? [m[0], d.slice(m[0].length).trim()] : [d, ''] }

/* The workshop: every build is shown as what it really is, a screenshot of the
   running thing in a plain window, with the pitch beside it and the detail one
   click away. No carousel, so nothing is hidden off-screen. */
export default function Projects() {
  return (
    <section id="projects">
      <SectionHead eyebrow="Projects" title="Things I've built and shipped."
        aside={<p className="section-note"><strong>{projects.length}</strong> builds on the bench</p>} />

      <ol className="builds">
        {projects.map((p, i) => {
          const links = (p.links ?? [{ org: p.org, link: p.link }]).filter((l) => l.link)
          const [name, sub] = splitTitle(p.title)
          const [pitch, detail] = splitDesc(p.desc)
          return (
            <li className={`build reveal ${i === 0 ? 'build--lead' : ''}`} key={p.title}>
              <a className="build-shot" href={links[0]?.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}`}>
                <span className="build-bar" aria-hidden="true"><i /><i /><i /><em>{links[0]?.link.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}</em></span>
                {p.image && <img src={p.image} alt={p.imageAlt ?? ''} width="1200" height="900" loading="lazy" decoding="async" />}
              </a>
              <div className="build-body">
                <p className="build-meta"><b>Build {pad2(i + 1)}</b>{p.tags[0]}</p>
                <h3 className="build-name">{name}</h3>
                {sub && <p className="build-sub">{sub}</p>}
                <p className="build-pitch">{pitch}</p>
                {detail && (
                  <details className="build-more">
                    <summary>How it works</summary>
                    <p>{detail}</p>
                  </details>
                )}
                <ul className="build-tags">
                  {p.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <div className="build-links">
                  {links.map((l, j) => (
                    <a href={l.link} className={j === 0 ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'} target="_blank" rel="noopener noreferrer" key={l.link}>{l.org} <span aria-hidden="true">↗</span></a>
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
