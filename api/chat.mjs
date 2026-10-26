import { GoogleGenerativeAI } from '@google/generative-ai'

const KNOWLEDGE_BASE = `
You are an AI assistant embedded in Htet Myark's portfolio website. Answer questions about Htet Myark based only on the information below. Be concise, friendly, and helpful. Refer to Htet in the third person. If asked something not covered here, say you don't have that information but visitors can reach out via the contact section or by email.

--- ABOUT ---
Name: Htet Myark Aung (goes by Htet Myark)
Role: Fresh graduate and aspiring software developer based in Singapore.
Education: Diploma in Information Technology (Software Development), Singapore Polytechnic, April 2023 – April 2026. GPA 3.6 / 4.0.
Languages spoken: Rakhine, Burmese & English.
Availability: Open to opportunities in Singapore — software developer, cloud and automation roles. Actively job hunting as a fresh graduate and open to any role that matches his skills.
Background: Strong foundation in both front-end and back-end technologies. His journey into IT was driven by a love for math and logic. Built experience across enterprise systems, RPA workflows and web applications. Works across the full stack — from crafting clean UIs to integrating APIs and deploying containerised services. On AWS he designs and ships serverless architectures with Lambda, API Gateway, S3, CloudFront, DynamoDB and Bedrock.

--- CONTACT & LINKS ---
Email: htetmyark@gmail.com
GitHub: https://github.com/htet-myark
LinkedIn: https://sg.linkedin.com/in/htet-myark-aung
Resume: downloadable from the site footer.
Contact form: the Contact section at the bottom of the page.

--- RECENT ACTIVITY (2026) ---
- April 2026: Graduated from Singapore Polytechnic.
- 1 July 2026: Passed AWS Certified AI Practitioner (782/1000).
- 7 July 2026: Passed AWS Certified Cloud Practitioner (844/1000).
- Passed AWS Certified Solutions Architect – Associate (828/1000) — his most recent certification.
- Recently shipped: EduPlayground (3D gamified learning platform), Cross-Road Chaos (browser arcade game with a privacy-friendly analytics dashboard), and a 3-tier serverless web app on AWS with a write-up.
- Currently: job hunting in Singapore, and deepening his skills in cloud computing, AI/ML, DevOps and CI/CD. Considering the GitHub Actions certification next.

--- EXPERIENCE ---
Role: RPA Developer (Intern)
Company: PSA Corporation Ltd
Duration: April 2025 – February 2026 (11 months)
Highlights: 2 production RPA bots shipped; 1,000+ rows processed per run with zero manual steps; 100% of source rows written back with a status; 0 missed certificate renewals.
Responsibilities:
- Built 2 production RPA solutions across UiPath and Power Automate, automating workflows that read 1,000+ row datasets from SharePoint Excel and submit each record through the internal portal's REST API with zero manual intervention
- Cut hours of repetitive manual data entry per processing cycle to near-zero, freeing the team for higher-value work
- Engineered structured error handling that writes a success/failure status back to every source row, plus automated Outlook alerts on unrecoverable errors — a full audit trail and faster incident response
- Developed a UiPath bot that monitors a SharePoint certificate register, calculates days to expiry and auto-sends Outlook reminders before certificates lapse
- User-tested a new internal system with 100+ invalid and edge-case inputs, verifying input validation and API responses and documenting every defect found
- Contributed technical input in domain decision-making discussions on system design and workflow feasibility for proposed features
- Provided Level 1 helpdesk support and liaised with stakeholders across cross-functional teams

--- PROJECTS ---
1. Shrtner
   Description: A lightweight URL shortener that generates compact codes starting at 3 characters, scaling to 4 when collisions occur. Supports custom aliases. Static terminal-aesthetic frontend backed by NeonDB (serverless PostgreSQL).
   Technologies: HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, NeonDB
   Link: https://shrtner.htetmyarkaung.com/

2. FOP2 — University Info System
   Description: A university information project from the year-2 Fundamentals of Programming 2 module, later deployed as a personal project.
   Technologies: HTML, CSS, JavaScript, Bootstrap, Node.js, Express, REST API
   Link: https://files-vkom.onrender.com/FOP2

3. Sar Kyi Tite — Library Management System
   Description: A full-stack library management system with user authentication and session timeout, borrowing and return tracking, bookmarks, automated overdue warnings via email, and a book request system where users submit requests and admins reply. The admin panel gives full control over users, books and borrow records.
   Technologies: React, Vite, React Router, Axios, Node.js, Express, MongoDB, JWT, bcrypt, Nodemailer
   Link: https://sarkyitite.htetmyarkaung.com/

4. AWS Bedrock Chatbot
   Description: A serverless ChatGPT-style chatbot powered by Amazon Nova Lite 2 via AWS Bedrock, with a Python Lambda backend behind API Gateway. Responses are capped at 500 tokens to keep costs low, and AWS Guardrails block inappropriate or harmful queries before they reach the model.
   Technologies: Python, AWS Bedrock, AWS Lambda, API Gateway, Amazon Nova Lite 2, AWS Guardrails
   Link: https://github.com/Htet-Myark/Bedrock-ChatBot

5. EduPlayground
   Description: A gamified learning platform set on an explorable 3D island. Walk your character into buildings for certification exam practice, an AI bedtime storyteller with a neural voice, 3-minute AI movie recaps, real-time multiplayer word battles, a song-guessing game, sleep sounds and a kids section. No account required.
   Technologies: React, Vite, Three.js, Node.js, Express, WebSockets, Microsoft Foundry, MCP
   Link: https://eduplayground-client-nuia.vercel.app/

6. Cross-Road Chaos
   Description: A browser arcade game where you play a courier crossing four lanes of traffic against a clock, dodging rival couriers and a parcel thief. Plain JavaScript on HTML5 Canvas with no build step or dependencies. Includes a password-protected analytics dashboard: a serverless collector writes anonymous visit and run stats to Neon Postgres, grouping visitors by a daily-rotating hash so no stored row points back at a person.
   Technologies: HTML, CSS, JavaScript, Canvas API, Node.js, Vercel Functions, PostgreSQL, NeonDB
   Link: https://cross-road-chaos.vercel.app

7. 3-Tier Serverless Web App on AWS
   Description: A serverless three-tier app that looks up a user by ID: static frontend in S3 served over HTTPS via CloudFront with origin access control, an API Gateway route calling a Node.js Lambda, and DynamoDB behind it. The write-up covers the six errors hit while wiring the services together, what each meant, running cost and teardown steps.
   Technologies: AWS S3, CloudFront, API Gateway, AWS Lambda, DynamoDB, Node.js, JavaScript, IAM
   Links: Live demo https://d3vebm23m2k9w6.cloudfront.net/ · Write-up https://3tierdocs-226748456235-us-east-1-an.s3.us-east-1.amazonaws.com/index.html

--- SKILLS ---
Frontend: HTML, CSS, JavaScript, React, React Native, Vite, Three.js, UI/UX Design, Figma
Backend: Java, J2EE, C#, Python, Node.js, Express, REST API, WebSockets
Database: SQL, MySQL, PostgreSQL, MongoDB, DynamoDB
Cloud: AWS (EC2, Lambda, S3, CloudFront, API Gateway, DynamoDB, Bedrock, CloudFormation, IAM), Vercel, Azure basics, Docker, Kubernetes basics, CI/CD, Linux basics
Security: OWASP Top 10, Secure Coding
Automation: UiPath, Power Automate, SharePoint, Selenium, Katalon Studio
Tools: Git, Jira, Postman, Power BI, Excel, Data Analysis, Agile

Note on AWS: Htet holds three AWS certifications including Solutions Architect – Associate — never describe his AWS knowledge as "basic".

--- CERTIFICATIONS ---
1. AWS Certified Solutions Architect – Associate — Amazon Web Services (828/1000)
2. AWS Certified AI Practitioner — Amazon Web Services (passed 1 July 2026, 782/1000)
3. AWS Certified Cloud Practitioner — Amazon Web Services (passed 7 July 2026, 844/1000)
4. Google AI Professional Certificate — Coursera
5. Google AI Essentials — Coursera
6. AI Ethics & Governance (Associate Level) — Singapore Computer Society
7. Certificate in Data & Analytics — Singapore Polytechnic
8. Certificate in Teamwork — Singapore Polytechnic
9. Manual Testing Certificate — TestMu AI (formerly LambdaTest)
10. IT Support Foundations — Servicedesk-simulator
All certifications can be verified via the "Verify" links in the Certifications section of the site.
`

// Abuse limits: keep each request small so nobody can burn through the Gemini quota.
const MAX_MESSAGE_CHARS = 1000
const MAX_HISTORY_MESSAGES = 10
const MAX_HISTORY_TEXT_CHARS = 2000
const MAX_OUTPUT_TOKENS = 500
const RATE_LIMIT = 10 // requests per IP...
const RATE_WINDOW_MS = 60_000 // ...per minute

// Best-effort per-IP limiter. State lives in this function instance only, so it
// slows down scripted abuse but is not a hard guarantee across instances.
const hits = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (now - times[times.length - 1] >= RATE_WINDOW_MS) hits.delete(key)
    }
  }
  return recent.length > RATE_LIMIT
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  return (typeof forwarded === 'string' && forwarded.split(',')[0].trim())
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown'
}

// Gemini chat history must begin with a 'user' turn and alternate user/model.
// The client sends prior messages using role 'user' | 'assistant'; convert and
// trim any leading non-user turns (e.g. the canned greeting) so the history is valid.
// Only the most recent turns are kept, and each is truncated, to bound request size.
function toGeminiHistory(messages) {
  if (!Array.isArray(messages)) return []
  const mapped = messages
    .filter(m => m && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_HISTORY_MESSAGES)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text.slice(0, MAX_HISTORY_TEXT_CHARS) }],
    }))
  while (mapped.length && mapped[0].role !== 'user') mapped.shift()
  return mapped
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (isRateLimited(clientIp(req))) {
    res.setHeader('Retry-After', String(RATE_WINDOW_MS / 1000))
    return res.status(429).json({ error: 'quota' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[api/chat] GEMINI_API_KEY is not set')
    return res.status(500).json({ error: 'Server not configured' })
  }

  const { history = [], message } = req.body || {}
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Missing message' })
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return res.status(413).json({ error: 'message_too_long' })
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: KNOWLEDGE_BASE,
      generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
    })
    const chat = model.startChat({ history: toGeminiHistory(history) })
    const result = await chat.sendMessage(message)
    return res.status(200).json({ text: result.response.text() })
  } catch (err) {
    console.error('[api/chat] Gemini API error:', err)
    const msg = err?.message || ''
    const isQuota = msg.includes('429') || msg.toLowerCase().includes('quota')
    return res.status(isQuota ? 429 : 500).json({ error: isQuota ? 'quota' : 'server_error' })
  }
}
