import { useState, useCallback, useEffect } from 'react'
import Site from './site/Site'
import RetroPage from './minigames/RetroPage'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

function App() {
  const [showRetro, setShowRetro] = useState(false)
  const toggleRetro = useCallback(() => setShowRetro((v) => !v), [])
  useKonamiCode(toggleRetro)

  useEffect(() => {
    document.body.classList.add('site-body')
    return () => document.body.classList.remove('site-body')
  }, [])

  if (showRetro) {
    return (
      <>
        <button className="secret-button" onClick={toggleRetro}>×</button>
        <RetroPage />
      </>
    )
  }

  return <Site onArcade={toggleRetro} />
}

export default App
