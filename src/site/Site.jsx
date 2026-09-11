import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import './site.css'

const FEATURED = [
  {
    name: 'Portbook',
    outcome:
      'Maps machines, ports, and tickets so you catch collisions before a client hits the wrong host.',
    stack: ['Python', 'Tailwind', 'stdlib http.server'],
    metrics: ['1 file', '0 deps', 'Loopback'],
    image: '/shots/portbook.webp',
    href: 'https://github.com/gabeparra/portbook',
    status: 'Live',
    tone: 'violet',
  },
  {
    name: 'BananaByte LLC',
    outcome:
      'Web & app studio for Orlando shops and small businesses — brand through deploy on an edge-static stack, flat price.',
    stack: ['Astro 5', 'Tailwind 4', 'TypeScript', 'Cloudflare'],
    metrics: ['FL studio', 'Bilingual', 'Edge'],
    image: '/shots/bananabyte.webp',
    href: 'https://bananabyte.io',
    status: 'Live',
    tone: 'amber',
  },
]

const PROJECTS = [
  {
    name: 'Strikedeck',
    outcome:
      'Options and prediction-market paper terminal with live data, positions, and optional Alpaca paper trading — tailnet only.',
    stack: ['FastAPI', 'React', 'Vite', 'Alpaca', 'Polymarket'],
    metrics: ['Real data', 'Paper only', 'Tailnet'],
    status: 'Private',
    tone: 'violet',
    panel: 'terminal',
  },
  {
    name: 'ChessCadets',
    outcome:
      'Kids’ chess in Unreal Engine 5 — holographic board, neon arenas, embedded Pulse C++ engine, story and puzzle modes. Senior capstone; the full game lives in a private remake.',
    stack: ['Unreal Engine 5', 'C++', 'Pulse', 'Lumen'],
    metrics: ['Capstone', 'Story + puzzles', 'Pulse AI'],
    status: 'Capstone · Remake',
    tone: 'cyan',
    panel: 'board',
  },
  {
    name: 'Margot AI',
    outcome:
      'Pronunciation trainer that scores Spanish and English speech in real time via ElevenLabs. Led the team end to end.',
    stack: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Docker'],
    metrics: ['ES / EN', 'Real-time', 'Team lead'],
    href: 'https://github.com/gabeparra/Margot.AI',
    status: 'Complete',
    tone: 'amber',
    panel: 'wave',
  },
  {
    name: 'Rolling with the Punches',
    outcome:
      'Western twin-stick shooter for Android in Unity 6 — touch twin-stick, three view modes, headless IL2CPP pipeline. Public itch.io build targeted for end of October; repo stays private.',
    stack: ['Unity 6', 'C#', 'URP', 'Android'],
    metrics: ['itch.io Oct', 'ARM64', '3 views'],
    status: 'Shipping Oct 2026',
    tone: 'violet',
    panel: 'gunslinger',
  },
  {
    name: 'UCF Global Portal',
    outcome:
      'Admin forms and requests for international students: uploads, role-based routing, REST backend replacing a legacy system.',
    stack: ['React', 'CoreUI', 'FastAPI', 'SQLite'],
    metrics: ['Role routing', 'Legacy replace'],
    href: 'https://github.com/gabeparra/GlobalCoreUIDemo',
    status: 'Deployed',
    tone: 'cyan',
    panel: 'forms',
  },
  {
    name: 'PhoneValidator',
    outcome:
      'Java libphonenumber validation in the Slate admissions intake via bpLogix — bad formats caught at entry, not by hand later.',
    stack: ['Java', 'libphonenumber', 'Slate', 'bpLogix'],
    metrics: ['Inside Slate', 'No manual triage'],
    href: 'https://github.com/gabeparra/PhoneValidatorJavaApp',
    status: 'Deployed',
    tone: 'amber',
    panel: 'signal',
  },
]

const MORE = [
  {
    name: 'Equipment Rental',
    outcome: 'Check-in/out for shared equipment with session auth and CSV audit logging.',
    href: 'https://github.com/gabeparra/equipment-rental',
    status: 'Tool',
  },
  {
    name: 'DockerOffline',
    outcome: 'Offline Docker Engine install bundle for air-gapped Ubuntu hosts.',
    href: 'https://github.com/gabeparra/DockerOffline',
    status: 'Tool',
  },
]

const EXPERIENCE = [
  {
    period: 'Oct 2025 — Present',
    title: 'Business Analyst II',
    org: 'UCF Global · University of Central Florida',
    notes: [
      'Slate (Technolutions) development for international admissions: portals, forms, SQL, and integrations.',
      'Built a React + TypeScript replacement for the legacy upload system and a Respond.io contact-manager integration with duplicate detection.',
      'Java libphonenumber validator wired into Slate via bpLogix; PHP modules powering the live help desk.',
    ],
  },
  {
    period: 'May 2026 — Present',
    title: 'Founder / Engineer',
    org: 'BananaByte LLC',
    notes: [
      'Web & app studio. Production sites on Astro, TypeScript, Tailwind, and Cloudflare — brand to deploy.',
    ],
  },
  {
    period: '2014 — 2023',
    title: 'IT Support & Operations',
    org: 'Repuestos Rojas · Comercial PYM Ltda — Santiago, Chile',
    notes: [
      'Nine years across frontline IT support, SQL maintenance, POS and web systems, and retail operations.',
    ],
  },
]

const SKILLS = [
  {
    n: '01',
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++', 'SQL', 'PHP'],
  },
  {
    n: '02',
    label: 'Frameworks',
    items: ['React', 'Next.js', 'React Native', 'Astro', 'FastAPI', 'Flask', 'Node.js'],
  },
  {
    n: '03',
    label: 'Platforms',
    items: ['PostgreSQL', 'MySQL', 'Docker', 'Cloudflare', 'Vercel', 'Linux', 'Git'],
  },
  {
    n: '04',
    label: 'Game development',
    items: ['Unreal Engine 5', 'Unity', 'C++ / C# gameplay', 'HLSL shaders'],
  },
  {
    n: '05',
    label: 'Enterprise & AI',
    items: ['Slate (Technolutions)', 'bpLogix', 'LLM agents', 'RAG pipelines'],
  },
]

const PILLARS = [
  {
    title: 'Clear before clever',
    text: 'I learn how the work actually runs — who touches it, where it breaks — then build the smallest thing that removes the friction.',
  },
  {
    title: 'Ship the boring wins',
    text: 'Validators, portals, offline installers, paper-trading sandboxes. The tools people stop noticing because they just work.',
  },
  {
    title: 'Own the loop',
    text: 'From brand and UX through API, deploy, and handoff. Bilingual EN/ES when the audience needs it.',
  },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useMagnetic(ref, strength = 0.28) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return undefined
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, strength])
}

function AbstractPanel({ kind, name, metrics }) {
  return (
    <div className={`abs-panel abs-${kind}`} aria-hidden="true">
      <div className="abs-noise" />
      <div className="abs-core">
        {kind === 'terminal' && (
          <pre className="abs-code">{`> strikedeck --paper
positions: synced
tailnet:   private
pnl:       tracking`}</pre>
        )}
        {kind === 'board' && (
          <div className="abs-board">
            {Array.from({ length: 64 }).map((_, i) => (
              <span key={i} className={(Math.floor(i / 8) + i) % 2 ? 'd' : 'l'} />
            ))}
          </div>
        )}
        {kind === 'wave' && (
          <svg className="abs-wave" viewBox="0 0 240 80" preserveAspectRatio="none">
            <path d="M0 40 Q30 10 60 40 T120 40 T180 40 T240 40" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M0 48 Q30 70 60 48 T120 48 T180 48 T240 48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          </svg>
        )}
        {kind === 'gunslinger' && <div className="abs-crosshair" />}
        {kind === 'forms' && (
          <div className="abs-forms">
            <span /><span /><span />
          </div>
        )}
        {kind === 'signal' && (
          <div className="abs-signal">
            <i /><i /><i /><i />
          </div>
        )}
        <p className="abs-name">{name}</p>
        {metrics && (
          <ul className="abs-metrics">
            {metrics.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function WorkCard({ project: p, featured = false }) {
  const className = [
    'work-card',
    featured ? 'is-featured' : '',
    p.image ? 'has-media' : 'no-media',
    `tone-${p.tone || 'violet'}`,
  ]
    .filter(Boolean)
    .join(' ')

  const media = p.image ? (
    <img src={p.image} alt="" loading="lazy" />
  ) : (
    <AbstractPanel kind={p.panel || 'terminal'} name={p.name} metrics={p.metrics} />
  )

  const inner = (
    <>
      <div className="work-card-media">
        {media}
        <span className="work-badge">{p.status}</span>
        <div className="work-card-glow" aria-hidden="true" />
      </div>
      <div className="work-card-body">
        <h3 className="work-card-name">
          {p.name}
          {p.href && (
            <span className="work-card-arrow" aria-hidden="true">
              ↗
            </span>
          )}
        </h3>
        <p className="work-card-outcome">{p.outcome}</p>
        {p.metrics && (
          <ul className="work-metrics">
            {p.metrics.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
        <ul className="work-stack">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </>
  )

  if (p.href) {
    return (
      <a className={className} href={p.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return <div className={className}>{inner}</div>
}

function ContactForm() {
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  const onChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setStatus({ type: '', message: '' })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus({ type: '', message: '' })
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (!serviceId || !templateId || !publicKey) throw new Error('unconfigured')
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: data.name,
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          title: data.name,
        },
        publicKey
      )
      setStatus({ type: 'ok', message: "Sent. I'll get back to you soon." })
      setData({ name: '', email: '', message: '' })
    } catch {
      setStatus({
        type: 'err',
        message: 'Couldn’t send. Email gabriel@gabrielparra.dev directly.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={data.name}
          onChange={onChange}
          required
          autoComplete="name"
          placeholder="Your name"
        />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          required
          autoComplete="email"
          placeholder="you@company.com"
        />
      </div>
      <div className="form-row">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={data.message}
          onChange={onChange}
          required
          placeholder="What are you hiring for?"
        />
      </div>
      {status.message && (
        <p className={`form-status ${status.type}`} role="status">
          {status.message}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={sending}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

export default function Site() {
  const [menuOpen, setMenuOpen] = useState(false)
  const ctaRef = useRef(null)
  useReveal()
  useMagnetic(ctaRef, 0.22)

  useEffect(() => {
    document.body.classList.add('site-body')
    return () => document.body.classList.remove('site-body')
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const goTo = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      history.replaceState(null, '', '#top')
    }
  }

  return (
    <div className="site">
      <div className="site-atmosphere" aria-hidden="true">
        <div className="atm-grid" />
        <div className="atm-glow atm-glow-a" />
        <div className="atm-glow atm-glow-b" />
        <div className="atm-glow atm-glow-c" />
        <div className="atm-grain" />
      </div>

      <header className="site-header">
        <nav className="pill-nav" aria-label="Primary">
          <a href="#top" className="pill-brand" onClick={goTo('top')}>
            <span className="pill-mark" aria-hidden="true" />
            Gabriel Parra
          </a>

          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="pill-links"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>

          <ul id="pill-links" className={`pill-links${menuOpen ? ' is-open' : ''}`}>
            <li>
              <a href="#work" onClick={goTo('work')}>
                Work
              </a>
            </li>
            <li>
              <a href="#about" onClick={goTo('about')}>
                About
              </a>
            </li>
            <li>
              <a href="#skills" onClick={goTo('skills')}>
                Skills
              </a>
            </li>
          </ul>

          <a href="#contact" className="pill-cta" onClick={goTo('contact')}>
            Open to work
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-eyebrow fade-up">
              <span className="pulse-dot" aria-hidden="true" />
              Open to work · Orlando / Space Coast
            </p>
            <h1 className="hero-display fade-up delay-1">
              <span className="hero-line-a">Build systems</span>
              <span className="hero-line-b">
                that <em>ship</em>
              </span>
              <span className="hero-line-c">and stick.</span>
            </h1>
            <p className="hero-sub fade-up delay-2">
              I&apos;m <strong>Gabriel Parra</strong> — full-stack engineer crafting enrollment
              platforms, web products, and games. Business Analyst II at UCF Global. Founder of
              BananaByte LLC. Bilingual EN/ES.
            </p>
            <ul className="hero-chips fade-up delay-3">
              <li>UCF Global</li>
              <li>BananaByte</li>
              <li>EN / ES</li>
              <li>from UCF</li>
            </ul>
            <div className="hero-actions fade-up delay-4">
              <a
                ref={ctaRef}
                href="#work"
                className="btn btn-primary btn-magnetic"
                onClick={goTo('work')}
              >
                See selected work
              </a>
              <a href="#contact" className="btn btn-ghost" onClick={goTo('contact')}>
                Let&apos;s talk
              </a>
            </div>
          </div>

          <aside className="hero-aside fade-up delay-2" aria-label="Featured project">
            <a
              className="hero-feature"
              href="https://github.com/gabeparra/portbook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="hero-feature-media">
                <img src="/shots/portbook.webp" alt="Portbook screenshot" />
                <div className="hero-feature-shine" aria-hidden="true" />
              </div>
              <div className="hero-feature-meta">
                <div className="hero-feature-top">
                  <span className="work-badge">Live</span>
                  <span className="hero-feature-index">01 / featured</span>
                </div>
                <p className="hero-feature-name">Portbook</p>
                <p className="hero-feature-desc">
                  Machine · port · ticket map — catch collisions before clients do.
                </p>
              </div>
            </a>
          </aside>
        </section>

        <section id="work" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">
              <span className="sticky-label">01 — Work</span>
            </p>
            <h2 className="section-title is-spaced">Selected work</h2>
            <p className="section-lede">
              Screenshot-first where it helps. Private builds stay private — no fake links, no empty
              black boxes.
            </p>
          </header>

          <div className="work-featured">
            {FEATURED.map((p) => (
              <WorkCard key={p.name} project={p} featured />
            ))}
          </div>

          <div className="work-grid">
            {PROJECTS.map((p) => (
              <WorkCard key={p.name} project={p} />
            ))}
          </div>

          <div className="work-more">
            {MORE.map((p) => (
              <a
                key={p.name}
                className="work-more-row"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="work-more-status">{p.status}</span>
                <span className="work-more-name">{p.name}</span>
                <span className="work-more-desc">{p.outcome}</span>
                <span className="work-card-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="about" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">
              <span className="sticky-label">02 — About</span>
            </p>
            <h2 className="section-title is-spaced">Hi — I&apos;m Gabriel</h2>
          </header>

          <div className="about-grid">
            <div className="about-bio">
              <p>
                I work in higher-ed enrollment systems by day and ship web, AI, and game projects the
                rest of the time. At UCF Global I build and integrate the Slate (Technolutions)
                systems international students use to reach the university.
              </p>
              <p>
                My range runs from React/TypeScript front-ends and Python/Java back-ends to enterprise
                workflow engines, LLM tooling, and Unity. I care about simplifying workflows, killing
                manual triage, and building tools people actually use.
              </p>
              <p>
                B.S. Computer Science from UCF (Aug 2026), plus a B.S. in Information Technology from
                Chile. Based in Orlando — close enough to the Cape to hear the launches.
              </p>
              <div className="about-cert">
                <span className="cert-label">Certified</span>
                <p>Fundamentals of Admissions &amp; Enrollment (2026)</p>
                <p className="cert-org">Technolutions Slate</p>
              </div>
            </div>

            <div className="about-exp">
              <h3 className="exp-heading">Experience</h3>
              {EXPERIENCE.map((e) => (
                <article key={e.title} className="exp-card">
                  <p className="exp-period">{e.period}</p>
                  <h4 className="exp-title">{e.title}</h4>
                  <p className="exp-org">{e.org}</p>
                  <ul>
                    {e.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="working" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">
              <span className="sticky-label">03 — Working with me</span>
            </p>
            <h2 className="section-title is-spaced">What you can expect</h2>
          </header>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <article key={p.title} className="pillar-card">
                <span className="pillar-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">
              <span className="sticky-label">04 — Capabilities</span>
            </p>
            <h2 className="section-title is-spaced">Stack I reach for</h2>
          </header>
          <div className="skill-rows">
            {SKILLS.map((s) => (
              <div key={s.label} className="skill-row">
                <span className="skill-n">{s.n}</span>
                <h3 className="skill-label">{s.label}</h3>
                <ul className="skill-chips">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section section-contact reveal">
          <header className="section-head section-head-finale">
            <p className="section-kicker">
              <span className="sticky-label">05 — Contact</span>
            </p>
            <h2 className="finale-title">
              Let&apos;s build
              <br />
              <em>something sharp.</em>
            </h2>
            <p className="section-lede">
              Open to full-time remote roles. I usually reply within a day.
            </p>
          </header>
          <div className="contact-grid">
            <ContactForm />
            <aside className="contact-aside">
              <a href="mailto:gabriel@gabrielparra.dev" className="contact-link">
                gabriel@gabrielparra.dev
              </a>
              <a
                href="https://github.com/gabeparra"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                GitHub · gabeparra
              </a>
              <a
                href="https://linkedin.com/in/gabeparra"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                LinkedIn · gabeparra
              </a>
              <a
                href="https://bananabyte.io"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                bananabyte.io
              </a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p className="footer-mark">GP</p>
        <p>© {new Date().getFullYear()} Gabriel Parra</p>
        <p className="footer-note">Orlando / Space Coast · EN / ES · Open to work</p>
      </footer>
    </div>
  )
}
