import React from 'react'

const Icon = ({ children }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-links reveal">
        <a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer">
          <Icon>
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </Icon>
          GitHub
        </a>

        <a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer">
          <Icon>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" rx="1" />
            <circle cx="4" cy="4" r="2" />
          </Icon>
          LinkedIn
        </a>

        <a href="mailto:htetmyark@gmail.com">
          <Icon>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 6L2 7" />
          </Icon>
          Email
        </a>

        <a
          href="/Htet_Myark_Aung_Resume.pdf"
          download="Htet_Myark_Aung_Resume.pdf"
          className="footer-link--accent"
        >
          <Icon>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5M12 15V3" />
          </Icon>
          Resume
        </a>
      </div>

      <p className="footer-copy reveal delay-1">
        <span>Htet Myark Aung</span> · Built with React + Vite · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
