import { useState } from 'react'
import Portfolio from './Portfolio'
import RetroPage from './RetroPage'
import About from './About'
import './App.css'

function App() {
  const [showRetro, setShowRetro] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [easterEggState, setEasterEggState] = useState({ clickedG: false, clickedC: false })

  const toggleRetro = () => {
    setShowRetro(!showRetro)
  }

  const toggleAbout = () => {
    setShowAbout(!showAbout)
  }

  const handleEasterEggProgress = (step) => {
    if (step === 'G') {
      setEasterEggState(prev => {
        if (!prev.clickedG) {
          return { clickedG: true, clickedC: false }
        } else {
          return { clickedG: false, clickedC: false }
        }
      })
    } else if (step === 'C') {
      setEasterEggState(prev => {
        if (prev.clickedG && !prev.clickedC) {
          return { ...prev, clickedC: true }
        } else {
          return { clickedG: false, clickedC: false }
        }
      })
    } else if (step === 'MOBILE') {
      setEasterEggState({ clickedG: true, clickedC: true })
    }
  }

  if (showRetro) {
    return (
      <>
        <button className="secret-button" onClick={toggleRetro}>
          ×
        </button>
        <RetroPage />
      </>
    )
  }

  if (showAbout) {
    return <About onBack={toggleAbout} />
  }

  const showSecretButton = easterEggState.clickedG && easterEggState.clickedC

  return (
    <>
      {showSecretButton && (
        <button className="secret-button" onClick={toggleRetro} title="Easter Egg">
          🎈
        </button>
      )}
      <Portfolio onEasterEggClick={handleEasterEggProgress} onNavigateToAbout={toggleAbout} />
    </>
  )
}

export default App
