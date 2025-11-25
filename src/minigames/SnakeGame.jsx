import { useState, useEffect, useRef, useCallback } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const directionRef = useRef(INITIAL_DIRECTION)
  const gameLoopRef = useRef(null)
  const touchStartRef = useRef(null)
  const containerRef = useRef(null)

  const generateFood = useCallback(() => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const checkCollision = useCallback((head, snakeBody) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y)
  }, [])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    setSnake(prevSnake => {
      const head = {
        x: prevSnake[0].x + directionRef.current.x,
        y: prevSnake[0].y + directionRef.current.y
      }

      if (checkCollision(head, prevSnake)) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood())
        setScore(newSnake.length - 1)
      } else {
        newSnake.pop()
        setScore(newSnake.length - 1)
      }

      return newSnake
    })
  }, [food, isPaused, gameOver, checkCollision, generateFood])

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, GAME_SPEED)
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

  const handleKeyPress = useCallback((e) => {
    if (gameOver) return

    const key = e.key.toLowerCase()
    const currentDir = directionRef.current

    if (key === ' ') {
      e.preventDefault()
      setIsPaused(prev => !prev)
      return
    }

    const directionMap = {
      'arrowup': { x: 0, y: -1, opposite: { y: 0 } },
      'w': { x: 0, y: -1, opposite: { y: 0 } },
      'arrowdown': { x: 0, y: 1, opposite: { y: 0 } },
      's': { x: 0, y: 1, opposite: { y: 0 } },
      'arrowleft': { x: -1, y: 0, opposite: { x: 0 } },
      'a': { x: -1, y: 0, opposite: { x: 0 } },
      'arrowright': { x: 1, y: 0, opposite: { x: 0 } },
      'd': { x: 1, y: 0, opposite: { x: 0 } }
    }

    if (directionMap[key]) {
      e.preventDefault()
      const newDir = directionMap[key]
      if (currentDir[Object.keys(newDir.opposite)[0]] === 0) {
        directionRef.current = { x: newDir.x, y: newDir.y }
      }
    }
  }, [gameOver])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood({ x: 15, y: 15 })
    directionRef.current = INITIAL_DIRECTION
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
  }

  const handleDirectionChange = (newDirection) => {
    if (gameOver) return
    const currentDir = directionRef.current
    
    const directions = {
      'up': { x: 0, y: -1, check: 'y' },
      'down': { x: 0, y: 1, check: 'y' },
      'left': { x: -1, y: 0, check: 'x' },
      'right': { x: 1, y: 0, check: 'x' }
    }

    const dir = directions[newDirection]
    if (dir && currentDir[dir.check] === 0) {
      directionRef.current = { x: dir.x, y: dir.y }
    }
  }

  const handlePause = () => {
    if (gameOver) return
    setIsPaused(prev => !prev)
  }

  const handleTouchStart = useCallback((e) => {
    if (gameOver || isPaused) return
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }, [gameOver, isPaused])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault() // Prevent scrolling while playing
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartRef.current || gameOver || isPaused) return
    
    const touch = e.changedTouches[0]
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    const deltaX = touchEnd.x - touchStartRef.current.x
    const deltaY = touchEnd.y - touchStartRef.current.y
    const deltaTime = touchEnd.time - touchStartRef.current.time

    // Only register swipe if movement is significant and quick enough
    const minSwipeDistance = 30
    const maxSwipeTime = 300

    if (deltaTime > maxSwipeTime) {
      touchStartRef.current = null
      return
    }

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX < minSwipeDistance && absY < minSwipeDistance) {
      touchStartRef.current = null
      return
    }

    const currentDir = directionRef.current

    // Determine swipe direction
    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0 && currentDir.x === 0) {
        // Swipe right
        directionRef.current = { x: 1, y: 0 }
      } else if (deltaX < 0 && currentDir.x === 0) {
        // Swipe left
        directionRef.current = { x: -1, y: 0 }
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && currentDir.y === 0) {
        // Swipe down
        directionRef.current = { x: 0, y: 1 }
      } else if (deltaY < 0 && currentDir.y === 0) {
        // Swipe up
        directionRef.current = { x: 0, y: -1 }
      }
    }

    touchStartRef.current = null
  }, [gameOver, isPaused])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const renderCell = (index) => {
    const x = index % GRID_SIZE
    const y = Math.floor(index / GRID_SIZE)
    const isSnake = snake.some(segment => segment.x === x && segment.y === y)
    const isHead = snake[0]?.x === x && snake[0]?.y === y
    const isFood = food.x === x && food.y === y

    let className = 'cell'
    if (isHead) className += ' head'
    else if (isSnake) className += ' snake'
    if (isFood) className += ' food'

    return (
      <div key={index} className={className} />
    )
  }

  return (
    <div 
      ref={containerRef}
      className="snake-game-container"
    >
      <div className="snake-game-header">
        <div className="score">Score: {score}</div>
        {isPaused && <div className="paused">PAUSED</div>}
        {gameOver && <div className="game-over">GAME OVER</div>}
      </div>
      
      <div className="snake-game-board" tabIndex={0}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => renderCell(index))}
      </div>

      <div className="snake-game-controls">
        <div className="mobile-controls">
          <button className="control-button up" onClick={() => handleDirectionChange('up')} aria-label="Move up">
            ↑
          </button>
          <button className="control-button left" onClick={() => handleDirectionChange('left')} aria-label="Move left">
            ←
          </button>
          <button className="control-button pause" onClick={handlePause} aria-label="Pause">
            ⏸
          </button>
          <button className="control-button right" onClick={() => handleDirectionChange('right')} aria-label="Move right">
            →
          </button>
          <button className="control-button down" onClick={() => handleDirectionChange('down')} aria-label="Move down">
            ↓
          </button>
        </div>
        <button onClick={resetGame} className="reset-button">
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
        <div className="instructions">
          <p>Desktop: Use Arrow Keys or WASD to move</p>
          <p>Mobile: Swipe anywhere on screen to change direction</p>
          <p>Press Space or Pause button to pause</p>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame

