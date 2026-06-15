import './Contact.css'
import { useState } from 'react'
import emailjs from '@emailjs/browser'

function Contact() {
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
        message: 'Failed to send message. Please try again or email me directly at gabriel@gabrielparra.dev'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page mc">

      <main>
        <section className="section section-dark">
          <div className="container">
            <div className="mc-section-head">
              <span className="mc-section-no">TX</span>
              <h2 className="mc-section-title">OPEN A CHANNEL</h2>
              <span className="mc-section-line"></span>
            </div>
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
                <a href="mailto:gabriel@gabrielparra.dev" className="contact-link">
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
    </div>
  )
}

export default Contact

