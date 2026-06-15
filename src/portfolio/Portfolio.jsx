import './Portfolio.css'
import { useState, useEffect, useRef } from 'react'

const MISSIONS = [
  {
    id: 'GP-01',
    name: 'UCF Global Administrative Portal',
    desc: 'Web application managing administrative forms and requests for international students. File uploads, role-based routing, REST backend.',
    stack: ['React', 'CoreUI', 'FastAPI', 'SQLite'],
    href: 'https://github.com/gabeparra/GlobalCoreUIDemo',
    status: 'DEPLOYED',
  },
  {
    id: 'GP-02',
    name: 'Margot AI — Pronunciation Trainer',
    desc: 'Full-stack pronunciation training app with real-time ES/EN feedback via ElevenLabs. Led a cross-functional team end to end.',
    stack: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Docker'],
    href: 'https://github.com/gabeparra/Margot.AI',
    status: 'MISSION COMPLETE',
  },
  {
    id: 'GP-03',
    name: 'BananaByte LLC',
    desc: 'My web & app development studio. Production sites on an edge-deployed static stack, owned from brand to deploy.',
    stack: ['Astro 5', 'Tailwind 4', 'TypeScript', 'Cloudflare'],
    href: 'https://bananabyte.io',
    status: 'LIVE SIGNAL',
  },
  {
    id: 'GP-04',
    name: 'Rolling with the Punches',
    desc: 'Unity 6 Western-themed 3D game with a mobile port, built for an AI for Game Development course — C# gameplay/AI and custom URP shader work.',
    stack: ['Unity 6', 'C#', 'Mobile', 'HLSL', 'URP'],
    href: 'https://github.com/gabeparra/Rolling-with-the-punches-game',
    status: 'IN ORBIT',
  },
  {
    id: 'GP-05',
    name: 'UCF Global PhoneValidator',
    desc: 'Java libphonenumber validation wired into the Slate admissions intake, eliminating manual phone-format triage for staff.',
    stack: ['Java', 'libphonenumber', 'Slate', 'bpLogix'],
    href: 'https://github.com/gabeparra/PhoneValidatorJavaApp',
    status: 'DEPLOYED',
  },
  {
    id: 'GP-06',
    name: 'DockerOffline',
    desc: 'Offline install bundle for Docker Engine on Ubuntu — fetch .deb packages online, install on air-gapped hosts.',
    stack: ['Bash', 'Debian packaging'],
    href: 'https://github.com/gabeparra/DockerOffline',
    status: 'FIELD KIT',
  },
  {
    id: 'GP-07',
    name: 'Equipment Rental',
    desc: 'Mobile-friendly web app for checking shared, access-controlled equipment in and out — session auth, server-side status, and CSV audit logging.',
    stack: ['JavaScript', 'Python', 'HTML/CSS'],
    href: 'https://github.com/gabeparra/equipment-rental',
    status: 'FIELD KIT',
  },
]

const SYSTEMS = [
  { label: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'SQL', 'PHP'] },
  { label: 'FRAMEWORKS', items: ['React', 'Next.js', 'React Native', 'Astro', 'FastAPI', 'Flask', 'Node.js'] },
  { label: 'PLATFORMS', items: ['PostgreSQL', 'MySQL', 'Docker', 'Cloudflare', 'Vercel', 'Linux', 'Git'] },
  { label: 'SPECIAL OPS', items: ['Slate (Technolutions)', 'bpLogix', 'LLM agents', 'RAG pipelines', 'Unity'] },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <span>{now.toLocaleTimeString('en-US', { hour12: false })} EST</span>
}

function Portfolio({ onEasterEggClick, onNavigateToContact }) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const launched = useRef(false)

  useReveal()

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true)
        const isProduction = import.meta.env.PROD
        const endpoint = isProduction ? '/api/github-repos' : 'https://api.github.com/users/gabeparra/repos?sort=updated&per_page=12'
        const response = await fetch(endpoint)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }))
          throw new Error(errorData.message || `GitHub API error: ${response.status}`)
        }
        const data = await response.json()
        setRepos(data.filter((repo) => !repo.fork || repo.name === 'portfolio'))
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [])

  useEffect(() => { launched.current = true }, [])

  const handleCClick = (e) => { e.preventDefault(); e.stopPropagation(); onEasterEggClick && onEasterEggClick('C') }
  const handleContactClick = (e) => { e.preventDefault(); onNavigateToContact && onNavigateToContact() }

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#6ef3d6',
      Java: '#ed8b00', PHP: '#9aa7ff', 'C#': '#8aff80', HTML: '#fc6d3f', CSS: '#7cc5ff', Shell: '#a8ff9e',
    }
    return colors[language] || '#8fa3c7'
  }

  const displayedRepos = showAll ? repos : repos.slice(0, 6)
  const hasMore = repos.length > 6

  return (
    <div className="portfolio mc">

      <main className="mc-main">
        <section className="mc-hero">
          <div className="mc-hero-text">
            <p className="mc-eyebrow launch launch-1">// ORLANDO, FL — 28.5383° N, 81.3792° W</p>
            <h1 className="mc-title launch launch-2">
              FULL-STACK<br />
              <span className="mc-title-accent">ENGINEER</span>
              <span className="easter-egg-overlay-c" onClick={handleCClick} onTouchStart={handleCClick}></span>
            </h1>
            <p className="mc-sub launch launch-3">
              Business Analyst II at <strong>UCF Global</strong> · Founder of <strong>BananaByte LLC</strong> ·
              building web apps, enterprise integrations, and AI tooling from the Space Coast&apos;s backyard.
            </p>
            <div className="mc-cta-row launch launch-4">
              <a href="#missions" className="mc-btn mc-btn-primary">View Missions</a>
              <a href="#contact" className="mc-btn mc-btn-ghost" onClick={handleContactClick}>Open a Channel</a>
            </div>
          </div>
          <div className="mc-hero-orbit launch launch-3" aria-hidden="true">
            <div className="orbit-ring orbit-ring-1"><span className="orbit-sat orbit-sat-1"></span></div>
            <div className="orbit-ring orbit-ring-2"><span className="orbit-sat orbit-sat-2"></span></div>
            <div className="orbit-planet"></div>
          </div>
        </section>

        <div className="mc-telemetry launch launch-5">
          <span className="tele-item"><span className="tele-dot"></span>STATUS: OPEN TO MISSIONS</span>
          <span className="tele-item">LOCAL TIME: <Clock /></span>
          <span className="tele-item">CLEARANCE: FULL-STACK</span>
          <span className="tele-item">SIGNAL: <span className="tele-bars"><i></i><i></i><i></i><i></i></span></span>
        </div>

        <section id="systems" className="mc-section reveal">
          <div className="mc-section-head">
            <span className="mc-section-no">01</span>
            <h2 className="mc-section-title">SYSTEMS</h2>
            <span className="mc-section-line"></span>
          </div>
          <div className="systems-grid">
            {SYSTEMS.map((sys) => (
              <div key={sys.label} className="system-card">
                <h3 className="system-label">{sys.label}</h3>
                <ul className="system-list">
                  {sys.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="missions" className="mc-section reveal">
          <div className="mc-section-head">
            <span className="mc-section-no">02</span>
            <h2 className="mc-section-title">ACTIVE MISSIONS</h2>
            <span className="mc-section-line"></span>
          </div>
          <div className="missions-grid">
            {MISSIONS.map((m) => (
              <a key={m.id} className="mission-card" href={m.href} target="_blank" rel="noopener noreferrer">
                <div className="mission-top">
                  <span className="mission-id">{m.id}</span>
                  <span className="mission-status">{m.status}</span>
                </div>
                <h3 className="mission-name">{m.name}</h3>
                <p className="mission-desc">{m.desc}</p>
                <div className="mission-stack">
                  {m.stack.map((s) => <span key={s} className="mission-chip">{s}</span>)}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="transmissions" className="mc-section reveal">
          <div className="mc-section-head">
            <span className="mc-section-no">03</span>
            <h2 className="mc-section-title">TRANSMISSIONS</h2>
            <span className="mc-section-line"></span>
          </div>
          <p className="mc-section-note">// live feed from github.com/gabeparra</p>
          {loading && <p className="tx-state">ACQUIRING SIGNAL<span className="tx-cursor">_</span></p>}
          {error && <p className="tx-state tx-error">SIGNAL LOST: {error}</p>}
          {!loading && !error && (
            <>
              <div className="tx-list">
                {displayedRepos.map((repo) => (
                  <a key={repo.id} className="tx-row" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    <span className="tx-date">{new Date(repo.pushed_at).toISOString().slice(0, 10)}</span>
                    <span className="tx-name">{repo.name}</span>
                    <span className="tx-desc">{repo.description || '—'}</span>
                    {repo.language && (
                      <span className="tx-lang" style={{ color: getLanguageColor(repo.language) }}>
                        ● {repo.language}
                      </span>
                    )}
                  </a>
                ))}
              </div>
              {hasMore && (
                <div className="tx-more">
                  <button onClick={() => setShowAll(!showAll)} className="mc-btn mc-btn-ghost">
                    {showAll ? 'Collapse Feed' : 'Full Feed'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section id="contact" className="mc-section mc-contact reveal">
          <div className="mc-section-head">
            <span className="mc-section-no">04</span>
            <h2 className="mc-section-title">OPEN A CHANNEL</h2>
            <span className="mc-section-line"></span>
          </div>
          <p className="mc-contact-text">
            Open to full-time remote missions. Transmissions answered within one Earth day.
          </p>
          <div className="mc-contact-row">
            <button onClick={handleContactClick} className="mc-btn mc-btn-primary">Send Transmission</button>
            <a href="mailto:gabriel@gabrielparra.dev" className="mc-btn mc-btn-ghost">Email</a>
            <a href="https://github.com/gabeparra" target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn-ghost">GitHub</a>
            <a href="https://linkedin.com/in/gabeparra" target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn-ghost">LinkedIn</a>
            <a href="https://bananabyte.io" target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn-ghost">BananaByte</a>
          </div>
        </section>
      </main>

    </div>
  )
}

export default Portfolio
