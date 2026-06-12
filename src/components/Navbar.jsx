import './Navbar.css'

function Navbar({ onBack, onNavigateToAbout, onNavigateToPets, onNavigateToContact, currentPage }) {
  const handleHomeClick = (e) => { e.preventDefault(); onBack && onBack() }
  const handleAboutClick = (e) => { e.preventDefault(); if (currentPage !== 'about' && onNavigateToAbout) onNavigateToAbout() }
  const handlePetsClick = (e) => { e.preventDefault(); if (currentPage !== 'pets' && onNavigateToPets) onNavigateToPets() }
  const handleContactClick = (e) => { e.preventDefault(); if (currentPage !== 'contact' && onNavigateToContact) onNavigateToContact() }

  return (
    <header className="mc-header">
      <nav className="mc-nav">
        <div className="mc-brand">
          <span className="mc-brand-sigil" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>G</span>
          <span className="mc-brand-name" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>PARRA</span>
          <span className="mc-brand-tag">// MISSION CONTROL</span>
        </div>
        <ul className="mc-links">
          <li><a href="#" onClick={handleHomeClick}>Base</a></li>
          <li><a href="#about" onClick={handleAboutClick} className={currentPage === 'about' ? 'mc-link-active' : ''}>Crew File</a></li>
          <li><a href="#pets" onClick={handlePetsClick} className={currentPage === 'pets' ? 'mc-link-active' : ''}>Companions</a></li>
          <li><a href="#contact" onClick={handleContactClick} className="mc-link-cta">Open a Channel</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
