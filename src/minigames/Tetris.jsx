import { useState, useEffect, useRef, useCallback } from 'react'
import './Tetris.css'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const GAME_SPEED = 500

const TETROMINOES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
}

const COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
}

function Tetris() {
  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)))
  const [currentPiece, setCurrentPiece] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const gameLoopRef = useRef(null)

  const getRandomPiece = () => {
    const pieces = Object.keys(TETROMINOES)
    const pieceType = pieces[Math.floor(Math.random() * pieces.length)]
    return {
      shape: TETROMINOES[pieceType],
      type: pieceType,
      color: COLORS[pieceType]
    }
  }

  const rotatePiece = (piece) => {
    const rows = piece.length
    const cols = piece[0].length
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0))
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = piece[i][j]
      }
    }
    return rotated
  }

  const isValidPosition = (piece, pos, board) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x
          const newY = pos.y + y
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false
          }
          if (newY >= 0 && board[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }

  const placePiece = (piece, pos, board, color) => {
    const newBoard = board.map(row => [...row])
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const boardY = pos.y + y
          const boardX = pos.x + x
          if (boardY >= 0) {
            newBoard[boardY][boardX] = color
          }
        }
      }
    }
    return newBoard
  }

  const clearLines = (board) => {
    let newBoard = board.filter(row => !row.every(cell => cell !== 0))
    const linesCleared = BOARD_HEIGHT - newBoard.length
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0))
    }
    return { board: newBoard, linesCleared }
  }

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return

    setPosition(prevPos => {
      const newPos = { x: prevPos.x, y: prevPos.y + 1 }
      if (!currentPiece || !isValidPosition(currentPiece.shape, newPos, board)) {
        if (currentPiece) {
          setBoard(prevBoard => {
            const updatedBoard = placePiece(currentPiece.shape, prevPos, prevBoard, currentPiece.color)
            const { board: clearedBoard, linesCleared } = clearLines(updatedBoard)
            if (linesCleared > 0) {
              setScore(prev => prev + linesCleared * 100)
            }
            return clearedBoard
          })
        }
        const newPiece = getRandomPiece()
        const startPos = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), y: 0 }
        if (!isValidPosition(newPiece.shape, startPos, board)) {
          setGameOver(true)
          return prevPos
        }
        setCurrentPiece(newPiece)
        return startPos
      }
      return newPos
    })
  }, [currentPiece, board, isPaused, gameOver])

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

  useEffect(() => {
    if (!currentPiece) {
      const newPiece = getRandomPiece()
      const startPos = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), y: 0 }
      setCurrentPiece(newPiece)
      setPosition(startPos)
    }
  }, [])

  const handleKeyPress = useCallback((e) => {
    if (gameOver || !currentPiece) return

    const key = e.key.toLowerCase()
    if (key === ' ') {
      e.preventDefault()
      setIsPaused(prev => !prev)
      return
    }

    if (key === 'arrowleft' || key === 'a') {
      e.preventDefault()
      setPosition(prevPos => {
        const newPos = { x: prevPos.x - 1, y: prevPos.y }
        return isValidPosition(currentPiece.shape, newPos, board) ? newPos : prevPos
      })
    } else if (key === 'arrowright' || key === 'd') {
      e.preventDefault()
      setPosition(prevPos => {
        const newPos = { x: prevPos.x + 1, y: prevPos.y }
        return isValidPosition(currentPiece.shape, newPos, board) ? newPos : prevPos
      })
    } else if (key === 'arrowdown' || key === 's') {
      e.preventDefault()
      setPosition(prevPos => {
        const newPos = { x: prevPos.x, y: prevPos.y + 1 }
        return isValidPosition(currentPiece.shape, newPos, board) ? newPos : prevPos
      })
    } else if (key === 'arrowup' || key === 'w') {
      e.preventDefault()
      const rotated = rotatePiece(currentPiece.shape)
      setCurrentPiece(prev => {
        if (isValidPosition(rotated, position, board)) {
          return { ...prev, shape: rotated }
        }
        return prev
      })
    }
  }, [currentPiece, board, position, gameOver])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const handleDirectionChange = (direction) => {
    if (gameOver || !currentPiece) return

    if (direction === 'left') {
      setPosition(prevPos => {
        const newPos = { x: prevPos.x - 1, y: prevPos.y }
        return isValidPosition(currentPiece.shape, newPos, board) ? newPos : prevPos
      })
    } else if (direction === 'right') {
      setPosition(prevPos => {
        const newPos = { x: prevPos.x + 1, y: prevPos.y }
        return isValidPosition(currentPiece.shape, newPos, board) ? newPos : prevPos
      })
    } else if (direction === 'down') {
      setPosition(prevPos => {
        const newPos = { x: prevPos.x, y: prevPos.y + 1 }
        return isValidPosition(currentPiece.shape, newPos, board) ? newPos : prevPos
      })
    } else if (direction === 'rotate') {
      const rotated = rotatePiece(currentPiece.shape)
      setCurrentPiece(prev => {
        if (isValidPosition(rotated, position, board)) {
          return { ...prev, shape: rotated }
        }
        return prev
      })
    }
  }

  const handlePause = () => {
    if (gameOver) return
    setIsPaused(prev => !prev)
  }

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)))
    const newPiece = getRandomPiece()
    const startPos = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), y: 0 }
    setCurrentPiece(newPiece)
    setPosition(startPos)
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
  }

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = position.y + y
            const boardX = position.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }
    return displayBoard
  }

  return (
    <div className="tetris-container">
      <div className="tetris-header">
        <div className="score">Score: {score}</div>
        {isPaused && <div className="paused">PAUSED</div>}
        {gameOver && <div className="game-over">GAME OVER</div>}
      </div>
      
      <div className="tetris-board">
        {renderBoard().map((row, y) => (
          <div key={y} className="tetris-row">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className="tetris-cell"
                style={{ backgroundColor: cell || '#2c3e50' }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="tetris-controls">
        <div className="mobile-controls">
          <button className="control-button left" onClick={() => handleDirectionChange('left')} aria-label="Move left">
            ←
          </button>
          <button className="control-button rotate" onClick={() => handleDirectionChange('rotate')} aria-label="Rotate">
            ↻
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
          <p>Arrow Keys or WASD to move</p>
          <p>Up/W to rotate</p>
          <p>Space to pause</p>
          <p className="mobile-instruction">Or use the on-screen controls</p>
        </div>
      </div>
    </div>
  )
}

export default Tetris

