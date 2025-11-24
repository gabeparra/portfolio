import { useState, useEffect, useRef, useCallback } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const directionRef = useRef(INITIAL_DIRECTION)
  const gameLoopRef = useRef(null)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    return newFood
  }, [])

  const checkCollision = useCallback((head, snakeBody) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    for (let segment of snakeBody) {
      if (head.x === segment.x && head.y === segment.y) {
        return true
      }
    }
    return false
  }, [])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] }
      head.x += directionRef.current.x
      head.y += directionRef.current.y

      if (checkCollision(head, prevSnake)) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]

      if (head.x === food.x && head.y === food.y) {
        let newFood = generateFood()
        while (newSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
          newFood = generateFood()
        }
        setFood(newFood)
      } else {
        newSnake.pop()
      }

      setScore(newSnake.length - 1)

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

    if (key === 'arrowup' || key === 'w') {
      e.preventDefault()
      if (currentDir.y === 0) {
        directionRef.current = { x: 0, y: -1 }
        setDirection({ x: 0, y: -1 })
      }
    } else if (key === 'arrowdown' || key === 's') {
      e.preventDefault()
      if (currentDir.y === 0) {
        directionRef.current = { x: 0, y: 1 }
        setDirection({ x: 0, y: 1 })
      }
    } else if (key === 'arrowleft' || key === 'a') {
      e.preventDefault()
      if (currentDir.x === 0) {
        directionRef.current = { x: -1, y: 0 }
        setDirection({ x: -1, y: 0 })
      }
    } else if (key === 'arrowright' || key === 'd') {
      e.preventDefault()
      if (currentDir.x === 0) {
        directionRef.current = { x: 1, y: 0 }
        setDirection({ x: 1, y: 0 })
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
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
  }

  return (
    <div className="snake-game-container">
      <div className="snake-game-header">
        <div className="score">Score: {score}</div>
        {isPaused && <div className="paused">PAUSED</div>}
        {gameOver && <div className="game-over">GAME OVER</div>}
      </div>
      
      <div className="snake-game-board" tabIndex={0}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          const isSnake = snake.some(segment => segment.x === x && segment.y === y)
          const isHead = snake[0] && snake[0].x === x && snake[0].y === y
          const isFood = food.x === x && food.y === y

          return (
            <div
              key={index}
              className={`cell ${isHead ? 'head' : ''} ${isSnake && !isHead ? 'snake' : ''} ${isFood ? 'food' : ''}`}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`
              }}
            />
          )
        })}
      </div>

      <div className="snake-game-controls">
        <button onClick={resetGame} className="reset-button">
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
        <div className="instructions">
          <p>Use Arrow Keys or WASD to move</p>
          <p>Press Space to pause</p>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame

