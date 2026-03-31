import React from 'react'

const certs = [
  { name: 'Certificate in Data & Analytics', issuer: 'Singapore Polytechnic',link: 'https://letters.gov.sg/i57jf-w3309-kq16n-rllq7' },
  { name: 'AI Ethics & Governance (Associate Level)', issuer: 'Singapore Computer Society',link: 'https://drive.google.com/drive/folders/15zBT6Igfqlt80lvPuGblb2GBXtKv9vcw' },
  {name: 'Certificate in Teamwork', issuer:'Singapore Polytechnic',link: 'https://letters.gov.sg/ypvu4-dbfj8-e3ycy-g7muh'},
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
            <div className='cert-link-container'>
              {c.link && (
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-link">
                  View Credential
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
