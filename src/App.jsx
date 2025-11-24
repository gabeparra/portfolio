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
      if (!easterEggState.clickedG) {
        setEasterEggState({ clickedG: true, clickedC: false })
      } else {
        setEasterEggState({ clickedG: false, clickedC: false })
      }
    } else if (step === 'C') {
      if (easterEggState.clickedG && !easterEggState.clickedC) {
        setEasterEggState({ ...easterEggState, clickedC: true })
      } else {
        setEasterEggState({ clickedG: false, clickedC: false })
      }
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
