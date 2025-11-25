import './Navbar.css'

function Navbar({ onBack, onNavigateToAbout, onNavigateToPets, onNavigateToContact, currentPage }) {
  const handleHomeClick = (e) => {
    e.preventDefault()
    if (onBack) {
      onBack()
    }
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    if (currentPage !== 'about' && onNavigateToAbout) {
      onNavigateToAbout()
    }
  }

  const handlePetsClick = (e) => {
    e.preventDefault()
    if (currentPage !== 'pets' && onNavigateToPets) {
      onNavigateToPets()
    }
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    if (currentPage !== 'contact' && onNavigateToContact) {
      onNavigateToContact()
    }
  }

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <span onClick={handleHomeClick} style={{ cursor: 'pointer' }}>G</span>
          abriel Parra
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={handleHomeClick}>Home</a></li>
          <li>
            <a 
              href="#about" 
              onClick={handleAboutClick}
              className={currentPage === 'about' ? 'active' : ''}
            >
              About
            </a>
          </li>
          <li><a href="#skills" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => { document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Skills</a></li>
          <li><a href="#projects" onClick={(e) => { e.preventDefault(); onBack(); setTimeout(() => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Projects</a></li>
          <li>
            <a 
              href="#pets" 
              onClick={handlePetsClick}
              className={currentPage === 'pets' ? 'active' : ''}
            >
              Pets
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              onClick={handleContactClick}
              className={currentPage === 'contact' ? 'active' : ''}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar

