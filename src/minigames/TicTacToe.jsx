import { useState, useEffect } from 'react'
import './TicTacToe.css'

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [isDraw, setIsDraw] = useState(false)
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)

  const calculateWinner = (squares) => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const checkDraw = (squares) => {
    return squares.every(square => square !== null) && !calculateWinner(squares)
  }

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return

    const newBoard = board.slice()
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const newWinner = calculateWinner(newBoard)
    const newDraw = checkDraw(newBoard)

    if (newWinner) {
      setWinner(newWinner)
      if (newWinner === 'X') {
        setXWins(prev => prev + 1)
      } else {
        setOWins(prev => prev + 1)
      }
    } else if (newDraw) {
      setIsDraw(true)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setIsDraw(false)
  }

  const resetScores = () => {
    setXWins(0)
    setOWins(0)
    resetGame()
  }

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}!`
    }
    if (isDraw) {
      return "It's a Draw!"
    }
    return `Next player: ${isXNext ? 'X' : 'O'}`
  }

  return (
    <div className="tic-tac-toe-container">
      <div className="tic-tac-toe-header">
        <div className="score-display">
          <div className="x-score">X: {xWins}</div>
          <div className="o-score">O: {oWins}</div>
        </div>
        <div className="game-status">{getStatus()}</div>
      </div>

      <div className="tic-tac-toe-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${winner && WINNING_COMBINATIONS.some(combo => combo.includes(index) && combo.every(i => board[i] === winner)) ? 'winning' : ''}`}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner || isDraw}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="tic-tac-toe-controls">
        <button onClick={resetGame} className="reset-button">
          New Game
        </button>
        <button onClick={resetScores} className="reset-scores-button">
          Reset Scores
        </button>
        <div className="instructions">
          <p>Click on a cell to place your mark</p>
          <p>Get three in a row to win!</p>
        </div>
      </div>
    </div>
  )
}

export default TicTacToe

