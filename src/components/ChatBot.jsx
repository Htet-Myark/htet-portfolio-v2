import React, { useState, useRef, useEffect } from 'react'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Htet's AI assistant. Ask me anything about his experience, skills, or projects." }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  /* first-visit nudge so people know the bubble is an AI assistant */
  const [showHint, setShowHint] = useState(false)
  const [hintDone, setHintDone] = useState(() => {
    try { return sessionStorage.getItem('chatbot-hint-seen') === '1' } catch { return false }
  })
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  /* surface the hint a beat after landing, once per session */
  useEffect(() => {
    if (hintDone || isOpen) return
    const t = setTimeout(() => setShowHint(true), 2600)
    return () => clearTimeout(t)
  }, [hintDone, isOpen])

  const dismissHint = () => {
    setShowHint(false)
    setHintDone(true)
    try { sessionStorage.setItem('chatbot-hint-seen', '1') } catch { /* private mode */ }
  }

  const openChat = () => {
    setIsOpen(true)
    dismissHint()
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    const history = messages // prior conversation, sent to the server for context
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setIsLoading(true)

    const QUOTA_REPLY = "Hey! Thanks so much for your interest. I'm a little overwhelmed with questions right now, but feel free to reach out to Htet directly through the contact section below. He'd love to hear from you!"

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message: userText }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const isQuota = res.status === 429 || data.error === 'quota'
        setMessages(prev => [...prev, { role: 'assistant', text: isQuota ? QUOTA_REPLY : 'Something went wrong. Please try again.' }])
        return
      }

      setMessages(prev => [...prev, { role: 'assistant', text: data.text }])
    } catch (err) {
      console.error('[ChatBot] request error:', err)
      setMessages(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
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

      {showHint && !isOpen && (
        <div className="chatbot-hint">
          <button className="chatbot-hint-open" onClick={openChat}>
            <span className="chatbot-hint-dot" aria-hidden="true" />
            Ask me anything about Htet
          </button>
          <button className="chatbot-hint-close" onClick={dismissHint} aria-label="Dismiss">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      <button
        className={[
          'chatbot-bubble',
          isOpen ? 'chatbot-bubble--open' : '',
          !isOpen && !hintDone ? 'chatbot-bubble--attention' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => { isOpen ? setIsOpen(false) : openChat() }}
        aria-label={isOpen ? 'Close chat' : "Open AI assistant — ask about Htet"}
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
