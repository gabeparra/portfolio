import './Portfolio.css'
import { useState, useEffect } from 'react'

function Portfolio({ onEasterEggClick, onNavigateToAbout }) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.github.com/users/gabeparra/repos?sort=updated&per_page=12')
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }))
          throw new Error(errorData.message || `GitHub API error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        const filteredRepos = data.filter(repo => !repo.fork || repo.name === 'portfolio')
        setRepos(filteredRepos)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching repos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  const handleGClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEasterEggClick) {
      onEasterEggClick('G')
    }
  }

  const handleCClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEasterEggClick) {
      onEasterEggClick('C')
    }
  }

  const handleMobileGamesClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEasterEggClick) {
      onEasterEggClick('G')
      setTimeout(() => {
        onEasterEggClick('C')
      }, 50)
    }
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    if (onNavigateToAbout) {
      onNavigateToAbout()
    }
  }

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#ed8b00',
      'PHP': '#777bb4',
      'C#': '#239120',
      'HTML': '#e34c26'
    }
    return colors[language] || '#60a5fa'
  }

  const displayedRepos = showAll ? repos : repos.slice(0, 3)
  const hasMore = repos.length > 3

  return (
    <div className="portfolio">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <span 
              className="easter-egg-letter" 
              onClick={handleGClick}
              onTouchStart={handleGClick}
            >G</span>
            abriel Parra
          </div>
          <ul className="nav-links">
            <li><a href="#about" onClick={handleAboutClick}>About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title hero-title-with-easter-egg">
              Computer Scientist &<br />
              Software Developer<br />
              <span style={{ fontSize: '0.7em', fontWeight: '600' }}>Bachelor's Degree in IT</span>
              <span 
                className="easter-egg-overlay-c" 
                onClick={handleCClick}
                onTouchStart={handleCClick}
              ></span>
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
            {loading && (
              <div className="loading-state">
                <p>Loading projects...</p>
              </div>
            )}
            {error && (
              <div className="error-state">
                <p>Error loading projects: {error}</p>
              </div>
            )}
            {!loading && !error && (
              <>
                <div className="projects-grid">
                  {displayedRepos.length > 0 ? (
                    displayedRepos.map((repo) => (
                      <div key={repo.id} className="project-card">
                        <div className="project-header">
                          <h3>{repo.name}</h3>
                          <div className="project-links">
                            <a 
                              href={repo.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="project-link"
                            >
                              GitHub
                            </a>
                            {repo.homepage && (
                              <a 
                                href={repo.homepage} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="project-link"
                              >
                                Live
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="project-description">
                          {repo.description || 'No description available.'}
                        </p>
                        <div className="project-tags">
                          {repo.language && (
                            <span 
                              className="tag"
                              style={{ 
                                borderColor: getLanguageColor(repo.language),
                                color: getLanguageColor(repo.language)
                              }}
                            >
                              {repo.language}
                            </span>
                          )}
                          {repo.topics && repo.topics.slice(0, 3).map((topic) => (
                            <span key={topic} className="tag">{topic}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="loading-state">No repositories found.</p>
                  )}
                </div>
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button 
                      onClick={() => setShowAll(!showAll)}
                      className="btn btn-secondary"
                    >
                      {showAll ? 'Show Less' : 'View More'}
                    </button>
                  </div>
                )}
              </>
            )}
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
                <a href="mailto:gabpar49@gmail.com" className="contact-link">
                  Email
                </a>
                <a href="https://github.com/gabeparra" target="_blank" rel="noopener noreferrer" className="contact-link">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/gabeparra" target="_blank" rel="noopener noreferrer" className="contact-link">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Gabriel Parra. All rights reserved.</p>
        <button 
          type="button"
          className="mobile-games-link"
          onClick={handleMobileGamesClick}
          onTouchEnd={(e) => {
            e.preventDefault()
            handleMobileGamesClick(e)
          }}
        >
          🎮
        </button>
      </footer>
    </div>
  )
}

export default Portfolio

