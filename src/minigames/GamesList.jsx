import { useState } from 'react'
import './GamesList.css'
import SnakeGame from './SnakeGame.jsx'
import PongGame from './PongGame.jsx'
import TicTacToe from './TicTacToe.jsx'
import Tetris from './Tetris.jsx'
import Game2048 from './Game2048.jsx'
import MemoryGame from './MemoryGame.jsx'
import Breakout from './Breakout.jsx'
import SlotMachine from './SlotMachine.jsx'
import Blackjack from './Blackjack.jsx'

const GAMES = [
  { id: 'snake', name: 'Snake', icon: '🐍' },
  { id: 'pong', name: 'Pong', icon: '🏓' },
  { id: 'tictactoe', name: 'Tic Tac Toe', icon: '⭕' },
  { id: 'tetris', name: 'Tetris', icon: '🧩' },
  { id: '2048', name: '2048', icon: '🔢' },
  { id: 'memory', name: 'Memory', icon: '🧠' },
  { id: 'breakout', name: 'Breakout', icon: '🎾' },
  { id: 'slots', name: 'Slots', icon: '🎰' },
  { id: 'blackjack', name: 'Blackjack', icon: '🃏' }
]

function GamesList({ onBack }) {
  const [selectedGame, setSelectedGame] = useState(null)

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId)
  }

  const handleBack = () => {
    setSelectedGame(null)
  }

  if (selectedGame) {
    return (
      <div className="games-list-container">
        <button onClick={handleBack} className="back-button">
          ← Back to Games
        </button>
        {selectedGame === 'snake' && <SnakeGame />}
        {selectedGame === 'pong' && <PongGame />}
        {selectedGame === 'tictactoe' && <TicTacToe />}
        {selectedGame === 'tetris' && <Tetris />}
        {selectedGame === '2048' && <Game2048 />}
        {selectedGame === 'memory' && <MemoryGame />}
        {selectedGame === 'breakout' && <Breakout />}
        {selectedGame === 'slots' && <SlotMachine />}
        {selectedGame === 'blackjack' && <Blackjack />}
      </div>
    )
  }

  return (
    <div className="games-list-container">
      <div className="games-list-header">
        <h1>🎮 Games</h1>
        <p>Choose a game to play!</p>
      </div>
      
      <div className="games-grid">
        {GAMES.map((game) => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => handleGameSelect(game.id)}
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-name">{game.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default GamesList

