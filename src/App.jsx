import { useState, useCallback } from 'react'
import Site from './site/Site'
import RetroPage from './minigames/RetroPage'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

function App() {
  const [showRetro, setShowRetro] = useState(false)
  const toggleRetro = useCallback(() => setShowRetro((v) => !v), [])

  // Kept off the primary hire-me path; Konami still opens arcade for fun.
  useKonamiCode(toggleRetro)

  if (showRetro) {
    return (
      <>
        <button type="button" className="secret-button" onClick={toggleRetro} aria-label="Close arcade">
          ×
        </button>
        <RetroPage />
      </>
    )
  }

  return <Site />
}

export default App
