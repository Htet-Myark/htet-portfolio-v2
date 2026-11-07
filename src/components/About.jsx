import React from 'react'
import SectionHead from './SectionHead'

export default function About() {
  return (
    <section id="about">
      <SectionHead eyebrow="About" title="Logic first, then the pixels." />

      {/* bento: one large story tile, then facts at mixed sizes */}
      <div className="bento">
        <article className="tile tile--story reveal">
          <p className="tile-label">Who I am</p>
          <p className="tile-statement">
            I'm an <strong>aspiring software developer</strong> with a strong foundation in both
            front-end and back-end technologies. My journey into IT was driven by
            a love for math and logic.
          </p>
          <p className="tile-body">
            Since then I've built across enterprise systems, RPA workflows and web
            applications. I enjoy the whole stack, from crafting clean UIs to
            integrating APIs and deploying containerised services. On AWS I design
            and ship serverless architectures with Lambda, API Gateway, S3, CloudFront,
            DynamoDB and Bedrock, backed by Solutions Architect, AI Practitioner and
            Cloud Practitioner certifications. Always learning, always shipping.
          </p>
        </article>

        <article className="tile tile--dark reveal delay-2">
          <p className="tile-label">Right now</p>
          <p className="tile-title">
            <span className="live-dot" aria-hidden="true" />
            Open to opportunities
          </p>
          <p className="tile-body">Based in Singapore. Looking for software developer, cloud and automation roles.</p>
        </article>

        <article className="tile reveal delay-3">
          <p className="tile-label">Studied</p>
          <p className="tile-title">Diploma in IT</p>
          <p className="tile-body">Singapore Polytechnic, Software Development. GPA 3.6 / 4.0</p>
        </article>

        <article className="tile reveal delay-4">
          <p className="tile-label">Worked</p>
          <p className="tile-title">PSA Corporation</p>
          <p className="tile-body">RPA Developer intern, Apr 2025 to Feb 2026</p>
        </article>

        <article className="tile tile--blue reveal delay-5">
          <p className="tile-label">Speaks</p>
          <p className="tile-title">Rakhine, Burmese &amp; English</p>
        </article>
      </div>
    </section>
  )
}
