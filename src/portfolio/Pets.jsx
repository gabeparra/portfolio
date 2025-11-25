import './Pets.css'

function Pets({ onBack, onNavigateToAbout, onNavigateToContact }) {
  const handleAboutClick = (e) => {
    e.preventDefault()
    if (onNavigateToAbout) {
      onNavigateToAbout()
    }
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    if (onNavigateToContact) {
      onNavigateToContact()
    }
  }
  const pets = [
    {
      name: 'Blanco',
      species: 'Dog',
      image: '/pets/blanco.jpg',
      description: 'Blanco is a rescue dog from the streets of Chile. Despite his rough start, he\'s the most gentle and loving companion. He looks like a lab mix and has been my loyal friend for many years. His resilience and sweet nature remind me every day that every pet deserves a loving home.',
      age: '12 years old',
      personality: 'Gentle, loyal, and resilient'
    },
    {
      name: 'Mango',
      species: 'Cat',
      image: '/pets/mango.jpg',
      description: 'Mango is an orange cat and one of two brothers. He\'s full of energy and curiosity, always exploring and getting into playful mischief. Despite being young, he has a big personality and loves to be the center of attention.',
      age: 'Just over 1 year old',
      personality: 'Energetic, curious, and playful'
    },
    {
      name: 'Moyo',
      species: 'Cat',
      image: '/pets/moyo.jpg',
      description: 'Moyo is Mango\'s brother, a beautiful tabby cat. He\'s the perfect companion to his brother and together they keep the house lively. Moyo has a calm demeanor but can be just as playful when the mood strikes.',
      age: 'Just over 1 year old',
      personality: 'Calm, friendly, and playful'
    }
  ]

  return (
    <div className="pets-page">
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
            <li><a href="#pets" onClick={(e) => { e.preventDefault(); }}>Pets</a></li>
            <li><a href="#contact" onClick={handleContactClick}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="section">
          <div className="container">
            <h2 className="section-title">My Pets</h2>
            <div className="pets-intro">
              <p className="pets-intro-text">
                My pets are an important part of my life and bring me so much joy. 
                They're not just pets—they're family members who keep me company during 
                long coding sessions and remind me to take breaks and enjoy the simple things in life.
              </p>
            </div>
            <div className="pets-grid">
              {pets.map((pet, index) => (
                <div key={index} className="pet-card">
                  <div className="pet-image-container">
                    <img 
                      src={pet.image} 
                      alt={pet.name}
                      className="pet-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext fill="%2360a5fa" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EPet Photo%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  <div className="pet-info">
                    <h3 className="pet-name">{pet.name}</h3>
                    <div className="pet-details">
                      <span className="pet-species">{pet.species}</span>
                      {pet.age && <span className="pet-age"> • {pet.age}</span>}
                    </div>
                    {pet.personality && (
                      <p className="pet-personality">{pet.personality}</p>
                    )}
                    <p className="pet-description">{pet.description}</p>
                  </div>
                </div>
              ))}
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

export default Pets

