import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import './site.css'

const PROJECTS = [
  {
    name: 'Portbook',
    outcome: 'Maps machines, ports, and tickets so you catch collisions before a client hits the wrong host.',
    stack: ['Python', 'Tailwind', 'stdlib http.server'],
    image: '/shots/portbook.webp',
    href: 'https://github.com/gabeparra/portbook',
    status: 'Live',
  },
  {
    name: 'Strikedeck',
    outcome: 'Options and prediction-market paper terminal with live data, positions, and optional Alpaca paper trading — tailnet only.',
    stack: ['FastAPI', 'React', 'Vite', 'Alpaca', 'Polymarket'],
    status: 'Private',
  },
  {
    name: 'ChessKids',
    outcome: 'Kids’ chess in Unreal Engine 5 — holographic board, neon arenas, embedded Pulse C++ engine, story and puzzle modes. Senior capstone; the full game lives in a private remake.',
    stack: ['Unreal Engine 5', 'C++', 'Pulse', 'Lumen'],
    status: 'Capstone · Remake',
  },
  {
    name: 'Margot AI',
    outcome: 'Pronunciation trainer that scores Spanish and English speech in real time via ElevenLabs. Led the team end to end.',
    stack: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Docker'],
    href: 'https://github.com/gabeparra/Margot.AI',
    status: 'Complete',
  },
  {
    name: 'BananaByte LLC',
    outcome: 'Web and app studio for Orlando shops and small businesses — brand through deploy on an edge-static stack, flat price.',
    stack: ['Astro 5', 'Tailwind 4', 'TypeScript', 'Cloudflare'],
    image: '/shots/bananabyte.webp',
    href: 'https://bananabyte.io',
    status: 'Live',
  },
  {
    name: 'UCF Global Portal',
    outcome: 'Admin forms and requests for international students: uploads, role-based routing, REST backend replacing a legacy system.',
    stack: ['React', 'CoreUI', 'FastAPI', 'SQLite'],
    href: 'https://github.com/gabeparra/GlobalCoreUIDemo',
    status: 'Deployed',
  },
  {
    name: 'Rolling with the Punches',
    outcome: 'Western twin-stick shooter for Android in Unity 6 — touch twin-stick, three view modes, headless IL2CPP pipeline. Public itch.io build targeted for end of October; repo stays private.',
    stack: ['Unity 6', 'C#', 'URP', 'Android'],
    status: 'Shipping Oct 2026',
  },
  {
    name: 'PhoneValidator',
    outcome: 'Java libphonenumber validation in the Slate admissions intake via bpLogix — bad formats caught at entry, not by hand later.',
    stack: ['Java', 'libphonenumber', 'Slate', 'bpLogix'],
    href: 'https://github.com/gabeparra/PhoneValidatorJavaApp',
    status: 'Deployed',
  },
  {
    name: 'Equipment Rental',
    outcome: 'Mobile-friendly check-in/out for shared equipment with session auth, server-side status, and CSV audit logging.',
    stack: ['JavaScript', 'Python', 'HTML/CSS'],
    href: 'https://github.com/gabeparra/equipment-rental',
    status: 'Tool',
  },
  {
    name: 'DockerOffline',
    outcome: 'Offline Docker Engine install bundle for Ubuntu — fetch packages online, install on air-gapped hosts.',
    stack: ['Bash', 'Debian packaging'],
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
      'Slate (Technolutions) development for international admissions: portals, forms, SQL queries, and integrations.',
      'Built a React + TypeScript replacement for the legacy upload system and a Respond.io contact-manager integration with duplicate detection.',
      'Java libphonenumber validator wired into the Slate intake via bpLogix Process Director; PHP modules powering the live help desk.',
    ],
  },
  {
    period: 'May 2026 — Present',
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function ProjectRow({ project: p, index }) {
  const body = (
    <>
      <div className="work-meta">
        <span className="work-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="work-status">{p.status}</span>
      </div>
      <div className="work-copy">
        <h3 className="work-name">
          {p.name}
          {p.href && <span className="work-arrow" aria-hidden="true">↗</span>}
        </h3>
        <p className="work-outcome">{p.outcome}</p>
        <ul className="work-stack">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      {p.image && (
        <div className="work-shot">
          <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
        </div>
      )}
    </>
  )

  if (p.href) {
    return (
      <a
        className={`work-row${p.image ? ' has-shot' : ''}`}
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    )
  }

  return <div className={`work-row${p.image ? ' has-shot' : ''}`}>{body}</div>
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
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('unconfigured')
      }
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
  useReveal()

  useEffect(() => {
    document.body.classList.add('site-body')
    return () => document.body.classList.remove('site-body')
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site">
      <div className="site-atmosphere" aria-hidden="true" />

      <header className="site-header">
        <nav className="site-nav" aria-label="Primary">
          <a href="#top" className="nav-brand" onClick={closeMenu}>
            Gabriel Parra
          </a>
          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-nav-links"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
          <ul id="site-nav-links" className={`nav-links${menuOpen ? ' open' : ''}`}>
            <li>
              <a href="#work" onClick={closeMenu}>
                Work
              </a>
            </li>
            <li>
              <a href="#about" onClick={closeMenu}>
                About
              </a>
            </li>
            <li>
              <a href="#skills" onClick={closeMenu}>
                Skills
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-cta" onClick={closeMenu}>
                Open to work
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="hero-brand fade-up">Gabriel Parra</p>
          <h1 className="hero-line fade-up delay-1">
            Full-stack engineer building enrollment systems, web products, and games from Orlando.
          </h1>
          <p className="hero-sub fade-up delay-2">
            Business Analyst II at UCF Global · Founder of BananaByte LLC · bilingual EN/ES · Space Coast adjacent.
          </p>
          <div className="hero-cta fade-up delay-3">
            <a href="#work" className="btn btn-primary">
              See selected work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contact
            </a>
          </div>
        </section>

        <section id="work" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">Selected work</p>
            <h2 className="section-title">Things I&apos;ve shipped</h2>
            <p className="section-lede">
              Outcome first. Screenshots when they help; private builds stay private.
            </p>
          </header>
          <div className="work-list">
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.name} project={p} index={i} />
            ))}
          </div>
        </section>

        <section id="about" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">About</p>
            <h2 className="section-title">Hi — I&apos;m Gabriel</h2>
          </header>
          <div className="about-grid">
            <div className="about-bio">
              <p>
                I work in higher-ed enrollment systems by day and ship web, AI, and game projects the rest of the time.
                At UCF Global I build and integrate the Slate (Technolutions) systems international students use to reach the university.
              </p>
              <p>
                My range runs from React/TypeScript front-ends and Python/Java back-ends to enterprise workflow engines,
                LLM tooling, and Unity. I care about simplifying workflows, killing manual triage, and building tools people actually use.
              </p>
              <p>
                B.S. Computer Science from UCF (Aug 2026), plus a B.S. in Information Technology from Chile.
                Based in Orlando — close enough to the Cape to hear the launches.
              </p>
              <p className="about-cert">
                <span className="cert-label">Certified</span>
                Fundamentals of Admissions &amp; Enrollment (2026) · Technolutions Slate
              </p>
            </div>
            <div className="about-exp">
              <h3 className="exp-heading">Experience</h3>
              {EXPERIENCE.map((e) => (
                <article key={e.title} className="exp-entry">
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
            <p className="section-kicker">Working with me</p>
            <h2 className="section-title">What you can expect</h2>
          </header>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <article key={p.title} className="pillar">
                <span className="pillar-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section reveal">
          <header className="section-head">
            <p className="section-kicker">Capabilities</p>
            <h2 className="section-title">Stack I reach for</h2>
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
          <header className="section-head">
            <p className="section-kicker">Contact</p>
            <h2 className="section-title">Let&apos;s talk</h2>
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
        <p>© {new Date().getFullYear()} Gabriel Parra</p>
        <p className="footer-note">Orlando / Space Coast · EN / ES</p>
      </footer>
    </div>
  )
}
