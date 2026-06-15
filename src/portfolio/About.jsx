import './About.css'

const SERVICE_RECORD = [
  {
    period: 'OCT 2025 — PRESENT',
    title: 'Business Analyst II',
    org: 'UCF Global · University of Central Florida',
    notes: [
      'Slate (Technolutions) development for international admissions: portals, forms, SQL queries, and integrations.',
      'Built a React + TypeScript replacement for the legacy upload system and a Respond.io contact-manager integration with duplicate detection.',
      'Java libphonenumber validator wired into the Slate intake via bpLogix Process Director; PHP modules powering the live help desk.',
    ],
  },
  {
    period: 'MAY 2026 — PRESENT',
    title: 'Founder / Engineer',
    org: 'BananaByte LLC',
    notes: [
      'Web & app development studio. Production sites on Astro, TypeScript, Tailwind, and Cloudflare, owned from brand to deploy.',
    ],
  },
  {
    period: '2014 — 2023',
    title: 'IT Support & Operations',
    org: 'Repuestos Rojas · Comercial PYM Ltda — Santiago, Chile',
    notes: [
      'Nine years across frontline IT support, SQL maintenance, POS and web systems, and retail operations management.',
    ],
  },
]

function About() {
  return (
    <div className="about-page mc">

      <main className="mc-main crew-main">
        <div className="mc-section-head">
          <span className="mc-section-no">ID</span>
          <h2 className="mc-section-title">CREW FILE</h2>
          <span className="mc-section-line"></span>
        </div>

        <div className="crew-grid">
          <div className="crew-bio">
            <p className="crew-text">
              I&apos;m Gabriel (Mariano) Parra — a full-stack engineer working in higher-ed
              enrollment systems by day and shipping web, AI, and game projects the rest of the time.
              Currently a Business Analyst II at UCF Global, where I build and integrate the
              Slate (Technolutions) systems that international students use to reach the university.
            </p>
            <p className="crew-text">
              My range runs from React/TypeScript front-ends and Python/Java back-ends to enterprise
              workflow engines, LLM agent tooling, and Unity. What motivates me most is solving real
              problems: simplifying workflows, killing manual triage, and building tools that
              genuinely help the people using them.
            </p>
            <p className="crew-text">
              B.S. Computer Science at UCF (Aug 2026) on top of a B.S. in Information Technology from
              Chile. Bilingual English/Spanish. Based in Orlando — close enough to the Cape to hear
              the launches.
            </p>

            <div className="crew-cert">
              <span className="crew-cert-badge">✦ CERTIFIED</span>
              <div>
                <p className="crew-cert-name">Fundamentals of Admissions &amp; Enrollment (2026)</p>
                <p className="crew-cert-org">Technolutions Slate — the CRM behind admissions at 2,000+ institutions</p>
              </div>
            </div>
          </div>

          <div className="crew-record">
            <h3 className="crew-record-title">// SERVICE RECORD</h3>
            {SERVICE_RECORD.map((entry) => (
              <div key={entry.title} className="crew-entry">
                <p className="crew-entry-period">{entry.period}</p>
                <h4 className="crew-entry-title">{entry.title}</h4>
                <p className="crew-entry-org">{entry.org}</p>
                <ul className="crew-entry-notes">
                  {entry.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default About
