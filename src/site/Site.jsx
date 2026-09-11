import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './site.css'

const FEATURED = [
  {
    name: 'Portbook',
    outcome:
      'Maps machines, ports, and tickets so you catch collisions before a client hits the wrong host.',
    stack: ['Python', 'Tailwind', 'stdlib http.server'],
    image: '/shots/portbook.webp',
    href: 'https://github.com/gabeparra/portbook',
    status: 'Live',
  },
  {
    name: 'BananaByte LLC',
    outcome:
      'My web and app studio for Orlando shops and small businesses — brand through deploy on an edge-static stack, flat price.',
    stack: ['Astro 5', 'Tailwind 4', 'TypeScript', 'Cloudflare'],
    image: '/shots/bananabyte.webp',
    href: 'https://bananabyte.io',
    status: 'Live',
  },
]

const PROJECTS = [
  {
    name: 'Strikedeck',
    outcome:
      'Options and prediction-market paper terminal with live data, positions, and optional Alpaca paper trading. Runs on my tailnet only.',
    stack: ['FastAPI', 'React', 'Vite', 'Alpaca', 'Polymarket'],
    status: 'Private',
  },
  {
    name: 'ChessCadets',
    outcome:
      'Kids’ chess in Unreal Engine 5 — holographic board, neon arenas, embedded Pulse C++ engine, story and puzzle modes. Senior capstone; the full game lives in a private remake.',
    stack: ['Unreal Engine 5', 'C++', 'Pulse', 'Lumen'],
    status: 'Capstone · remake',
  },
  {
    name: 'Margot AI',
    outcome:
      'Pronunciation trainer that scores Spanish and English speech in real time via ElevenLabs. I led the team end to end.',
    stack: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Docker'],
    href: 'https://github.com/gabeparra/Margot.AI',
    status: 'Complete',
  },
  {
    name: 'Rolling with the Punches',
    outcome:
      'Western twin-stick shooter for Android in Unity 6. Public itch.io build targeted for end of October; repo stays private for licensed assets.',
    stack: ['Unity 6', 'C#', 'URP', 'Android'],
    status: 'Shipping Oct 2026',
  },
  {
    name: 'UCF Global Portal',
    outcome:
      'Admin forms and requests for international students: uploads, role-based routing, REST backend replacing a legacy system.',
    stack: ['React', 'CoreUI', 'FastAPI', 'SQLite'],
    href: 'https://github.com/gabeparra/GlobalCoreUIDemo',
    status: 'Deployed',
  },
  {
    name: 'PhoneValidator',
    outcome:
      'Java libphonenumber validation in the Slate admissions intake via bpLogix — bad formats caught at entry, not by hand later.',
    stack: ['Java', 'libphonenumber', 'Slate', 'bpLogix'],
    href: 'https://github.com/gabeparra/PhoneValidatorJavaApp',
    status: 'Deployed',
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
      'Web and app studio. Production sites on Astro, TypeScript, Tailwind, and Cloudflare — brand to deploy.',
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

const CAPABILITIES = [
  {
    num: '01',
    title: 'Product & systems',
    body: 'Enrollment workflows, admin portals, and integrations that cut manual triage — Slate, React, and the glue between them.',
  },
  {
    num: '02',
    title: 'Full-stack delivery',
    body: 'TypeScript and React on the front; Python, Java, and Node on the back. Ship the path from whiteboard to production.',
  },
  {
    num: '03',
    title: 'Studio & clients',
    body: 'BananaByte: brand-to-deploy sites for Orlando shops on Astro, Tailwind, and Cloudflare — clear scope, flat price.',
  },
  {
    num: '04',
    title: 'Games & interactive',
    body: 'Unreal and Unity when the brief needs play — capstone chess, twin-stick shooters, and the occasional engine deep dive.',
  },
]

const PILLARS = [
  {
    title: 'Clear scope',
    body: 'I ask what success looks like before writing code. Fewer surprises, fewer rewrites.',
  },
  {
    title: 'Ship in the open',
    body: 'Working demos and honest status beats polish theater. Private when it has to be; public when it helps.',
  },
  {
    title: 'Own the edges',
    body: 'Forms, validators, integrations, deploy — the boring parts that decide whether people actually use the thing.',
  },
]

const SKILLS = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++', 'SQL', 'PHP'],
  },
  {
    label: 'Frameworks',
    items: ['React', 'Next.js', 'React Native', 'Astro', 'FastAPI', 'Flask', 'Node.js'],
  },
  {
    label: 'Platforms',
    items: ['PostgreSQL', 'MySQL', 'Docker', 'Cloudflare', 'Vercel', 'Linux', 'Git'],
  },
  {
    label: 'Games',
    items: ['Unreal Engine 5', 'Unity', 'C++ / C# gameplay', 'HLSL'],
  },
  {
    label: 'Enterprise & AI',
    items: ['Slate (Technolutions)', 'bpLogix', 'LLM agents', 'RAG'],
  },
]

function WorkItem({ project: p, large = false }) {
  const className = ['work-item', large ? 'is-large' : '', p.image ? 'has-shot' : '']
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      {p.image ? (
        <div className="work-shot">
          <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
        </div>
      ) : null}
      <div className="work-body">
        <div className="work-top">
          <h3 className="work-name">
            {p.name}
            {p.href ? <span aria-hidden="true"> ↗</span> : null}
          </h3>
          <span className="work-status">{p.status}</span>
        </div>
        <p className="work-outcome">{p.outcome}</p>
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
        {body}
      </a>
    )
  }
  return <article className={className}>{body}</article>
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
      setStatus({ type: 'ok', message: "Sent — I'll reply soon." })
      setData({ name: '', email: '', message: '' })
    } catch {
      setStatus({
        type: 'err',
        message: 'Couldn’t send. Email gabriel@gabrielparra.dev instead.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={data.name}
          onChange={onChange}
          required
          autoComplete="name"
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={onChange}
          required
          autoComplete="email"
        />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={data.message}
          onChange={onChange}
          required
        />
      </div>
      {status.message ? (
        <p className={`form-note ${status.type}`} role="status">
          {status.message}
        </p>
      ) : null}
      <button type="submit" className="btn" disabled={sending}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

export default function Site() {
  const [menuOpen, setMenuOpen] = useState(false)

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
      <header className="site-header">
        <div className="nav-bar">
          <a href="#top" className="nav-brand" onClick={goTo('top')}>
            <span className="nav-dot" aria-hidden="true" />
            gabrielparra
          </a>

          <nav className="nav-pill" aria-label="Primary">
            <button
              type="button"
              className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-links"
              onClick={() => setMenuOpen((o) => !o)}
            >
              Menu
            </button>
            <ul id="nav-links" className={`nav-links${menuOpen ? ' is-open' : ''}`}>
              <li>
                <a href="#top" onClick={goTo('top')}>
                  Home
                </a>
              </li>
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
          </nav>

          <a href="#contact" className="nav-cta" onClick={goTo('contact')}>
            Contact
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="hero-hello">Hello, I&apos;m Gabriel.</p>
          <h1 className="hero-name">Gabriel Parra</h1>
          <p className="hero-role">
            Full-stack engineer · Business Analyst II at UCF Global · Founder, BananaByte LLC
          </p>
          <p className="hero-place">Orlando / Space Coast · EN / ES · from UCF (Aug 2026)</p>

          <p className="hero-position">
            Building products from zero to one. I pair product thinking with hands-on design and
            engineering — enrollment systems by day, client sites and the occasional game on the
            side — so the work ships and people actually use it.
          </p>

          <div className="hero-reach" aria-label="How to reach me">
            <a href="mailto:gabriel@gabrielparra.dev">gabriel@gabrielparra.dev</a>
            <a href="https://github.com/gabeparra" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/gabeparra" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://bananabyte.io" target="_blank" rel="noopener noreferrer">
              bananabyte.io
            </a>
          </div>

          <div className="hero-actions">
            <a href="#work" className="btn" onClick={goTo('work')}>
              Selected work
            </a>
            <a href="#contact" className="btn btn-quiet" onClick={goTo('contact')}>
              Open to work
            </a>
          </div>
        </section>

        <section className="section section-pillars" aria-labelledby="pillars-title">
          <header className="section-head">
            <p className="section-kicker">// Working with me</p>
            <h2 id="pillars-title" className="section-title">
              How I show up
            </h2>
          </header>
          <div className="pillar-grid">
            {PILLARS.map((p) => (
              <article key={p.title} className="pillar">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="section">
          <header className="section-head">
            <p className="section-kicker">// Selected work</p>
            <h2 className="section-title">Things I&apos;ve shipped</h2>
            <p className="section-lede">
              Screenshots when I have them. Private builds stay labeled — no filler panels.
            </p>
          </header>

          <div className="work-featured">
            {FEATURED.map((p) => (
              <WorkItem key={p.name} project={p} large />
            ))}
          </div>

          <div className="work-list">
            {PROJECTS.map((p) => (
              <WorkItem key={p.name} project={p} />
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
              </a>
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <header className="section-head">
            <p className="section-kicker">// About</p>
            <h2 className="section-title">Who I am</h2>
          </header>

          <div className="about-grid">
            <div className="about-copy">
              <p>
                I&apos;m Gabriel — a full-stack engineer working in higher-ed enrollment systems and
                shipping web, AI, and game projects on the side. At UCF Global I build and integrate
                the Slate (Technolutions) tools international students use to reach the university.
              </p>
              <p>
                Day to day that means React and TypeScript on the front, Python and Java on the back,
                plus enterprise workflow engines and the occasional Unity or Unreal build. I like
                clearing friction: fewer manual triage steps, clearer tools, stuff people actually use.
              </p>
              <p>
                B.S. Computer Science from UCF (Aug 2026), and a B.S. in Information Technology from
                Chile. Based in Orlando. Close enough to the Cape to hear the launches.
              </p>
              <p className="about-cert">
                <span className="about-cert-label">Certified</span>
                Fundamentals of Admissions &amp; Enrollment (2026) — Technolutions Slate
              </p>
            </div>

            <div className="about-exp">
              <h3 className="exp-label">Experience</h3>
              {EXPERIENCE.map((e) => (
                <article key={e.title} className="exp-item">
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

        <section className="section" aria-labelledby="capabilities-title">
          <header className="section-head">
            <p className="section-kicker">// Capabilities</p>
            <h2 id="capabilities-title" className="section-title">
              What I bring
            </h2>
          </header>
          <div className="cap-list">
            {CAPABILITIES.map((c) => (
              <article key={c.num} className="cap-row">
                <span className="cap-num" aria-hidden="true">
                  {c.num}
                </span>
                <div className="cap-body">
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <header className="section-head">
            <p className="section-kicker">// Stack</p>
            <h2 className="section-title">Tools I use</h2>
          </header>
          <div className="skill-list">
            {SKILLS.map((s) => (
              <div key={s.label} className="skill-row">
                <h3 className="skill-label">{s.label}</h3>
                <ul className="skill-items">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section section-contact">
          <header className="section-head">
            <p className="section-kicker">// Contact</p>
            <h2 className="section-title">Let&apos;s talk</h2>
            <p className="section-lede">
              Open to full-time remote roles. I usually reply within a day.
            </p>
          </header>
          <div className="contact-grid">
            <ContactForm />
            <aside className="contact-aside">
              <a href="mailto:gabriel@gabrielparra.dev">gabriel@gabrielparra.dev</a>
              <a href="https://github.com/gabeparra" target="_blank" rel="noopener noreferrer">
                GitHub · gabeparra
              </a>
              <a href="https://linkedin.com/in/gabeparra" target="_blank" rel="noopener noreferrer">
                LinkedIn · gabeparra
              </a>
              <a href="https://bananabyte.io" target="_blank" rel="noopener noreferrer">
                bananabyte.io
              </a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Gabriel Parra</p>
        <p>Orlando · EN / ES</p>
      </footer>
    </div>
  )
}
