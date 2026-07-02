import './Pets.css'

function Pets() {
  const pets = [
    {
      name: 'Blanco',
      species: 'Dog',
      image: '/pets/blanco.jpg',
      focus: '47% 42%',
      description: 'Blanco is a rescue dog from the streets of Chile. Despite his rough start, he\'s the most gentle and loving companion. He looks like a lab mix and has been my loyal friend for many years. His resilience and sweet nature remind me every day that every pet deserves a loving home.',
      age: '12 years old',
      personality: 'Gentle, loyal, and resilient'
    },
    {
      name: 'Mango',
      species: 'Cat',
      image: '/pets/mango.jpg',
      focus: '33% 37%',
      description: 'Mango is an orange tabby we rescued here in Florida, and he is basically Garfield in the fur. Lasagna-level devotion to food, world-class at lounging, and a big personality he is never shy about. He and his brother Moyo came up together.',
      age: 'Just over 1 year old',
      personality: 'Lazy, food-obsessed, pure Garfield'
    },
    {
      name: 'Moyo',
      species: 'Cat',
      image: '/pets/moyo.jpg',
      focus: '50% 27%',
      description: 'Moyo is Mango\'s brother, a grey tabby also rescued in Florida. He is deeply shy and thoroughly antisocial, and the short list of things he actually likes is Mango and eating. Catch him at the right moment though and he detonates into full-speed zoomies around the house.',
      age: 'Just over 1 year old',
      personality: 'Shy, antisocial, chaotic zoomies'
    }
  ]

  return (
    <div className="pets-page mc">

      <main>
        <section className="section">
          <div className="container">
            <div className="mc-section-head">
              <span className="mc-section-no">XO</span>
              <h2 className="mc-section-title">COMPANIONS</h2>
              <span className="mc-section-line"></span>
            </div>
            <div className="pets-intro">
              <p className="pets-intro-text">
                My pets are an important part of my life and bring me so much joy. 
                They're not just pets, they're crew. They keep me company during long coding sessions and remind me to take breaks and enjoy the simple things in life.
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
                      style={pet.focus ? { objectPosition: pet.focus } : undefined}
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
    </div>
  )
}

export default Pets

