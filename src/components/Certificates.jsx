import React from 'react'
import SectionHead from './SectionHead'

export const certs = [
  { name: 'IT Customer Support Basics', issuer: 'Cisco Networking Academy', icon: '/certs/cisco-it-support.png', link: 'https://www.credly.com/badges/08b16a70-336a-4c02-94b3-82d13d922377/public_url' },
  { name: 'Certificate in Data & Analytics', issuer: 'Singapore Polytechnic', icon: '/certs/sp.png', link: 'https://letters.gov.sg/i57jf-w3309-kq16n-rllq7' },
  { name: 'AI Ethics & Governance (Associate Level)', issuer: 'Singapore Computer Society', icon: '/certs/scs.png', link: 'https://drive.google.com/drive/folders/15zBT6Igfqlt80lvPuGblb2GBXtKv9vcw' },
  { name: 'Certificate in Teamwork', issuer: 'Singapore Polytechnic', icon: '/certs/sp.png', link: 'https://letters.gov.sg/ypvu4-dbfj8-e3ycy-g7muh' },
  { name: 'Google AI Professional Certificate', issuer: 'Coursera', icon: '/certs/google.png', link: 'https://www.coursera.org/account/accomplishments/professional-cert/certificate/V0T2EITRCPN8' },
  { name: 'Google AI Essentials', issuer: 'Coursera', icon: '/certs/google.png', link: 'https://www.coursera.org/account/accomplishments/specialization/certificate/C6CKO497MDBN' },
  { name: 'Manual Testing Certificate', issuer: 'TestMu AI', icon: '/certs/testmu.png', link: 'https://www.testmuai.com/certified/LMT-8OROAL/' },
  { name: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', icon: '/aws-saa-badge.png', link: 'https://www.credly.com/badges/8d44acad-32bc-48f4-8f88-58181a2540b3/public_url' },
  { name: 'AWS AI Practitioner', issuer: 'Amazon Web Services', icon: '/aws-ai-badge.png', link: 'https://www.credly.com/badges/ccf30247-4cd4-4827-b557-8375385dcdbf/public_url' },
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', icon: '/aws-ccp-badge.png', link: 'https://www.credly.com/badges/2dd76b2b-8a3f-4194-a6cf-740bd063bb07/public_url' },
  { name: 'IT Support Foundations', issuer: 'Servicedesk-simulator', icon: '/certs/servicedesk-simulator.png', link: 'https://servicedesk-simulator.com/verify/e8wCQUE8ZDguYxF3g00RGyJEFDZ2/it_support_foundations' },
]

export default function Certificates() {
  return (
    <section id="certs">
      <SectionHead eyebrow="Certifications" title="Verified, not just listed." />
      <ol className="certs-list reveal">
        {certs.map((c, i) => (
          <li className="cert" key={i}>
            <div className="cert-cover">
              {c.icon && (
                <img className="cert-icon" src={c.icon} alt={`${c.issuer} badge`}
                  loading="lazy" decoding="async" />
              )}
              <span className="cert-index">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <span className="cert-name">{c.name}</span>
            <span className="cert-issuer">{c.issuer}</span>
            {c.link
              ? <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-link">Verify</a>
              : <span />}
          </li>
        ))}
      </ol>
    </section>
  )
}
