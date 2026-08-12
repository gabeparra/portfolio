import './Portfolio.css'
import { useState, useEffect, useRef } from 'react'

const MISSIONS = [
  {
    id: 'GP-01',
    name: 'Portbook',
    class: 'INFRA',
    desc: 'Local tracker for machines, the ports they serve, what connects to what, and the tickets against them. The map view draws itself from the connections you enter, and any port serving on two machines gets flagged before you point a client at the wrong one.',
    metrics: ['1 Python file', '0 dependencies', 'loopback only'],
    stack: ['Python', 'Tailwind', 'stdlib http.server'],
    image: '/shots/portbook.webp',
    href: 'https://github.com/gabeparra/portbook',
    status: 'LIVE',
  },
  {
    id: 'GP-02',
    name: 'Strikedeck',
    class: 'WEB',
    desc: 'Options and prediction-market paper-trading terminal. Real market data in, positions and P&L tracked against it, and an Alpaca paper account you can opt into. Runs on the tailnet, never the open internet.',
    metrics: ['real data', 'paper only', 'tailnet-served'],
    stack: ['FastAPI', 'React', 'Vite', 'Alpaca', 'Polymarket'],
    status: 'PRIVATE BUILD',
  },
  {
    id: 'GP-03',
    name: 'ChessCadets',
    class: 'GAMES',
    desc: 'Kids\u2019 chess game in Unreal Engine 5. Play White against a real embedded C++ chess engine (Pulse) on a holographic board set in neon, per-piece cyberpunk arenas. My senior design capstone.',
    metrics: ['senior capstone', 'embedded C++ engine'],
    stack: ['Unreal Engine 5', 'C++', 'Pulse Chess AI', 'Lumen / Ray Tracing'],
    href: 'https://github.com/LeineckerGames/ChessCadets',
    status: 'LAUNCH PREP',
  },
  {
    id: 'GP-04',
    name: 'Margot AI \u2014 Pronunciation Trainer',
    class: 'AI',
    desc: 'Full-stack pronunciation trainer that scores Spanish and English speech in real time through ElevenLabs, so a learner hears what is wrong while they are still saying it. I led the cross-functional team end to end.',
    metrics: ['ES / EN', 'real-time feedback', 'team lead'],
    stack: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Docker'],
    href: 'https://github.com/gabeparra/Margot.AI',
    status: 'MISSION COMPLETE',
  },
  {
    id: 'GP-05',
    name: 'BananaByte LLC',
    class: 'WEB',
    desc: 'My web and app studio. Production sites for Orlando shops, performers and small businesses on an edge-deployed static stack, owned from brand through deploy, at one flat price with no hourly meter.',
    metrics: ['registered FL studio', 'bilingual', 'edge-deployed'],
    stack: ['Astro 5', 'Tailwind 4', 'TypeScript', 'Cloudflare'],
    image: '/shots/bananabyte.webp',
    href: 'https://bananabyte.io',
    status: 'LIVE SIGNAL',
  },
  {
    id: 'GP-06',
    name: 'UCF Global Administrative Portal',
    class: 'WEB',
    desc: 'Web application managing administrative forms and requests for international students: file uploads, role-based routing, and a REST backend replacing a legacy upload system.',
    metrics: ['role-based routing', 'replaced legacy system'],
    stack: ['React', 'CoreUI', 'FastAPI', 'SQLite'],
    href: 'https://github.com/gabeparra/GlobalCoreUIDemo',
    status: 'DEPLOYED',
  },
  {
    id: 'GP-07',
    name: 'Rolling with the Punches',
    class: 'GAMES',
    desc: 'Western twin-stick shooter for Android, built in Unity 6. Touch twin-stick with an aim zone that auto-fires, landscape lock, three swappable view modes, and a headless build pipeline that installs straight onto the phone. Public build targeted for the end of October.',
    metrics: ['Android ARM64', 'IL2CPP', 'touch twin-stick'],
    stack: ['Unity 6', 'C#', 'URP', 'HLSL', 'Android'],
    status: 'SHIPPING OCT 2026',
  },
  {
    id: 'GP-08',
    name: 'UCF Global PhoneValidator',
    class: 'INFRA',
    desc: 'Java libphonenumber validation wired into the Slate admissions intake through bpLogix Process Director, so bad phone formats are caught at entry instead of triaged by hand later.',
    metrics: ['runs inside Slate', 'killed manual triage'],
    stack: ['Java', 'libphonenumber', 'Slate', 'bpLogix'],
    href: 'https://github.com/gabeparra/PhoneValidatorJavaApp',
    status: 'DEPLOYED',
  },
  {
    id: 'GP-09',
    name: 'Equipment Rental',
    class: 'WEB',
    desc: 'Mobile-friendly app for checking shared, access-controlled equipment in and out, with session auth, server-side status and CSV audit logging.',
    metrics: ['session auth', 'CSV audit trail'],
    stack: ['JavaScript', 'Python', 'HTML/CSS'],
    href: 'https://github.com/gabeparra/equipment-rental',
    status: 'FIELD KIT',
  },
  {
    id: 'GP-10',
    name: 'DockerOffline',
    class: 'INFRA',
    desc: 'Offline install bundle for Docker Engine on Ubuntu: fetch the .deb packages while you have a network, install them on air-gapped hosts that never will.',
    metrics: ['air-gapped install'],
    stack: ['Bash', 'Debian packaging'],
    href: 'https://github.com/gabeparra/DockerOffline',
    status: 'FIELD KIT',
  },
]

const SYSTEMS = [
  { label: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++', 'SQL', 'PHP'] },
  { label: 'FRAMEWORKS', items: ['React', 'Next.js', 'React Native', 'Astro', 'FastAPI', 'Flask', 'Node.js'] },
  { label: 'PLATFORMS', items: ['PostgreSQL', 'MySQL', 'Docker', 'Cloudflare', 'Vercel', 'Linux', 'Git'] },
  { label: 'GAME DEV', items: ['Unreal Engine 5', 'Unity', 'C++ / C# gameplay', 'HLSL shaders'] },
  { label: 'SPECIAL OPS', items: ['Slate (Technolutions)', 'bpLogix', 'LLM agents', 'RAG pipelines'] },
]

// Derived from the data so a new mission class can never miss the filter row.
const CLASSES = ['ALL', ...new Set(MISSIONS.map((m) => m.class))]

function MissionCard({ mission: m }) {
  const inner = (
    <>
      {/* No thumb at all where there is no capture — an empty 16:9 panel reads
          as a broken image, and half these missions have no UI to shoot. */}
      {m.image && (
        <div className="mission-shot">
          <img src={m.image} alt={`${m.name} screenshot`} loading="lazy" />
        </div>
      )}
      <div className="mission-body">
        <div className="mission-top">
          <span className="mission-id">{m.id}</span>
          <span className="mission-status">{m.status}</span>
        </div>
        <h3 className="mission-name">{m.name}</h3>
        <p className="mission-desc">{m.desc}</p>
        {m.metrics && (
          <ul className="mission-metrics">
            {m.metrics.map((x) => <li key={x}>{x}</li>)}
          </ul>
        )}
        <div className="mission-stack">
          {m.stack.map((s) => <span key={s} className="mission-chip">{s}</span>)}
        </div>
      </div>
    </>
  )
  // Private builds have no repo to open, so they render as a plain card.
  return m.href
    ? <a className="mission-card" href={m.href} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div className="mission-card mission-card-closed">{inner}</div>
}

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
  const [missionClass, setMissionClass] = useState('ALL')
  const launched = useRef(false)

  const visibleMissions = missionClass === 'ALL'
    ? MISSIONS
    : MISSIONS.filter((m) => m.class === missionClass)

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
          <div className="mission-filters">
            {CLASSES.map((c) => (
              <button
                key={c}
                className={`mission-filter${c === missionClass ? ' active' : ''}`}
                onClick={() => setMissionClass(c)}
              >
                {c}
                <span className="mission-filter-count">
                  {c === 'ALL' ? MISSIONS.length : MISSIONS.filter((m) => m.class === c).length}
                </span>
              </button>
            ))}
          </div>
          <div className="missions-grid">
            {visibleMissions.map((m) => <MissionCard key={m.id} mission={m} />)}
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
