import { useState, useEffect, useRef, useCallback } from 'react'
import './PongGame.css'

const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 10
const BALL_SIZE = 10
const GAME_HEIGHT = 400
const GAME_WIDTH = 600
const PADDLE_SPEED = 5
const INITIAL_BALL_SPEED = 4
const MAX_BALL_SPEED = 12
const MIN_BALL_SPEED = 2

const getGameDimensions = () => {
  const board = document.querySelector('.pong-game-board')
  if (!board) {
    return { 
      width: 600, 
      height: 400, 
      scale: 1, 
      actualGameHeight: GAME_HEIGHT, 
      actualGameWidth: GAME_WIDTH 
    }
  }
  // Read actual rendered size from CSS (which handles aspect-ratio and max-height)
  const rect = board.getBoundingClientRect()
  const scale = rect.width / GAME_WIDTH
  // Calculate actual playable height in game coordinates (accounting for CSS constraints)
  const actualGameHeight = rect.height / scale
  const actualGameWidth = rect.width / scale
  return {
    width: rect.width,
    height: rect.height,
    scale: scale,
    actualGameHeight: actualGameHeight,
    actualGameWidth: actualGameWidth
  }
}

function PongGame() {
  const [gameDimensions, setGameDimensions] = useState(() => {
    const dims = getGameDimensions()
    return dims.actualGameHeight ? dims : { ...dims, actualGameHeight: GAME_HEIGHT, actualGameWidth: GAME_WIDTH }
  })
  const [playerPaddle, setPlayerPaddle] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const [aiPaddle, setAiPaddle] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const [ball, setBall] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  // eslint-disable-next-line no-unused-vars
  const [ballVelocity, setBallVelocity] = useState({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED })
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [aiVsAi, setAiVsAi] = useState(false)
  const keysRef = useRef({ w: false, s: false })
  const gameLoopRef = useRef(null)
  const ballRef = useRef({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  const ballVelRef = useRef({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED })
  const playerPaddleRef = useRef(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const aiPaddleRef = useRef(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const boardRef = useRef(null)
  const isTouchingRef = useRef(false)

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (aiVsAi) {
      if (key === ' ') {
        setIsPaused(prev => !prev)
        e.preventDefault()
      }
      return
    }
    if (key === 'w' || key === 'arrowup') {
      keysRef.current.w = true
      e.preventDefault()
    } else if (key === 's' || key === 'arrowdown') {
      keysRef.current.s = true
      e.preventDefault()
    } else if (key === ' ') {
      setIsPaused(prev => !prev)
      e.preventDefault()
    }
  }, [aiVsAi])

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (key === 'w' || key === 'arrowup') {
      keysRef.current.w = false
    } else if (key === 's' || key === 'arrowdown') {
      keysRef.current.s = false
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  useEffect(() => {
    const handleResize = () => {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        setGameDimensions(getGameDimensions())
      }, 0)
    }
    window.addEventListener('resize', handleResize)
    // Initial update after render
    setTimeout(() => setGameDimensions(getGameDimensions()), 100)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const resetBall = useCallback((servingToPlayer = false) => {
    const newBall = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 }
    const newVel = {
      x: servingToPlayer ? -INITIAL_BALL_SPEED : INITIAL_BALL_SPEED,
      y: (Math.random() - 0.5) * INITIAL_BALL_SPEED
    }
    ballRef.current = newBall
    ballVelRef.current = newVel
    setBall(newBall)
    setBallVelocity(newVel)
  }, [])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    // Use actual visible game dimensions (may be less than GAME_HEIGHT due to CSS constraints)
    const actualHeight = gameDimensions.actualGameHeight || GAME_HEIGHT
    const actualWidth = gameDimensions.actualGameWidth || GAME_WIDTH

    let newPlayerY = playerPaddleRef.current
    if (aiVsAi) {
      const playerCenter = playerPaddleRef.current + PADDLE_HEIGHT / 2
      if (ballRef.current.y < playerCenter - 10) {
        newPlayerY = playerPaddleRef.current - PADDLE_SPEED * 0.8
      } else if (ballRef.current.y > playerCenter + 10) {
        newPlayerY = playerPaddleRef.current + PADDLE_SPEED * 0.8
      }
    } else {
      if (keysRef.current.w) {
        newPlayerY = newPlayerY - PADDLE_SPEED
      }
      if (keysRef.current.s) {
        newPlayerY = newPlayerY + PADDLE_SPEED
      }
    }
    const maxPaddleY = actualHeight - PADDLE_HEIGHT
    newPlayerY = Math.max(0, Math.min(maxPaddleY, Math.round(newPlayerY)))
    if (newPlayerY + PADDLE_HEIGHT > actualHeight) {
      newPlayerY = Math.max(0, actualHeight - PADDLE_HEIGHT)
    }
    playerPaddleRef.current = newPlayerY
    setPlayerPaddle(newPlayerY)

    const aiCenter = aiPaddleRef.current + PADDLE_HEIGHT / 2
    let newAiY = aiPaddleRef.current
    if (ballRef.current.y < aiCenter - 10) {
      newAiY = aiPaddleRef.current - PADDLE_SPEED * 0.8
    } else if (ballRef.current.y > aiCenter + 10) {
      newAiY = aiPaddleRef.current + PADDLE_SPEED * 0.8
    }
    const maxAiPaddleY = actualHeight - PADDLE_HEIGHT
    newAiY = Math.max(0, Math.min(maxAiPaddleY, Math.round(newAiY)))
    if (newAiY + PADDLE_HEIGHT > actualHeight) {
      newAiY = Math.max(0, actualHeight - PADDLE_HEIGHT)
    }
    aiPaddleRef.current = newAiY
    setAiPaddle(newAiY)

    let newX = ballRef.current.x + ballVelRef.current.x
    let newY = ballRef.current.y + ballVelRef.current.y
    let newVelX = ballVelRef.current.x
    let newVelY = ballVelRef.current.y

    const ballTop = newY
    const ballBottom = newY + BALL_SIZE
    const ballLeft = newX
    const ballRight = newX + BALL_SIZE
    const ballCenterY = newY + BALL_SIZE / 2

    if (ballTop < 0) {
      newVelY = Math.abs(newVelY) * 1.05
      newY = 0
      if (newVelY < MIN_BALL_SPEED) {
        newVelY = MIN_BALL_SPEED
      }
      if (newVelY > MAX_BALL_SPEED) {
        newVelY = MAX_BALL_SPEED
      }
    } else if (ballBottom > actualHeight) {
      newVelY = -Math.abs(newVelY) * 1.05
      newY = actualHeight - BALL_SIZE
      if (Math.abs(newVelY) < MIN_BALL_SPEED) {
        newVelY = -MIN_BALL_SPEED
      }
      if (Math.abs(newVelY) > MAX_BALL_SPEED) {
        newVelY = -MAX_BALL_SPEED
      }
    }

    if (newVelX < 0 && ballLeft <= PADDLE_WIDTH) {
      const paddleTop = playerPaddleRef.current
      const paddleBottom = playerPaddleRef.current + PADDLE_HEIGHT
      const paddleLeft = 0
      const paddleRight = PADDLE_WIDTH
      
      if (ballRight >= paddleLeft && ballLeft <= paddleRight && 
          ballBottom >= paddleTop && ballTop <= paddleBottom) {
        const hitPos = (ballCenterY - paddleTop) / PADDLE_HEIGHT
        const speedMultiplier = 1.15
        const currentSpeed = Math.abs(newVelX)
        newVelX = currentSpeed * speedMultiplier
        const baseSpeed = Math.max(currentSpeed, INITIAL_BALL_SPEED)
        newVelY = (hitPos - 0.5) * baseSpeed * 2
        
        if (newVelX > MAX_BALL_SPEED) {
          newVelX = MAX_BALL_SPEED
        }
        if (Math.abs(newVelY) > MAX_BALL_SPEED) {
          newVelY = newVelY > 0 ? MAX_BALL_SPEED : -MAX_BALL_SPEED
        }
        if (Math.abs(newVelY) < MIN_BALL_SPEED) {
          newVelY = newVelY > 0 ? MIN_BALL_SPEED : -MIN_BALL_SPEED
        }
        newX = PADDLE_WIDTH
      } else if (ballLeft < 0) {
        setAiScore(prev => {
          const newScore = prev + 1
          if (newScore >= 10) {
            setGameOver(true)
          }
          return newScore
        })
        resetBall(false)
        return
      }
    }

    if (newVelX > 0 && ballRight >= actualWidth - PADDLE_WIDTH) {
      const paddleTop = aiPaddleRef.current
      const paddleBottom = aiPaddleRef.current + PADDLE_HEIGHT
      const paddleLeft = actualWidth - PADDLE_WIDTH
      const paddleRight = actualWidth
      
      if (ballRight >= paddleLeft && ballLeft <= paddleRight && 
          ballBottom >= paddleTop && ballTop <= paddleBottom) {
        const hitPos = (ballCenterY - paddleTop) / PADDLE_HEIGHT
        const speedMultiplier = 1.15
        const currentSpeed = Math.abs(newVelX)
        newVelX = -currentSpeed * speedMultiplier
        const baseSpeed = Math.max(currentSpeed, INITIAL_BALL_SPEED)
        newVelY = (hitPos - 0.5) * baseSpeed * 2
        
        if (Math.abs(newVelX) > MAX_BALL_SPEED) {
          newVelX = -MAX_BALL_SPEED
        }
        if (Math.abs(newVelY) > MAX_BALL_SPEED) {
          newVelY = newVelY > 0 ? MAX_BALL_SPEED : -MAX_BALL_SPEED
        }
        if (Math.abs(newVelY) < MIN_BALL_SPEED) {
          newVelY = newVelY > 0 ? MIN_BALL_SPEED : -MIN_BALL_SPEED
        }
        newX = actualWidth - PADDLE_WIDTH - BALL_SIZE
      } else if (ballRight > actualWidth) {
        setPlayerScore(prev => {
          const newScore = prev + 1
          if (newScore >= 10) {
            setGameOver(true)
          }
          return newScore
        })
        resetBall(true)
        return
      }
    }

    if (Math.abs(newVelX) < MIN_BALL_SPEED) {
      newVelX = newVelX > 0 ? MIN_BALL_SPEED : -MIN_BALL_SPEED
    }
    if (Math.abs(newVelX) > MAX_BALL_SPEED) {
      newVelX = newVelX > 0 ? MAX_BALL_SPEED : -MAX_BALL_SPEED
    }

    ballRef.current = { x: newX, y: newY }
    ballVelRef.current = { x: newVelX, y: newVelY }
    setBall({ x: newX, y: newY })
    setBallVelocity({ x: newVelX, y: newVelY })
  }, [isPaused, gameOver, resetBall, aiVsAi])

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, 16)
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameLoop, gameOver, isPaused])


  const resetGame = () => {
    const initialPaddle = GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2
    playerPaddleRef.current = initialPaddle
    aiPaddleRef.current = initialPaddle
    setPlayerPaddle(initialPaddle)
    setAiPaddle(initialPaddle)
    resetBall(false)
    setPlayerScore(0)
    setAiScore(0)
    setGameOver(false)
    setIsPaused(false)
  }

  const toggleAiVsAi = () => {
    setAiVsAi(prev => !prev)
    if (!aiVsAi) {
      setIsPaused(false)
      setGameOver(false)
    }
  }

  const handlePaddleMove = (direction) => {
    if (gameOver || isPaused || aiVsAi) return
    keysRef.current[direction] = true
    setTimeout(() => {
      keysRef.current[direction] = false
    }, 50)
  }

  const handleTouchStart = useCallback((e) => {
    if (gameOver || isPaused || aiVsAi || !boardRef.current) return
    
    e.preventDefault()
    isTouchingRef.current = true
    const touch = e.touches[0] || e.changedTouches[0]
    const boardRect = boardRef.current.getBoundingClientRect()
    const touchY = touch.clientY - boardRect.top
    const scaledY = touchY / gameDimensions.scale
    
    // Use actual visible height
    const actualHeight = gameDimensions.actualGameHeight || GAME_HEIGHT
    const maxPaddleY = actualHeight - PADDLE_HEIGHT
    
    // Move paddle to touch position (centered on paddle)
    const newPaddleY = Math.max(0, Math.min(maxPaddleY, scaledY - PADDLE_HEIGHT / 2))
    playerPaddleRef.current = newPaddleY
    setPlayerPaddle(newPaddleY)
  }, [gameOver, isPaused, aiVsAi, gameDimensions])

  const handleTouchMove = useCallback((e) => {
    if (!isTouchingRef.current || gameOver || isPaused || aiVsAi || !boardRef.current) return
    
    e.preventDefault()
    const touch = e.touches[0] || e.changedTouches[0]
    const boardRect = boardRef.current.getBoundingClientRect()
    const touchY = touch.clientY - boardRect.top
    const scaledY = touchY / gameDimensions.scale
    
    // Use actual visible height
    const actualHeight = gameDimensions.actualGameHeight || GAME_HEIGHT
    const maxPaddleY = actualHeight - PADDLE_HEIGHT
    
    // Move paddle to touch position (centered on paddle)
    const newPaddleY = Math.max(0, Math.min(maxPaddleY, scaledY - PADDLE_HEIGHT / 2))
    playerPaddleRef.current = newPaddleY
    setPlayerPaddle(newPaddleY)
  }, [gameOver, isPaused, aiVsAi, gameDimensions])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    isTouchingRef.current = false
  }, [])

  const handlePause = () => {
    if (gameOver) return
    setIsPaused(prev => !prev)
  }

  return (
    <div className="pong-game-container">
      <div className="pong-header">
        <div className="score-display">
          <div className="player-score">{aiVsAi ? 'AI 1' : 'Player'}: {playerScore}</div>
          <div className="ai-score">AI {aiVsAi ? '2' : ''}: {aiScore}</div>
        </div>
        {aiVsAi && <div className="ai-vs-ai-mode">AI vs AI MODE</div>}
        {isPaused && <div className="paused">PAUSED</div>}
        {gameOver && (
          <div className="game-over">
            {aiVsAi 
              ? (playerScore >= 10 ? 'AI 1 WINS!' : 'AI 2 WINS!')
              : (playerScore >= 10 ? 'YOU WIN!' : 'AI WINS!')
            }
          </div>
        )}
      </div>

      <div 
        ref={boardRef}
        className="pong-game-board" 
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
        }}
      >
        <div
          className="paddle player-paddle"
          style={{
            left: '0px',
            top: `${playerPaddle * gameDimensions.scale}px`,
            width: `${PADDLE_WIDTH * gameDimensions.scale}px`,
            height: `${PADDLE_HEIGHT * gameDimensions.scale}px`
          }}
        />
        <div
          className="paddle ai-paddle"
          style={{
            right: '0px',
            top: `${aiPaddle * gameDimensions.scale}px`,
            width: `${PADDLE_WIDTH * gameDimensions.scale}px`,
            height: `${PADDLE_HEIGHT * gameDimensions.scale}px`
          }}
        />
        <div
          className="ball"
          style={{
            left: `${ball.x * gameDimensions.scale}px`,
            top: `${ball.y * gameDimensions.scale}px`,
            width: `${BALL_SIZE * gameDimensions.scale}px`,
            height: `${BALL_SIZE * gameDimensions.scale}px`
          }}
        />
        <div className="center-line" />
      </div>

      <div className="pong-controls">
        <button 
          onClick={toggleAiVsAi} 
          className={`ai-vs-ai-button ${aiVsAi ? 'active' : ''}`}
        >
          {aiVsAi ? 'Exit AI vs AI' : 'AI vs AI'}
        </button>
        {!aiVsAi && (
          <button 
            className="control-button" 
            onClick={handlePause}
            aria-label="Pause"
          >
            ⏸ Pause
          </button>
        )}
        <button onClick={resetGame} className="reset-button">
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
      </div>
    </div>
  )
}

export default PongGame

