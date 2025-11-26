import { useState, useEffect, useRef, useCallback } from 'react'
import './SnakeGame.css'

// Responsive params
const INITIAL_DIRECTION = { x: 1, y: 0 }
const MIN_CELLS = 10
const MAX_CELLS = 60
const BASE_CELL_PX = 22 // approx pixels per cell baseline
const RESIZE_DEBOUNCE_MS = 350

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState(null)
  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [gridSize, setGridSize] = useState(20)
  const [moveInterval, setMoveInterval] = useState(150)
  const directionRef = useRef(INITIAL_DIRECTION)
  const gameLoopRef = useRef(null)
  const moveTickRef = useRef(0)
  const lastFoodSetTickRef = useRef(-1)
  const touchStartRef = useRef(null)
  const containerRef = useRef(null)
  const resizeTimeoutRef = useRef(null)

  // avoidPositions: array of positions to avoid (each {x,y}).
  // avoidanceDistance: Manhattan distance threshold to avoid.
  const generateFood = useCallback((size = gridSize, snakeBody = snake, avoidPositions = [], avoidanceDistance = 3) => {
    // Build list of free cells (not occupied by snake)
    const freeCells = []
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (snakeBody.some(s => s.x === x && s.y === y)) continue
        // skip cells too close to any avoid position
        let tooClose = false
        for (const ap of avoidPositions) {
          const dx = Math.abs(x - ap.x)
          const dy = Math.abs(y - ap.y)
          const manhattan = dx + dy
          if (manhattan <= avoidanceDistance) {
            tooClose = true
            break
          }
        }
        if (tooClose) continue
        freeCells.push({ x, y })
      }
    }

    if (freeCells.length === 0) {
      // if no safe cells with avoidance, relax the avoid rule
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          if (!snakeBody.some(s => s.x === x && s.y === y)) freeCells.push({ x, y })
        }
      }
    }

    if (freeCells.length === 0) {
      console.debug('[Snake] generateFood: no free cells, returning 0,0')
      return { x: 0, y: 0 }
    }

    const choice = freeCells[Math.floor(Math.random() * freeCells.length)]
    console.debug('[Snake] generateFood picked', choice, 'from', freeCells.length, 'options', 'avoidPositions=', avoidPositions, 'avoidanceDistance=', avoidanceDistance)
    return choice
  }, [gridSize, snake])

  useEffect(() => {
    console.debug('[Snake] food changed ->', food)
  }, [food])

  const checkCollision = useCallback((head, snakeBody, size = gridSize) => {
    if (head.x < 0 || head.x >= size || head.y < 0 || head.y >= size) {
      return true
    }
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y)
  }, [gridSize])

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    // advance tick for this game step
    moveTickRef.current += 1

    setSnake(prevSnake => {
      const head = {
        x: prevSnake[0].x + directionRef.current.x,
        y: prevSnake[0].y + directionRef.current.y
      }

      if (checkCollision(head, prevSnake, gridSize)) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]

  if (food && head.x === food.x && head.y === food.y) {
        console.debug('[Snake] ate food at', food, 'head=', head, 'tick=', moveTickRef.current)
        // prepare avoidPositions: head and next few positions in direction to reduce immediate re-eat
        const next1 = { x: (head.x + directionRef.current.x + gridSize) % gridSize, y: (head.y + directionRef.current.y + gridSize) % gridSize }
        const next2 = { x: (next1.x + directionRef.current.x + gridSize) % gridSize, y: (next1.y + directionRef.current.y + gridSize) % gridSize }
        const newFood = generateFood(gridSize, [head, ...prevSnake], [head, next1, next2], 3)
        // only set food once per tick
        if (lastFoodSetTickRef.current !== moveTickRef.current) {
          setFood(newFood)
          lastFoodSetTickRef.current = moveTickRef.current
        } else {
          console.debug('[Snake] skipped setFood because already set this tick')
        }
        setScore(newSnake.length - 1)
      } else {
        newSnake.pop()
        setScore(newSnake.length - 1)
      }

      return newSnake
    })
  }, [food, isPaused, gameOver, checkCollision, generateFood])

  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, moveInterval)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [gameLoop, gameOver, isPaused, moveInterval])

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
  // center snake based on current gridSize
  const center = Math.floor(gridSize / 2)
  const centerPos = { x: center, y: center }
  setSnake([centerPos])
  setFood(null)
  setStarted(false)
    directionRef.current = INITIAL_DIRECTION
    setGameOver(false)
    setScore(0)
    setIsPaused(true)
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

  const startGame = () => {
    console.log('[Snake] Start pressed')
    // spawn food and start moving
    const center = Math.floor(gridSize / 2)
    const centerPos = { x: center, y: center }
    // ensure snake centered
    setSnake([centerPos])
    const newFood = generateFood(gridSize, [centerPos], [centerPos], 3)
    setFood(newFood)
    setStarted(true)
    setIsPaused(false)
    setGameOver(false)
    setScore(0)
    directionRef.current = INITIAL_DIRECTION
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

  // compute grid size & interval from viewport/container size
  const computeParams = useCallback(() => {
    const container = containerRef.current
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Prefer using ~75% of the smaller viewport dimension to size the square
    const target = Math.min(vw * 0.75, vh * 0.75)
    const cells = Math.max(MIN_CELLS, Math.min(MAX_CELLS, Math.round(target / BASE_CELL_PX)))
    // make larger screens a bit faster
    const diagonal = Math.sqrt(vw * vw + vh * vh)
    const interval = Math.max(40, Math.round(220 - (diagonal - 600) / 6))
    return { cells, interval, target }
  }, [])

  // apply responsive params and handle resize pause/restart
  useEffect(() => {
    function applyAndReset() {
      const { cells, interval } = computeParams()
      setGridSize(cells)
      setMoveInterval(interval)
      // reset game to adapt to new grid
      const center = Math.floor(cells / 2)
      const centerPos = { x: center, y: center }
      setSnake([centerPos])
      setFood(null)
      setStarted(false)
      setIsPaused(true)
      setIsResizing(false)
      setGameOver(false)
    }

    // initial
    applyAndReset()

    let timeout = null
    function onResize() {
      // pause during resize
      if (!isResizing) setIsResizing(true)
      setIsPaused(true)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        applyAndReset()
      }, RESIZE_DEBOUNCE_MS)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (timeout) clearTimeout(timeout)
    }
  }, [computeParams])

  const renderCell = (index) => {
    const x = index % gridSize
    const y = Math.floor(index / gridSize)
    const isSnake = snake.some(segment => segment.x === x && segment.y === y)
    const isHead = snake[0]?.x === x && snake[0]?.y === y
  const isFood = food && food.x === x && food.y === y

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
      className={`snake-game-container ${(!started || isPaused || gameOver) ? 'dimmed' : ''}`}
    >
      <div className="snake-game-header">
        <div className="score">Score: {score}</div>
        {isPaused && <div className="paused">PAUSED</div>}
        {gameOver && <div className="game-over">GAME OVER</div>}
      </div>
      
      <div
        className="snake-game-board"
        tabIndex={0}
        onClick={() => { if (!started) startGame() }}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          width: Math.max(200, Math.min(Math.floor(Math.min(window.innerWidth * 0.75, window.innerHeight * 0.75)), 1400)) + 'px',
          height: Math.max(200, Math.min(Math.floor(Math.min(window.innerWidth * 0.75, window.innerHeight * 0.75)), 1400)) + 'px'
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, index) => renderCell(index))}
      </div>

      {/* Overlay when not started, paused, or finished */}
      {(!started || isPaused || gameOver) && (
        <div
          className={`snake-overlay ${!started ? 'clickable' : ''}`}
          onClick={() => { if (!started) startGame() }}
        >
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            {!started ? (
              <>
                <div>Tap or click to start</div>
                <div style={{ textAlign: 'center', marginTop: 6 }}>
                  <button className="overlay-start-button" onClick={startGame}>Start</button>
                </div>
              </>
            ) : gameOver ? 'Game Over' : 'Paused'}
          </div>
        </div>
      )}

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
        <div style={{ display: 'flex', gap: 8 }}>
          {!started ? (
            <button onClick={startGame} className="reset-button">Start</button>
          ) : (
            <>
              <button onClick={resetGame} className="reset-button">{gameOver ? 'Play Again' : 'Reset'}</button>
              <button onClick={handlePause} className="reset-button">{isPaused ? 'Resume' : 'Pause'}</button>
            </>
          )}
        </div>
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

