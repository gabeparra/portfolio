import { useState, useEffect, useRef, useCallback } from 'react'
import './Breakout.css'

const BOARD_WIDTH = 600
const BOARD_HEIGHT = 400
const PADDLE_WIDTH = 100
const PADDLE_HEIGHT = 10
const BALL_SIZE = 10
const BRICK_ROWS = 5
const BRICK_COLS = 10
const BRICK_WIDTH = 55
const BRICK_HEIGHT = 20
const BRICK_GAP = 5

function Breakout() {
  const [paddleX, setPaddleX] = useState(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2)
  const [ball, setBall] = useState({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT - 50 })
  const [ballVelocity, setBallVelocity] = useState({ x: 3, y: -3 })
  const [bricks, setBricks] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef(null)
  const keysRef = useRef({ left: false, right: false })

  const initializeBricks = () => {
    const newBricks = []
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#3498db']
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + BRICK_GAP) + BRICK_GAP,
          y: row * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP + 50,
          color: colors[row],
          destroyed: false
        })
      }
    }
    return newBricks
  }

  useEffect(() => {
    setBricks(initializeBricks())
  }, [])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver || gameWon) return

    setPaddleX(prev => {
      let newX = prev
      if (keysRef.current.left && newX > 0) {
        newX = Math.max(0, newX - 5)
      }
      if (keysRef.current.right && newX < BOARD_WIDTH - PADDLE_WIDTH) {
        newX = Math.min(BOARD_WIDTH - PADDLE_WIDTH, newX + 5)
      }
      return newX
    })

    setBall(prevBall => {
      let newX = prevBall.x + ballVelocity.x
      let newY = prevBall.y + ballVelocity.y
      let newVelX = ballVelocity.x
      let newVelY = ballVelocity.y

      if (newX <= 0 || newX >= BOARD_WIDTH - BALL_SIZE) {
        newVelX = -newVelX
        newX = Math.max(0, Math.min(BOARD_WIDTH - BALL_SIZE, newX))
      }

      if (newY <= 0) {
        newVelY = -newVelY
        newY = 0
      }

      if (newY >= BOARD_HEIGHT - BALL_SIZE - PADDLE_HEIGHT) {
        if (newX >= paddleX && newX <= paddleX + PADDLE_WIDTH) {
          newVelY = -Math.abs(newVelY)
          const hitPos = (newX - paddleX) / PADDLE_WIDTH
          newVelX = (hitPos - 0.5) * 6
          newY = BOARD_HEIGHT - BALL_SIZE - PADDLE_HEIGHT
        } else if (newY >= BOARD_HEIGHT - BALL_SIZE) {
          setGameOver(true)
        }
      }

      setBricks(prevBricks => {
        const updatedBricks = prevBricks.map(brick => {
          if (brick.destroyed) return brick
          if (newX < brick.x + BRICK_WIDTH && newX + BALL_SIZE > brick.x &&
              newY < brick.y + BRICK_HEIGHT && newY + BALL_SIZE > brick.y) {
            newVelY = -newVelY
            setScore(prev => prev + 10)
            return { ...brick, destroyed: true }
          }
          return brick
        })
        if (updatedBricks.every(b => b.destroyed)) {
          setGameWon(true)
        }
        return updatedBricks
      })

      setBallVelocity({ x: newVelX, y: newVelY })
      return { x: newX, y: newY }
    })
  }, [paddleX, ballVelocity, isPaused, gameOver, gameWon])

  useEffect(() => {
    if (!gameOver && !gameWon && !isPaused) {
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
  }, [gameLoop, gameOver, gameWon, isPaused])

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (key === 'arrowleft' || key === 'a') {
      keysRef.current.left = true
      e.preventDefault()
    } else if (key === 'arrowright' || key === 'd') {
      keysRef.current.right = true
      e.preventDefault()
    } else if (key === ' ') {
      setIsPaused(prev => !prev)
      e.preventDefault()
    }
  }, [])

  const handleKeyUp = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (key === 'arrowleft' || key === 'a') {
      keysRef.current.left = false
    } else if (key === 'arrowright' || key === 'd') {
      keysRef.current.right = false
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

  const handlePaddleMove = (direction) => {
    if (gameOver || gameWon || isPaused) return
    keysRef.current[direction] = true
    setTimeout(() => {
      keysRef.current[direction] = false
    }, 50)
  }

  const handlePause = () => {
    if (gameOver || gameWon) return
    setIsPaused(prev => !prev)
  }

  const resetGame = () => {
    setPaddleX(BOARD_WIDTH / 2 - PADDLE_WIDTH / 2)
    setBall({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT - 50 })
    setBallVelocity({ x: 3, y: -3 })
    setBricks(initializeBricks())
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setIsPaused(false)
  }

  return (
    <div className="breakout-container">
      <div className="breakout-header">
        <div className="score">Score: {score}</div>
        {isPaused && <div className="paused">PAUSED</div>}
        {gameWon && <div className="won">YOU WIN!</div>}
        {gameOver && <div className="game-over">GAME OVER</div>}
      </div>
      
      <div className="breakout-board">
        {bricks.map((brick, index) => (
          !brick.destroyed && (
            <div
              key={index}
              className="brick"
              style={{
                left: `${brick.x}px`,
                top: `${brick.y}px`,
                width: `${BRICK_WIDTH}px`,
                height: `${BRICK_HEIGHT}px`,
                backgroundColor: brick.color
              }}
            />
          )
        ))}
        <div
          className="paddle"
          style={{
            left: `${paddleX}px`,
            top: `${BOARD_HEIGHT - PADDLE_HEIGHT}px`,
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
      </div>

      <div className="breakout-controls">
        <div className="mobile-controls">
          <button 
            className="control-button" 
            onTouchStart={() => handlePaddleMove('left')}
            onMouseDown={() => handlePaddleMove('left')}
            aria-label="Move paddle left"
          >
            ← Left
          </button>
          <button 
            className="control-button" 
            onClick={handlePause}
            aria-label="Pause"
          >
            ⏸ Pause
          </button>
          <button 
            className="control-button" 
            onTouchStart={() => handlePaddleMove('right')}
            onMouseDown={() => handlePaddleMove('right')}
            aria-label="Move paddle right"
          >
            Right →
          </button>
        </div>
        <button onClick={resetGame} className="reset-button">
          {gameOver || gameWon ? 'Play Again' : 'Reset'}
        </button>
        <div className="instructions">
          <p>Use Arrow Keys or A/D to move paddle</p>
          <p>Press Space to pause</p>
          <p className="mobile-instruction">Or use the on-screen controls</p>
          <p>Break all bricks to win!</p>
        </div>
      </div>
    </div>
  )
}

export default Breakout

