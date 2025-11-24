import './Portfolio.css'

function Portfolio() {
  return (
    <div className="portfolio">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">Gabriel Parra</div>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Computer Scientist &<br />
              Software Developer
            </h1>
            <p className="hero-subtitle">
              Crafting elegant solutions through code and innovation
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <a href="#contact" className="btn btn-secondary">Get in Touch</a>
            </div>
          </div>
          <div className="hero-accent"></div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="about-content">
              <p className="about-text">
                I'm a computer scientist passionate about solving complex problems through 
                innovative software solutions. With expertise in software development, 
                algorithms, and system design, I thrive on building applications that make 
                a meaningful impact.
              </p>
              <p className="about-text">
                My journey in technology has been driven by curiosity and a constant desire 
                to learn. I enjoy working on challenging projects that push the boundaries 
                of what's possible with code.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" className="section section-dark">
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              <div className="skill-card">
                <h3>Programming Languages</h3>
                <ul>
                  <li>JavaScript</li>
                  <li>Python</li>
                  <li>Java</li>
                  <li>C++</li>
                  <li>PHP</li>
                </ul>
              </div>
              <div className="skill-card">
                <h3>Technologies</h3>
                <ul>
                  <li>React</li>
                  <li>Node.js</li>
                  <li>Git</li>
                  <li>Linux</li>
                  <li>Databases</li>
                </ul>
              </div>
              <div className="skill-card">
                <h3>Areas of Expertise</h3>
                <ul>
                  <li>Web Development</li>
                  <li>Algorithms</li>
                  <li>System Design</li>
                  <li>Software Architecture</li>
                  <li>Problem Solving</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <h2 className="section-title">Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-header">
                  <h3>Project Name</h3>
                  <div className="project-links">
                    <a href="#" className="project-link">GitHub</a>
                    <a href="#" className="project-link">Live</a>
                  </div>
                </div>
                <p className="project-description">
                  Description of your project. Explain what it does, technologies used, 
                  and what makes it special.
                </p>
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">API</span>
                </div>
              </div>

              <div className="project-card">
                <div className="project-header">
                  <h3>Project Name</h3>
                  <div className="project-links">
                    <a href="#" className="project-link">GitHub</a>
                    <a href="#" className="project-link">Live</a>
                  </div>
                </div>
                <p className="project-description">
                  Description of your project. Explain what it does, technologies used, 
                  and what makes it special.
                </p>
                <div className="project-tags">
                  <span className="tag">Python</span>
                  <span className="tag">Machine Learning</span>
                  <span className="tag">Data</span>
                </div>
              </div>

              <div className="project-card">
                <div className="project-header">
                  <h3>Project Name</h3>
                  <div className="project-links">
                    <a href="#" className="project-link">GitHub</a>
                    <a href="#" className="project-link">Live</a>
                  </div>
                </div>
                <p className="project-description">
                  Description of your project. Explain what it does, technologies used, 
                  and what makes it special.
                </p>
                <div className="project-tags">
                  <span className="tag">Java</span>
                  <span className="tag">Spring</span>
                  <span className="tag">Backend</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section section-dark">
          <div className="container">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-content">
              <p className="contact-text">
                I'm always interested in new opportunities and collaborations. 
                Feel free to reach out!
              </p>
              <div className="contact-links">
                <a href="mailto:your.email@example.com" className="contact-link">
                  Email
                </a>
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="contact-link">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="contact-link">
                  LinkedIn
                </a>
              </div>
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

export default Portfolio

