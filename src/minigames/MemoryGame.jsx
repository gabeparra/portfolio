import { useState, useEffect } from 'react'
import './MemoryGame.css'

const CARD_SYMBOLS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍑']
const TOTAL_CARDS = 16

function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  const initializeCards = () => {
    const symbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
    const shuffled = symbols.sort(() => Math.random() - 0.5)
    return shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false
    }))
  }

  useEffect(() => {
    setCards(initializeCards())
  }, [])

  const handleCardClick = (cardId) => {
    if (flipped.length === 2 || matched.includes(cardId) || flipped.includes(cardId)) {
      return
    }

    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)
    setMoves(prev => prev + 1)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(prev => [...prev, first, second])
        setFlipped([])
        if (matched.length + 2 === TOTAL_CARDS - 2) {
          setTimeout(() => setGameWon(true), 500)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  const resetGame = () => {
    setCards(initializeCards())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  return (
    <div className="memory-game-container">
      <div className="memory-game-header">
        <div className="moves">Moves: {moves}</div>
        {gameWon && <div className="won">You Win!</div>}
      </div>
      
      <div className="memory-game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-front">?</div>
            <div className="card-back">{card.symbol}</div>
          </div>
        ))}
      </div>

      <div className="memory-game-controls">
        <button onClick={resetGame} className="reset-button">
          New Game
        </button>
        <div className="instructions">
          <p>Click cards to flip them</p>
          <p>Match pairs to win!</p>
        </div>
      </div>
    </div>
  )
}

export default MemoryGame

