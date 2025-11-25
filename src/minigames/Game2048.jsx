import { useState, useEffect, useCallback } from 'react'
import './Game2048.css'

const GRID_SIZE = 4
const WIN_VALUE = 2048

function Game2048() {
  const [grid, setGrid] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const initializeGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
    addRandomTile(newGrid)
    addRandomTile(newGrid)
    return newGrid
  }

  const addRandomTile = (grid) => {
    const emptyCells = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ row: i, col: j })
        }
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const moveLeft = (grid) => {
    const newGrid = grid.map(row => {
      const filtered = row.filter(val => val !== 0)
      const merged = []
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2)
          setScore(prev => prev + filtered[i] * 2)
          if (filtered[i] * 2 === WIN_VALUE && !won) {
            setWon(true)
          }
          i++
        } else {
          merged.push(filtered[i])
        }
      }
      while (merged.length < GRID_SIZE) {
        merged.push(0)
      }
      return merged
    })
    return newGrid
  }

  const moveRight = (grid) => {
    return moveLeft(grid.map(row => [...row].reverse())).map(row => row.reverse())
  }

  const moveUp = (grid) => {
    const rotated = grid[0].map((_, i) => grid.map(row => row[i]))
    const moved = moveLeft(rotated)
    return moved[0].map((_, i) => moved.map(row => row[i]))
  }

  const moveDown = (grid) => {
    const rotated = grid[0].map((_, i) => grid.map(row => row[i]).reverse())
    const moved = moveLeft(rotated)
    return moved[0].map((_, i) => moved.map(row => row[GRID_SIZE - 1 - i]))
  }

  const canMove = (grid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return true
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true
      }
    }
    return false
  }

  const handleMove = useCallback((direction) => {
    if (gameOver) return

    setGrid(prevGrid => {
      let newGrid
      switch (direction) {
        case 'left':
          newGrid = moveLeft(prevGrid.map(row => [...row]))
          break
        case 'right':
          newGrid = moveRight(prevGrid.map(row => [...row]))
          break
        case 'up':
          newGrid = moveUp(prevGrid.map(row => [...row]))
          break
        case 'down':
          newGrid = moveDown(prevGrid.map(row => [...row]))
          break
        default:
          return prevGrid
      }

      const gridChanged = JSON.stringify(newGrid) !== JSON.stringify(prevGrid)
      if (gridChanged) {
        addRandomTile(newGrid)
        if (!canMove(newGrid)) {
          setGameOver(true)
        }
      }
      return newGrid
    })
  }, [gameOver])

  const handleKeyPress = useCallback((e) => {
    const key = e.key.toLowerCase()
    if (key === 'arrowleft' || key === 'a') {
      e.preventDefault()
      handleMove('left')
    } else if (key === 'arrowright' || key === 'd') {
      e.preventDefault()
      handleMove('right')
    } else if (key === 'arrowup' || key === 'w') {
      e.preventDefault()
      handleMove('up')
    } else if (key === 'arrowdown' || key === 's') {
      e.preventDefault()
      handleMove('down')
    }
  }, [handleMove])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    setGrid(initializeGrid())
  }, [])

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    const touch = e.targetTouches[0]
    setTouchEnd(null)
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const onTouchMove = (e) => {
    const touch = e.targetTouches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const absX = Math.abs(distanceX)
    const absY = Math.abs(distanceY)

    if (absX > absY && absX > minSwipeDistance) {
      if (distanceX > 0) {
        handleMove('left')
      } else {
        handleMove('right')
      }
    } else if (absY > absX && absY > minSwipeDistance) {
      if (distanceY > 0) {
        handleMove('up')
      } else {
        handleMove('down')
      }
    }
  }

  const resetGame = () => {
    setGrid(initializeGrid())
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  const getTileColor = (value) => {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    }
    return colors[value] || '#3c3a32'
  }

  return (
    <div className="game2048-container">
      <div className="game2048-header">
        <div className="score">Score: {score}</div>
        {won && <div className="won">You Win!</div>}
        {gameOver && <div className="game-over">GAME OVER</div>}
      </div>
      
      <div 
        className="game2048-board"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {grid.map((row, i) => (
          <div key={i} className="game2048-row">
            {row.map((cell, j) => (
              <div key={`${i}-${j}`} className="game2048-cell">
                {cell !== 0 && (
                  <div
                    className="game2048-tile"
                    style={{
                      backgroundColor: getTileColor(cell),
                      color: cell <= 4 ? '#776e65' : '#f9f6f2'
                    }}
                  >
                    {cell}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="game2048-controls">
        <button onClick={resetGame} className="reset-button">
          {gameOver ? 'Play Again' : 'Reset'}
        </button>
        <div className="instructions">
          <p>Use Arrow Keys or WASD to move</p>
          <p className="mobile-instruction">Or swipe on the board</p>
          <p>Combine tiles to reach 2048!</p>
        </div>
      </div>
    </div>
  )
}

export default Game2048

