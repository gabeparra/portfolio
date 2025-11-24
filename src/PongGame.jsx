import { useState, useEffect, useRef, useCallback } from 'react'
import './PongGame.css'

const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 10
const BALL_SIZE = 10
const GAME_HEIGHT = 400
const GAME_WIDTH = 600
const PADDLE_SPEED = 5
const INITIAL_BALL_SPEED = 4

function PongGame() {
  const [playerPaddle, setPlayerPaddle] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const [aiPaddle, setAiPaddle] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const [ball, setBall] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  // eslint-disable-next-line no-unused-vars
  const [ballVelocity, setBallVelocity] = useState({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED })
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const keysRef = useRef({ w: false, s: false })
  const gameLoopRef = useRef(null)
  const ballRef = useRef({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  const ballVelRef = useRef({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED })
  const playerPaddleRef = useRef(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const aiPaddleRef = useRef(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase()
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
  }, [])

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

    let newPlayerY = playerPaddleRef.current
    if (keysRef.current.w && newPlayerY > 0) {
      newPlayerY = Math.max(0, newPlayerY - PADDLE_SPEED)
    }
    if (keysRef.current.s && newPlayerY < GAME_HEIGHT - PADDLE_HEIGHT) {
      newPlayerY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPlayerY + PADDLE_SPEED)
    }
    playerPaddleRef.current = newPlayerY
    setPlayerPaddle(newPlayerY)

    const aiCenter = aiPaddleRef.current + PADDLE_HEIGHT / 2
    let newAiY = aiPaddleRef.current
    if (ballRef.current.y < aiCenter - 10) {
      newAiY = Math.max(0, aiPaddleRef.current - PADDLE_SPEED * 0.8)
    } else if (ballRef.current.y > aiCenter + 10) {
      newAiY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, aiPaddleRef.current + PADDLE_SPEED * 0.8)
    }
    aiPaddleRef.current = newAiY
    setAiPaddle(newAiY)

    let newX = ballRef.current.x + ballVelRef.current.x
    let newY = ballRef.current.y + ballVelRef.current.y
    let newVelX = ballVelRef.current.x
    let newVelY = ballVelRef.current.y

    if (newY <= 0 || newY >= GAME_HEIGHT - BALL_SIZE) {
      newVelY = -newVelY
      newY = Math.max(0, Math.min(GAME_HEIGHT - BALL_SIZE, newY))
    }

    if (newX <= PADDLE_WIDTH && newVelX < 0) {
      const paddleTop = playerPaddleRef.current
      const paddleBottom = playerPaddleRef.current + PADDLE_HEIGHT
      const ballCenterY = newY + BALL_SIZE / 2
      
      if (ballCenterY >= paddleTop && ballCenterY <= paddleBottom) {
        newVelX = Math.abs(newVelX) * 1.1
        const hitPos = (ballCenterY - paddleTop) / PADDLE_HEIGHT
        newVelY = (hitPos - 0.5) * INITIAL_BALL_SPEED * 2
        newX = PADDLE_WIDTH
      } else if (newX < 0) {
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

    if (newX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && newVelX > 0) {
      const paddleTop = aiPaddleRef.current
      const paddleBottom = aiPaddleRef.current + PADDLE_HEIGHT
      const ballCenterY = newY + BALL_SIZE / 2
      
      if (ballCenterY >= paddleTop && ballCenterY <= paddleBottom) {
        newVelX = -Math.abs(newVelX) * 1.1
        const hitPos = (ballCenterY - paddleTop) / PADDLE_HEIGHT
        newVelY = (hitPos - 0.5) * INITIAL_BALL_SPEED * 2
        newX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE
      } else if (newX > GAME_WIDTH - BALL_SIZE) {
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

    ballRef.current = { x: newX, y: newY }
    ballVelRef.current = { x: newVelX, y: newVelY }
    setBall({ x: newX, y: newY })
    setBallVelocity({ x: newVelX, y: newVelY })
  }, [isPaused, gameOver, resetBall])

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

  return (
    <div className="pong-game-container">
      <div className="pong-header">
        <div className="score-display">
          <div className="player-score">Player: {playerScore}</div>
          <div className="ai-score">AI: {aiScore}</div>
        </div>
        {isPaused && <div className="paused">PAUSED</div>}
        {gameOver && (
          <div className="game-over">
            {playerScore >= 10 ? 'YOU WIN!' : 'AI WINS!'}
          </div>
        )}
      </div>

      <div className="pong-game-board" tabIndex={0}>
        <div
          className="paddle player-paddle"
          style={{
            left: '0px',
            top: `${playerPaddle}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`
          }}
        />
        <div
          className="paddle ai-paddle"
          style={{
            right: '0px',
            top: `${aiPaddle}px`,
            width: `${PADDLE_WIDTH}px`,
            height: `${PADDLE_HEIGHT}px`
          }}
        />
        <div
          className="ball"
          style={{
            left: `${ball.x}px`,
            top: `${ball.y}px`,
            width: `${BALL_SIZE}px`,
            height: `${BALL_SIZE}px`
          }}
        />
        <div className="center-line" />
      </div>

      <div className="pong-controls">
        <button onClick={resetGame} className="reset-button">
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
        <div className="instructions">
          <p>Use W/S or Arrow Keys to move paddle</p>
          <p>Press Space to pause</p>
          <p>First to 10 points wins!</p>
        </div>
      </div>
    </div>
  )
}

export default PongGame

