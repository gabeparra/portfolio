import './Contact.css'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

function Contact({ onBack, onNavigateToPets, onNavigateToAbout }) {
  const handlePetsClick = (e) => {
    e.preventDefault()
    if (onNavigateToPets) {
      onNavigateToPets()
    }
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    if (onNavigateToAbout) {
      onNavigateToAbout()
    }
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setFormStatus({ type: '', message: '' })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: '', message: '' })

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          title: formData.name
        },
        publicKey
      )

      setFormStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error sending email:', error)
      setFormStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again or email me directly at gabpar49@gmail.com' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
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
            <li><a href="#pets" onClick={handlePetsClick}>Pets</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); }}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="section section-dark">
          <div className="container">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-content">
              <p className="contact-text">
                I'm always interested in new opportunities and collaborations. 
                Feel free to reach out!
              </p>
              
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows="6"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                {formStatus.message && (
                  <div className={`form-status ${formStatus.type}`}>
                    {formStatus.message}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              
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
      </footer>
    </div>
  )
}

export default Contact

