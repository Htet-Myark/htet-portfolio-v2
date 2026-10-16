import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <p className="footer-name">Htet Myark Aung</p>
        <ul className="footer-links">
          <li><a href="https://github.com/htet-myark" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href="https://sg.linkedin.com/in/htet-myark-aung" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="mailto:htetmyark@gmail.com">Email</a></li>
          <li><a href="/Htet_Myark_Aung_Resume.pdf" download="Htet_Myark_Aung_Resume.pdf">Resume</a></li>
        </ul>
      </div>

      <p className="footer-credit">
        Built with React, Vite and three.js, {new Date().getFullYear()}.
      </p>
    </footer>
  )
}
