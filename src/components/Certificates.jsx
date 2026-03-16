import React from 'react'

const certs = [
  { name: 'Certificate in Data & Analytics', issuer: 'Singapore Polytechnic' },
  { name: 'AI Ethics & Governance (Associate Level)', issuer: 'Singapore Computer Society' },
]

export default function Certificates() {
  return (
    <section id="certs">
      <p className="section-heading reveal">Certifications</p>
      <div className="certs-list">
        {certs.map((c, i) => (
          <div className={`cert-card reveal-scale delay-${i + 1}`} key={i}>
            <div className="cert-name">{c.name}</div>
            <div className="cert-issuer">// {c.issuer}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
