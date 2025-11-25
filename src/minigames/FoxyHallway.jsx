import { useState, useEffect, useRef } from 'react'
import './FoxyHallway.css'

const FOXY_START_DISTANCE = 100
const FOXY_ATTACK_DISTANCE = 20
const FOXY_MOVE_SPEED = 0.5
const FLASH_COOLDOWN = 100
const FLASH_DURATION = 200

function FoxyHallway() {
  const [foxyDistance, setFoxyDistance] = useState(FOXY_START_DISTANCE)
  const [isFlashing, setIsFlashing] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeSurvived, setTimeSurvived] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef(null)
  const lastFlashTimeRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    if (gameOver || isPaused) return

    const gameLoop = () => {
      timeRef.current += 16
      setTimeSurvived(Math.floor(timeRef.current / 1000))

      if (!isFlashing && foxyDistance > FOXY_ATTACK_DISTANCE) {
        setFoxyDistance(prev => {
          const newDistance = prev - FOXY_MOVE_SPEED
          if (newDistance <= FOXY_ATTACK_DISTANCE) {
            setGameOver(true)
            return FOXY_ATTACK_DISTANCE
          }
          return newDistance
        })
      } else if (isFlashing) {
        setFoxyDistance(prev => {
          const newDistance = prev + 2
          if (newDistance > FOXY_START_DISTANCE) {
            setScore(prev => prev + 1)
            return FOXY_START_DISTANCE
          }
          return newDistance
        })
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [foxyDistance, isFlashing, gameOver, isPaused])

  const handleFlash = () => {
    const now = Date.now()
    if (now - lastFlashTimeRef.current < FLASH_COOLDOWN) return

    lastFlashTimeRef.current = now
    setIsFlashing(true)

    setTimeout(() => {
      setIsFlashing(false)
    }, FLASH_DURATION)
  }

  const handleRestart = () => {
    setFoxyDistance(FOXY_START_DISTANCE)
    setIsFlashing(false)
    setGameOver(false)
    setScore(0)
    setTimeSurvived(0)
    timeRef.current = 0
    setIsPaused(false)
  }

  const foxySize = Math.max(30, 200 - foxyDistance * 1.5)
  const hallwayOpacity = Math.max(0.1, 1 - (FOXY_START_DISTANCE - foxyDistance) / FOXY_START_DISTANCE)
  const foxyOpacity = Math.min(1, (FOXY_START_DISTANCE - foxyDistance) / 50)

  return (
    <div className="foxy-hallway-container">
      <div className="foxy-game-header">
        <div className="foxy-stats">
          <div className="stat">Time: {timeSurvived}s</div>
          <div className="stat">Score: {score}</div>
          <div className="stat">Distance: {Math.floor(foxyDistance)}</div>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)} 
          className="pause-button"
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      </div>

      <div className="hallway-view">
        <div 
          className="hallway" 
          style={{ opacity: hallwayOpacity }}
        >
          <div className="hallway-lines">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="hallway-line" style={{ left: `${i * 10}%` }} />
            ))}
          </div>
        </div>

        <div 
          className="foxy-character"
          style={{
            transform: `translateX(-50%) translateY(-50%) scale(${foxySize / 100})`,
            opacity: foxyOpacity,
            filter: foxyDistance < 40 ? 'brightness(1.5)' : 'brightness(0.3)'
          }}
        >
          🦊
        </div>

        {isFlashing && (
          <div className="flashlight-flash" />
        )}

        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>GAME OVER</h2>
              <p>Foxy got you!</p>
              <p>Time Survived: {timeSurvived}s</p>
              <p>Score: {score}</p>
              <button onClick={handleRestart} className="restart-button">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flashlight-controls">
        <button
          className={`flashlight-button ${isFlashing ? 'active' : ''}`}
          onMouseDown={handleFlash}
          onTouchStart={(e) => {
            e.preventDefault()
            handleFlash()
          }}
          disabled={gameOver || isPaused}
        >
          🔦 FLASH
        </button>
        <p className="flashlight-hint">Click/Hold to flash and keep Foxy away!</p>
      </div>
    </div>
  )
}

export default FoxyHallway

