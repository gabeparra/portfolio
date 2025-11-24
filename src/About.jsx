import './About.css'

function About({ onBack }) {
  return (
    <div className="about-page">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <span onClick={onBack} style={{ cursor: 'pointer' }}>G</span>
            abriel Parra
          </div>
          <ul className="nav-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Home</a></li>
            <li><a href="#skills" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => { document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Skills</a></li>
            <li><a href="#projects" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Projects</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="section">
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="about-content">
              <p className="about-text">
                I'm Gabriel (Mariano) Parra, a computer science student and software developer with a strong focus on building practical, efficient, and well-designed solutions. I enjoy working across multiple areas of technology — from backend development and automation to application design and systems troubleshooting.
              </p>
              <p className="about-text">
                My experience ranges from developing Python and Java applications to integrating services through APIs, webhooks, and automation tools like n8n. I've also worked on web development projects, internal tools, and IT support tasks such as system setup, diagnostics, and optimization. I approach every project with curiosity and a drive to understand how things work under the hood.
              </p>
              <p className="about-text">
                What motivates me most is solving real problems: simplifying workflows, improving user experience, and creating tools that genuinely help people. I thrive in environments where I can learn continuously, refine systems, and contribute to building reliable, thoughtful software.
              </p>
              <p className="about-text">
                Outside of coursework and development, I'm always exploring new technologies, improving processes, and finding opportunities to turn ideas into practical solutions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Gabriel Parra. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default About

