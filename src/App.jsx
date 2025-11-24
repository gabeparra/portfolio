import { useState } from 'react'
import Portfolio from './Portfolio'
import RetroPage from './RetroPage'
import './App.css'

function App() {
  const [showRetro, setShowRetro] = useState(false)

  const toggleRetro = () => {
    setShowRetro(!showRetro)
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

  return (
    <>
      <button className="secret-button" onClick={toggleRetro} title="Easter Egg">
        🎈
      </button>
      <Portfolio />
    </>
  )
}

export default App
