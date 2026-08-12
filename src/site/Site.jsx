import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './site.css'

const PROJECTS = [
  {
    name: 'Fittr',
    desc: 'Cloud fitness app with an AI coach that builds adaptive training blocks from your logged lifts and notes. Sideloaded Android with a self-update pipeline.',
    stack: ['React Native', 'Expo', 'Supabase', 'TypeScript'],
    href: 'https://github.com/gabeparra/FitTrack',
    status: 'Active',
  },
  {
    name: 'Portbook',
    desc: 'Local tracker for machines, the ports they serve, what connects to what, and the tickets against them. One self-contained offline Python file: no server to deploy, no Docker, no login, data in a JSON file you can back up with cp.',
    stack: ['Python', 'Tailwind', 'Zero dependencies'],
    href: 'https://github.com/gabeparra/portbook',
    status: 'Live',
  },
  {
    name: 'ChessCadets',
    desc: "Kids' chess game in Unreal Engine 5. Play a real embedded C++ engine on a holographic board in neon, per-piece arenas. My senior design capstone.",
    stack: ['Unreal Engine 5', 'C++', 'Pulse AI', 'Lumen'],
    href: 'https://github.com/LeineckerGames/ChessCadets',
    status: 'Launch prep',
  },
  {
    name: 'UCF Global Portal',
    desc: 'Web app managing administrative forms and requests for international students: file uploads, role-based routing, REST backend.',
    stack: ['React', 'CoreUI', 'FastAPI', 'SQLite'],
    href: 'https://github.com/gabeparra/GlobalCoreUIDemo',
    status: 'Deployed',
  },
  {
    name: 'Margot AI',
    desc: 'Full-stack pronunciation trainer with real-time ES/EN feedback via ElevenLabs. Led a cross-functional team end to end.',
    stack: ['React', 'TypeScript', 'Flask', 'Postgres', 'Docker'],
    href: 'https://github.com/gabeparra/Margot.AI',
    status: 'Complete',
  },
  {
    name: 'BananaByte LLC',
    desc: 'My web & app studio. Production sites on an edge-deployed static stack, owned from brand to deploy.',
    stack: ['Astro 5', 'Tailwind 4', 'TypeScript', 'Cloudflare'],
    href: 'https://bananabyte.io',
    status: 'Live',
  },
  {
    name: 'Rolling with the Punches',
    desc: 'Unity 6 Western 3D game with a mobile port, built for an AI-for-games course. C# gameplay/AI and custom URP shaders.',
    stack: ['Unity 6', 'C#', 'HLSL', 'Mobile'],
    href: 'https://github.com/gabeparra/Rolling-with-the-punches-game',
    status: 'Shipped',
  },
  {
    name: 'PhoneValidator',
    desc: 'Java libphonenumber validation wired into the Slate admissions intake, eliminating manual phone-format triage for staff.',
    stack: ['Java', 'libphonenumber', 'Slate', 'bpLogix'],
    href: 'https://github.com/gabeparra/PhoneValidatorJavaApp',
    status: 'Deployed',
  },
  {
    name: 'Equipment Rental',
    desc: 'Mobile-friendly app for checking shared, access-controlled equipment in and out, with session auth, server-side status, CSV audit logging.',
    stack: ['JavaScript', 'Python', 'HTML/CSS'],
    href: 'https://github.com/gabeparra/equipment-rental',
    status: 'Field kit',
  },
]

const EXPERIENCE = [
  {
    period: 'Oct 2025 - Present',
    title: 'Business Analyst II',
    org: 'UCF Global · University of Central Florida',
    notes: [
      'Slate (Technolutions) development for international admissions: portals, forms, SQL, and integrations.',
      'Built a React + TypeScript replacement for the legacy upload system and a Respond.io contact-manager integration with duplicate detection.',
      'Java libphonenumber validator wired into the Slate intake via bpLogix Process Director; PHP modules powering the live help desk.',
    ],
  },
  {
    period: 'May 2026 - Present',
    title: 'Founder / Engineer',
    org: 'BananaByte LLC',
    notes: [
      'Web & app development studio. Production sites on Astro, TypeScript, Tailwind, and Cloudflare, owned from brand to deploy.',
    ],
  },
  {
    period: '2014 - 2023',
    title: 'IT Support & Operations',
    org: 'Repuestos Rojas · Comercial PYM Ltda, Santiago, Chile',
    notes: [
      'Nine years across frontline IT support, SQL maintenance, POS and web systems, and retail operations management.',
    ],
  },
]

const STACK = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++', 'SQL', 'PHP'] },
  { label: 'Frameworks', items: ['React', 'React Native', 'Next.js', 'Astro', 'FastAPI', 'Flask', 'Node.js'] },
  { label: 'Platforms', items: ['PostgreSQL', 'MySQL', 'Docker', 'Cloudflare', 'Vercel', 'Supabase', 'Linux'] },
  { label: 'Game dev', items: ['Unreal Engine 5', 'Unity', 'C++ / C# gameplay', 'HLSL shaders'] },
  { label: 'Enterprise', items: ['Slate (Technolutions)', 'bpLogix', 'LLM agents', 'RAG pipelines'] },
]

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
  'C#': '#178600', 'C++': '#f34b7d', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
}

function GitHubRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const endpoint = import.meta.env.PROD
          ? '/api/github-repos'
          : 'https://api.github.com/users/gabeparra/repos?sort=updated&per_page=12'
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`GitHub ${res.status}`)
        const data = await res.json()
        setRepos(data.filter((r) => !r.fork || r.name === 'portfolio'))
        setError(null)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  if (loading) return <p className="muted-note">Loading repositories…</p>
  if (error) return <p className="muted-note">Couldn&apos;t reach GitHub right now. See github.com/gabeparra.</p>
  if (!repos.length) return null

  const shown = showAll ? repos : repos.slice(0, 6)
  return (
    <>
      <div className="repos">
        {shown.map((r) => (
          <a key={r.id} className="repo" href={r.html_url} target="_blank" rel="noopener noreferrer">
            <div className="repo-name">{r.name}</div>
            <p className="repo-desc">{r.description || 'No description.'}</p>
            <div className="repo-meta">
              {r.language && (
                <span className="repo-lang">
                  <span className="repo-dot" style={{ background: LANG_COLORS[r.language] || '#888' }} />
                  {r.language}
                </span>
              )}
              {r.stargazers_count > 0 && <span>★ {r.stargazers_count}</span>}
            </div>
          </a>
        ))}
      </div>
      <div className="more-row">
        {repos.length > 6 && (
          <button className="linkish" onClick={() => setShowAll((v) => !v)}>
            {showAll ? '− Show fewer' : `+ Show all ${repos.length}`}
          </button>
        )}
        <a className="linkish" href="https://github.com/gabeparra" target="_blank" rel="noopener noreferrer">
          github.com/gabeparra →
        </a>
      </div>
    </>
  )
}

function ContactForm() {
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ state: 'idle', msg: '' })

  const submit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', msg: 'Sending…' })
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (!serviceId || !templateId || !publicKey) throw new Error('unconfigured')
      await emailjs.send(serviceId, templateId, {
        from_name: data.name, from_email: data.email, message: data.message,
      }, publicKey)
      setStatus({ state: 'ok', msg: "Sent. I'll get back to you soon." })
      setData({ name: '', email: '', message: '' })
    } catch {
      setStatus({ state: 'err', msg: 'Something broke. Email gabriel@gabrielparra.dev directly.' })
    }
  }

  return (
    <form className="cform" onSubmit={submit}>
      <input required placeholder="Your name" value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })} />
      <input required type="email" placeholder="Your email" value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })} />
      <textarea required placeholder="What are you building?" value={data.message}
        onChange={(e) => setData({ ...data, message: e.target.value })} />
      <button className="btn btn-solid" type="submit" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status.msg ? <span className={`status ${status.state === 'ok' ? 'ok' : ''}`}>{status.msg}</span> : null}
    </form>
  )
}

export default function Site({ onArcade }) {
  const year = new Date().getFullYear()
  return (
    <div className="site">
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a className="brand" href="#top">gabriel parra<span className="dot">.</span></a>
          <nav className="topnav">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <a id="top" />
      <section className="intro">
        <div className="wrap">
          <span className="avail"><span className="pulse" /> Open to new roles &amp; projects</span>
          <h1>Gabriel Parra</h1>
          <p className="lede">
            Full-stack engineer who builds across domains that don&apos;t usually mix:
            <strong> enterprise enrollment systems, mobile apps, 3D games, and AI tooling</strong>.
            I take each one from idea to shipped.
          </p>
          <p className="sub">
            Business Analyst II at UCF Global by day, building Fittr and running BananaByte LLC the rest
            of the time. B.S. Computer Science at UCF (2026) on top of a B.S. in IT from Chile. Bilingual
            EN/ES, based in Orlando.
          </p>
          <div className="intro-links">
            <a className="btn btn-solid" href="#projects">See the work</a>
            <a className="btn" href="mailto:gabriel@gabrielparra.dev">Get in touch</a>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="wrap">
          <p className="label">Selected projects</p>
          <div className="grid">
            {PROJECTS.map((p) => (
              <a key={p.name} className="proj" href={p.href} target="_blank" rel="noopener noreferrer">
                <div className="proj-top">
                  <span className="proj-name">{p.name}</span>
                  <span className="proj-status">{p.status}</span>
                </div>
                <p className="proj-desc">{p.desc}</p>
                <div className="tags">
                  {p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
                </div>
                <span className="arrow">open →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="label">More on GitHub</p>
          <GitHubRepos />
        </div>
      </section>

      <section id="experience">
        <div className="wrap">
          <p className="label">Experience</p>
          <div className="xp">
            {EXPERIENCE.map((e) => (
              <div className="xp-item" key={e.title}>
                <span className="xp-period">{e.period}</span>
                <h3 className="xp-title">{e.title}</h3>
                <p className="xp-org">{e.org}</p>
                <ul className="xp-notes">
                  {e.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="label">Stack</p>
          <div className="stack">
            {STACK.map((g) => (
              <div className="stack-group" key={g.label}>
                <span className="stack-label">{g.label}</span>
                <div className="stack-items">
                  {g.items.map((it) => <span className="tag" key={it}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <p className="label">Contact</p>
          <div className="contact-grid">
            <div className="contact-links">
              <a className="contact-link" href="mailto:gabriel@gabrielparra.dev">
                <span className="cl-key">Email</span>
                <span className="cl-val">gabriel@gabrielparra.dev</span>
              </a>
              <a className="contact-link" href="https://github.com/gabeparra" target="_blank" rel="noopener noreferrer">
                <span className="cl-key">GitHub</span>
                <span className="cl-val">github.com/gabeparra</span>
              </a>
              <a className="contact-link" href="https://linkedin.com/in/gabeparra" target="_blank" rel="noopener noreferrer">
                <span className="cl-key">LinkedIn</span>
                <span className="cl-val">in/gabeparra</span>
              </a>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="wrap foot">
        <span>© {year} Gabriel Parra · Orlando, FL</span>
        <span
          className="konami-hint"
          onClick={onArcade}
          title="There's a hidden arcade in here."
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onArcade && onArcade() }}
        >
          ↑↑↓↓←→←→ B A
        </span>
        <span>Built with React · <a href="https://github.com/gabeparra/portfolio" target="_blank" rel="noopener noreferrer">source</a></span>
      </footer>
    </div>
  )
}
