import { useState, useEffect, useRef, useCallback } from 'react'
import './PongGame.css'

const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 10
const BALL_SIZE = 10
const GAME_HEIGHT = 400
const GAME_WIDTH = 600
const PADDLE_SPEED = 5
const AI_PADDLE_SPEED = 20
const INITIAL_BALL_SPEED = 4
const MAX_BALL_SPEED = 60
const MIN_BALL_SPEED = 2
const BALL_SPEED_INCREASE_INTERVAL = 2000
const BALL_SPEED_INCREASE_AMOUNT = 1

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
  const gameStartTimeRef = useRef(0)
  const lastSpeedIncreaseRef = useRef(0)

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
    lastSpeedIncreaseRef.current = Date.now()
  }, [])

  const checkSweptCollision = useCallback((ballX, ballY, velX, velY, paddleX, paddleY, paddleWidth, paddleHeight, ballSize) => {
    const oldBallX = ballX - velX
    const oldBallY = ballY - velY
    
    const ballMinX = Math.min(oldBallX, ballX)
    const ballMaxX = Math.max(oldBallX + ballSize, ballX + ballSize)
    const ballMinY = Math.min(oldBallY, ballY)
    const ballMaxY = Math.max(oldBallY + ballSize, ballY + ballSize)
    
    const paddleMinX = paddleX
    const paddleMaxX = paddleX + paddleWidth
    const paddleMinY = paddleY
    const paddleMaxY = paddleY + paddleHeight
    
    if (ballMaxX < paddleMinX || ballMinX > paddleMaxX ||
        ballMaxY < paddleMinY || ballMinY > paddleMaxY) {
      return null
    }
    
    if (Math.abs(velX) < 0.001) {
      return null
    }
    
    const tEnterX = (paddleMinX - (oldBallX + ballSize)) / velX
    const tExitX = (paddleMaxX - oldBallX) / velX
    const tMinX = Math.min(tEnterX, tExitX)
    const tMaxX = Math.max(tEnterX, tExitX)
    
    const tEnterY = velY === 0 ? -Infinity : (paddleMinY - (oldBallY + ballSize)) / velY
    const tExitY = velY === 0 ? Infinity : (paddleMaxY - oldBallY) / velY
    const tMinY = Math.min(tEnterY, tExitY)
    const tMaxY = Math.max(tEnterY, tExitY)
    
    const tEnter = Math.max(tMinX, tMinY)
    const tExit = Math.min(tMaxX, tMaxY)
    
    if (tEnter <= tExit && tEnter >= 0 && tEnter <= 1) {
      const collisionX = oldBallX + velX * tEnter
      const collisionY = oldBallY + velY * tEnter
      return { t: tEnter, x: collisionX, y: collisionY }
    }
    
    return null
  }, [])

  const predictBallY = useCallback((ballX, ballY, velX, velY, targetX, actualHeight) => {
    if (velX === 0 || Math.abs(velX) < 0.1) return ballY
    
    const isMovingTowardTarget = (velX > 0 && targetX > ballX) || (velX < 0 && targetX < ballX)
    if (!isMovingTowardTarget) {
      return ballY
    }
    
    let currentY = ballY
    let currentVelY = velY
    const stepSize = Math.abs(velX)
    const totalDistance = Math.abs(targetX - ballX)
    let distanceTraveled = 0
    
    while (distanceTraveled < totalDistance) {
      const remainingDistance = totalDistance - distanceTraveled
      const stepDistance = Math.min(stepSize, remainingDistance)
      
      currentY += currentVelY
      distanceTraveled += stepDistance
      
      if (currentY < 0) {
        currentY = -currentY
        currentVelY = -currentVelY
      } else if (currentY + BALL_SIZE > actualHeight) {
        currentY = 2 * actualHeight - currentY - 2 * BALL_SIZE
        currentVelY = -currentVelY
      }
      
      if (distanceTraveled >= totalDistance) break
    }
    
    return currentY
  }, [])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    // Gradually increase ball speed over time
    const now = Date.now()
    if (now - lastSpeedIncreaseRef.current >= BALL_SPEED_INCREASE_INTERVAL) {
      const currentSpeedX = Math.abs(ballVelRef.current.x)
      const currentSpeedY = Math.abs(ballVelRef.current.y)
      
      if (currentSpeedX < MAX_BALL_SPEED) {
        const newSpeedX = Math.min(MAX_BALL_SPEED, currentSpeedX + BALL_SPEED_INCREASE_AMOUNT)
        ballVelRef.current.x = ballVelRef.current.x > 0 ? newSpeedX : -newSpeedX
      }
      
      if (currentSpeedY < MAX_BALL_SPEED) {
        const newSpeedY = Math.min(MAX_BALL_SPEED, currentSpeedY + BALL_SPEED_INCREASE_AMOUNT)
        ballVelRef.current.y = ballVelRef.current.y > 0 ? newSpeedY : -newSpeedY
      }
      
      setBallVelocity({ x: ballVelRef.current.x, y: ballVelRef.current.y })
      lastSpeedIncreaseRef.current = now
    }

    // Use actual visible game dimensions (may be less than GAME_HEIGHT due to CSS constraints)
    const actualHeight = gameDimensions.actualGameHeight || GAME_HEIGHT
    const actualWidth = gameDimensions.actualGameWidth || GAME_WIDTH

    let newPlayerY = playerPaddleRef.current
    if (aiVsAi) {
      const targetX = PADDLE_WIDTH
      const predictedY = predictBallY(
        ballRef.current.x,
        ballRef.current.y,
        ballVelRef.current.x,
        ballVelRef.current.y,
        targetX,
        actualHeight
      )
      const targetPaddleY = predictedY - PADDLE_HEIGHT / 2
      const currentPaddleY = playerPaddleRef.current
      const diff = targetPaddleY - currentPaddleY
      const moveDistance = Math.min(Math.abs(diff), AI_PADDLE_SPEED)
      newPlayerY = currentPaddleY + (diff > 0 ? moveDistance : -moveDistance)
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

    const aiTargetX = actualWidth - PADDLE_WIDTH
    const aiPredictedY = predictBallY(
      ballRef.current.x,
      ballRef.current.y,
      ballVelRef.current.x,
      ballVelRef.current.y,
      aiTargetX,
      actualHeight
    )
    const aiTargetPaddleY = aiPredictedY - PADDLE_HEIGHT / 2
    const currentAiPaddleY = aiPaddleRef.current
    const aiDiff = aiTargetPaddleY - currentAiPaddleY
    const aiMoveDistance = Math.min(Math.abs(aiDiff), AI_PADDLE_SPEED)
    const newAiY = Math.max(0, Math.min(actualHeight - PADDLE_HEIGHT, Math.round(currentAiPaddleY + (aiDiff > 0 ? aiMoveDistance : -aiMoveDistance))))
    if (newAiY + PADDLE_HEIGHT > actualHeight) {
      aiPaddleRef.current = Math.max(0, actualHeight - PADDLE_HEIGHT)
    } else {
      aiPaddleRef.current = newAiY
    }
    setAiPaddle(aiPaddleRef.current)

    let newX = ballRef.current.x + ballVelRef.current.x
    let newY = ballRef.current.y + ballVelRef.current.y
    let newVelX = ballVelRef.current.x
    let newVelY = ballVelRef.current.y

    const ballTop = newY
    const ballBottom = newY + BALL_SIZE

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

    if (newVelX < 0 && newX <= PADDLE_WIDTH + BALL_SIZE) {
      const paddleTop = playerPaddleRef.current
      const paddleLeft = 0
      
      const collision = checkSweptCollision(
        newX, newY, ballVelRef.current.x, ballVelRef.current.y,
        paddleLeft, paddleTop, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE
      )
      
      if (collision) {
        const hitY = collision.y + BALL_SIZE / 2
        const hitPos = Math.max(0, Math.min(1, (hitY - paddleTop) / PADDLE_HEIGHT))
        const speedMultiplier = 1.15
        const currentSpeed = Math.abs(ballVelRef.current.x)
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
        newY = collision.y
      } else if (newX + BALL_SIZE < 0) {
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

    if (newVelX > 0 && newX + BALL_SIZE >= actualWidth - PADDLE_WIDTH) {
      const paddleTop = aiPaddleRef.current
      const paddleLeft = actualWidth - PADDLE_WIDTH
      
      const collision = checkSweptCollision(
        newX, newY, ballVelRef.current.x, ballVelRef.current.y,
        paddleLeft, paddleTop, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE
      )
      
      if (collision) {
        const hitY = collision.y + BALL_SIZE / 2
        const hitPos = Math.max(0, Math.min(1, (hitY - paddleTop) / PADDLE_HEIGHT))
        const speedMultiplier = 1.15
        const currentSpeed = Math.abs(ballVelRef.current.x)
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
        newY = collision.y
      } else if (newX > actualWidth) {
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
  }, [isPaused, gameOver, resetBall, aiVsAi, gameDimensions, predictBallY, checkSweptCollision])

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
    const now = Date.now()
    gameStartTimeRef.current = now
    lastSpeedIncreaseRef.current = now
    ballVelRef.current = { x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED }
    setBallVelocity({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED })
  }

  const toggleAiVsAi = () => {
    setAiVsAi(prev => !prev)
    if (!aiVsAi) {
      setIsPaused(false)
      setGameOver(false)
    }
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

