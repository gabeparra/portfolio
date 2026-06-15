import { useState, useCallback, useRef, useEffect } from 'react'
import Portfolio from './portfolio/Portfolio'
import RetroPage from './minigames/RetroPage'
import About from './portfolio/About'
import Contact from './portfolio/Contact'
import Pets from './portfolio/Pets'
import Starfield from './components/Starfield'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

const TRANSITION_MS = 260

function App() {
  const [showRetro, setShowRetro] = useState(false)
  const [shownView, setShownView] = useState('home')
  const [leaving, setLeaving] = useState(false)
  const [easterEggState, setEasterEggState] = useState({ clickedG: false, clickedC: false })
  const [menuOpen, setMenuOpen] = useState(false)
  const navLock = useRef(false)

  const toggleRetro = useCallback(() => setShowRetro(prev => !prev), [])
  useKonamiCode(toggleRetro)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const navigate = useCallback((next, anchor = null) => {
    setMenuOpen(false)
    if (navLock.current) return
    if (next === shownView) {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navLock.current = true
    setLeaving(true)
    setTimeout(() => {
      setShownView(next)
      setLeaving(false)
      window.scrollTo({ top: 0 })
      navLock.current = false
      if (anchor) {
        requestAnimationFrame(() => {
          setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 60)
        })
      }
    }, TRANSITION_MS)
  }, [shownView])

  const goHome = (e) => { e && e.preventDefault(); navigate('home') }
  const goAbout = (e) => { e && e.preventDefault(); navigate('about') }
  const goPets = (e) => { e && e.preventDefault(); navigate('pets') }
  const goContact = (e) => { e && e.preventDefault(); navigate('contact') }
  const goAnchor = (anchor) => (e) => { e && e.preventDefault(); navigate('home', anchor) }

  const handleEasterEggProgress = (step) => {
    if (step === 'G') {
      setEasterEggState(prev => prev.clickedG ? { clickedG: false, clickedC: false } : { clickedG: true, clickedC: false })
    } else if (step === 'C') {
      setEasterEggState(prev => (prev.clickedG && !prev.clickedC) ? { ...prev, clickedC: true } : { clickedG: false, clickedC: false })
    } else if (step === 'MOBILE') {
      setEasterEggState({ clickedG: true, clickedC: true })
    }
  }

  const handleGClick = (e) => { e.preventDefault(); e.stopPropagation(); handleEasterEggProgress('G') }
  const handleMobileGamesClick = (e) => { e.preventDefault(); e.stopPropagation(); handleEasterEggProgress('MOBILE') }

  if (showRetro) {
    return (
      <>
        <button className="secret-button" onClick={toggleRetro}>×</button>
        <RetroPage />
      </>
    )
  }

  const showSecretButton = easterEggState.clickedG && easterEggState.clickedC

  return (
    <>
      <Starfield />
      {showSecretButton && (
        <button className="secret-button" onClick={toggleRetro} title="Easter Egg">🎈</button>
      )}

      <header className="mc-header">
        <nav className="mc-nav">
          <div className="mc-brand">
            <span className="mc-brand-sigil" onClick={handleGClick} onTouchStart={handleGClick}>G</span>
            <span className="mc-brand-name" onClick={goHome} style={{ cursor: 'pointer' }}>PARRA</span>
            <span className="mc-brand-tag">// MISSION CONTROL</span>
          </div>
          <button
            type="button"
            className={`mc-menu-toggle${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mc-primary-nav"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span></span><span></span><span></span>
          </button>
          <ul id="mc-primary-nav" className={`mc-links${menuOpen ? ' open' : ''}`}>
            <li><a href="#about" onClick={goAbout} className={shownView === 'about' ? 'mc-link-active' : ''}>Crew File</a></li>
            <li><a href="#systems" onClick={goAnchor('systems')}>Systems</a></li>
            <li><a href="#missions" onClick={goAnchor('missions')}>Missions</a></li>
            <li><a href="#pets" onClick={goPets} className={shownView === 'pets' ? 'mc-link-active' : ''}>Companions</a></li>
            <li><a href="#contact" onClick={goContact} className="mc-link-cta">Open a Channel</a></li>
          </ul>
        </nav>
      </header>

      <div className={`mc-view${leaving ? ' leaving' : ''}`} key={shownView}>
        {shownView === 'home' && (
          <Portfolio onEasterEggClick={handleEasterEggProgress} onNavigateToAbout={goAbout} onNavigateToContact={goContact} onNavigateToPets={goPets} />
        )}
        {shownView === 'about' && <About />}
        {shownView === 'contact' && <Contact />}
        {shownView === 'pets' && <Pets />}
      </div>

      <div className={`warp-line${leaving ? ' active' : ''}`} aria-hidden="true"></div>

      <footer className="mc-footer">
        <p className="mc-footer-line">TRANSMISSION ENDS — © 2026 GABRIEL PARRA</p>
        <p className="mc-footer-alien" title="they are out there">👽</p>
        <button
          type="button"
          className="mobile-games-link"
          onClick={handleMobileGamesClick}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileGamesClick(e) }}
        >
          🎮
        </button>
      </footer>
    </>
  )
}

export default App
