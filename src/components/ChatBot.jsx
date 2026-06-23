import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const KNOWLEDGE_BASE = `
You are an AI assistant embedded in Htet Myark's portfolio website. Answer questions about Htet Myark based only on the information below. Be concise, friendly, and helpful. If asked something not covered here, say you don't have that information but visitors can reach out via the contact section.

--- ABOUT ---
Name: Htet Myark
Role: Fresh graduate and software developer based in Singapore.
Education: Diploma in Information Technology (Software Development) from Singapore Polytechnic, graduated April 2026.
Languages spoken: Burmese & English.
Availability: Available for opportunities in Singapore.
Background: Strong foundation in both front-end and back-end technologies. Driven by a love for math and logic. Built experience across enterprise systems, RPA workflows, and web applications. Works across the full stack — from crafting clean UIs to integrating APIs and deploying containerised services.

--- EXPERIENCE ---
Role: RPA Developer (Intern)
Company: PSA Corporation Ltd
Duration: April 2025 – February 2026
Responsibilities:
- Built an end-to-end Power Automate flow that reads 1,000+ row datasets from SharePoint Excel files, navigates an internal web portal, and submits each record via the system's REST API calls — all without manual intervention
- Implemented structured error handling and result logging: each processed row is written back to the source Excel file with a success or failure status, providing a full audit trail for traceability
- Configured automated Outlook email alerts to notify the intern and supervisor whenever an unrecoverable error halted the flow mid-run, enabling rapid response and minimising data loss
- Eliminated repetitive manual data-entry work, saving significant man-hours per cycle and freeing the team to focus on higher-value tasks
- Developed a UiPath RPA bot that scans a SharePoint Excel register of certificates, calculates days to expiry, and automatically sends Outlook email reminders to the team before certificates lapse
- Acted as a user tester for a new internal system — submitted invalid and edge-case data to verify input validation, confirmed all API calls returned correct responses, and documented defects found
- Participated in domain decision-making discussions, contributing technical input on system design and workflow feasibility for newly proposed features
- Created and maintained RPA solutions using UiPath and Power Automate
- Provided Level 1 helpdesk support and liaised with stakeholders to resolve issues
- Collaborated with cross-functional teams to ensure smooth project delivery

--- PROJECTS ---
1. Shrtner
   Description: A lightweight URL shortener that generates compact codes starting at 3 characters, scaling to 4 when collisions occur. Supports custom aliases. The frontend is a static terminal-aesthetic UI, backed by NeonDB (serverless PostgreSQL).
   Technologies: HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, NeonDB
   Link: https://shrtner.htetmyarkaung.com/

2. FOP2 — University Info System
   Description: A university information project built as part of the Fundamentals of Programming 2 course.
   Technologies: HTML, CSS, JavaScript, Bootstrap, Node.js, Express, REST API
   Link: https://files-vkom.onrender.com/FOP2

3. Sar Kyi Tite — Library Management System
   Description: A full-stack library management system with user authentication and session timeout, book borrowing and return tracking, bookmarks, automated overdue warnings via email, and a book request system where users can submit requests and admins can reply. The admin panel provides full control over users, books, and borrow records.
   Technologies: React, Vite, React Router, Axios, Node.js, Express, MongoDB, JWT, bcrypt, Nodemailer
   Link: https://sarkyitite.htetmyarkaung.com/

4. AWS Bedrock Chatbot
   Description: A serverless ChatGPT-style chatbot powered by Amazon Nova Lite 2 — an AWS-owned, cost-effective foundation model via AWS Bedrock. Built with a Python Lambda backend exposed through API Gateway. Responses are capped at 500 tokens to keep costs low, and AWS Guardrails are applied to detect and block inappropriate or harmful queries before they reach the model.
   Technologies: Python, AWS Bedrock, AWS Lambda, API Gateway, Amazon Nova Lite 2, AWS Guardrails
   Link: https://github.com/Htet-Myark/Bedrock-ChatBot

--- SKILLS ---
Frontend: HTML, CSS, JavaScript, React, React Native, Vite
Backend: Node.js, Express, REST API, Python, Java
Databases: SQL, MySQL, PostgreSQL, MongoDB
Automation/RPA: UiPath, Power Automate, SharePoint
DevOps/Cloud: Docker, AWS Basics, CI/CD, Git
Other: UI/UX Design, Data Analysis, Excel, Secure Coding, Agile

--- CERTIFICATIONS ---
1. Certificate in Data & Analytics — Singapore Polytechnic
2. AI Ethics & Governance (Associate Level) — Singapore Computer Society
3. Certificate in Teamwork — Singapore Polytechnic
4. Google AI Professional Certificate — Coursera
5. Google AI Essentials — Coursera
6. Manual Testing by TestMu AI (formerly LambdaTest) — TestMu AI
`

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Htet's AI assistant. Ask me anything about his experience, skills, or projects." }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatSessionRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const getOrCreateChat = () => {
    if (!chatSessionRef.current) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set')
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        systemInstruction: KNOWLEDGE_BASE,
      })
      chatSessionRef.current = model.startChat({ history: [] })
    }
    return chatSessionRef.current
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setIsLoading(true)

    try {
      const chat = getOrCreateChat()
      const result = await chat.sendMessage(userText)
      const text = result.response.text()
      setMessages(prev => [...prev, { role: 'assistant', text }])
    } catch (err) {
      console.error('[ChatBot] Gemini API error:', err)
      const isQuotaError = err?.message?.includes('429') || err?.message?.toLowerCase().includes('quota')
      const reply = isQuotaError
        ? "Hey! Thanks so much for your interest. I'm a little overwhelmed with questions right now — but feel free to reach out to Htet directly through the contact section below. He'd love to hear from you!"
        : 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="chatbot-status-dot" />
              <span>Ask about Htet</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-msg chatbot-msg--assistant chatbot-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-row">
            <textarea
              ref={inputRef}
              className="chatbot-input"
              rows={1}
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14V2M2 8l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        className={`chatbot-bubble ${isOpen ? 'chatbot-bubble--open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M18 13a2 2 0 01-2 2H6l-4 4V4a2 2 0 012-2h12a2 2 0 012 2v9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </>
  )
}
