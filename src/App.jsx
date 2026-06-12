import { useState, useCallback } from 'react'
import Portfolio from './portfolio/Portfolio'
import RetroPage from './minigames/RetroPage'
import About from './portfolio/About'
import Contact from './portfolio/Contact'
import Pets from './portfolio/Pets'
import Starfield from './components/Starfield'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

function App() {
  const [showRetro, setShowRetro] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showPets, setShowPets] = useState(false)
  const [easterEggState, setEasterEggState] = useState({ clickedG: false, clickedC: false })

  const toggleRetro = useCallback(() => {
    setShowRetro(prev => !prev)
  }, [])

  // Activate RetroPage on Konami code
  useKonamiCode(toggleRetro)

  const toggleAbout = () => setShowAbout(!showAbout)
  const toggleContact = () => setShowContact(!showContact)
  const togglePets = () => setShowPets(!showPets)

  const handleEasterEggProgress = (step) => {
    if (step === 'G') {
      setEasterEggState(prev => prev.clickedG ? { clickedG: false, clickedC: false } : { clickedG: true, clickedC: false })
    } else if (step === 'C') {
      setEasterEggState(prev => (prev.clickedG && !prev.clickedC) ? { ...prev, clickedC: true } : { clickedG: false, clickedC: false })
    } else if (step === 'MOBILE') {
      setEasterEggState({ clickedG: true, clickedC: true })
    }
  }

  if (showRetro) {
    return (
      <>
        <button className="secret-button" onClick={toggleRetro}>×</button>
        <RetroPage />
      </>
    )
  }

  if (showAbout) {
    return <><Starfield /><About onBack={toggleAbout} onNavigateToAbout={toggleAbout} onNavigateToPets={togglePets} onNavigateToContact={toggleContact} /></>
  }

  if (showContact) {
    return <><Starfield /><Contact onBack={toggleContact} onNavigateToAbout={toggleAbout} onNavigateToPets={togglePets} onNavigateToContact={toggleContact} /></>
  }

  if (showPets) {
    return <><Starfield /><Pets onBack={togglePets} onNavigateToAbout={toggleAbout} onNavigateToPets={togglePets} onNavigateToContact={toggleContact} /></>
  }

  const showSecretButton = easterEggState.clickedG && easterEggState.clickedC

  return (
    <>
      <Starfield />
      {showSecretButton && (
        <button className="secret-button" onClick={toggleRetro} title="Easter Egg">🎈</button>
      )}
      <Portfolio onEasterEggClick={handleEasterEggProgress} onNavigateToAbout={toggleAbout} onNavigateToContact={toggleContact} onNavigateToPets={togglePets} />
    </>
  )
}

export default App
