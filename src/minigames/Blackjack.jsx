import { useState, useEffect } from 'react'
import './Blackjack.css'

const SUITS = ['♠', '♥', '♦', '♣']
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const createDeck = () => {
  const deck = []
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value, id: `${suit}${value}` })
    }
  }
  return shuffleDeck(deck)
}

const shuffleDeck = (deck) => {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getCardValue = (card) => {
  if (card.value === 'A') return 11
  if (['J', 'Q', 'K'].includes(card.value)) return 10
  return parseInt(card.value)
}

const getHandValue = (hand) => {
  let value = 0
  let aces = 0
  
  for (let card of hand) {
    if (card.value === 'A') {
      aces++
      value += 11
    } else {
      value += getCardValue(card)
    }
  }
  
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }
  
  return value
}

function Blackjack() {
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(10)
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [gameState, setGameState] = useState('betting') // betting, playing, dealerTurn, finished
  const [message, setMessage] = useState('Place your bet!')
  const [dealerHidden, setDealerHidden] = useState(true)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = () => {
    const newDeck = createDeck()
    setDeck(newDeck)
    setPlayerHand([])
    setDealerHand([])
    setGameState('betting')
    setMessage('Place your bet!')
    setDealerHidden(true)
  }

  const dealCards = () => {
    if (balance < bet) {
      setMessage('Insufficient balance!')
      return
    }

    setBalance(prev => prev - bet)
    const newDeck = [...deck]
    
    const playerCards = [newDeck.pop(), newDeck.pop()]
    const dealerCards = [newDeck.pop(), newDeck.pop()]
    
    setDeck(newDeck)
    setPlayerHand(playerCards)
    setDealerHand(dealerCards)
    setGameState('playing')
    setDealerHidden(true)
    
    const playerValue = getHandValue(playerCards)
    if (playerValue === 21) {
      handleBlackjack()
    } else {
      setMessage('Hit or Stand?')
    }
  }

  const handleBlackjack = () => {
    // Use setTimeout to ensure dealerHand state is updated
    setTimeout(() => {
      const dealerValue = getHandValue(dealerHand)
      if (dealerValue === 21) {
        setMessage('Push! Both have Blackjack')
        setBalance(prev => prev + bet)
      } else {
        setMessage('Blackjack! You win!')
        setBalance(prev => prev + Math.floor(bet * 2.5))
      }
      setGameState('finished')
      setDealerHidden(false)
    }, 100)
  }

  const handleHit = () => {
    if (gameState !== 'playing') return
    
    const newDeck = [...deck]
    const newCard = newDeck.pop()
    const newHand = [...playerHand, newCard]
    
    setDeck(newDeck)
    setPlayerHand(newHand)
    
    const playerValue = getHandValue(newHand)
    
    if (playerValue > 21) {
      setMessage('Bust! You lose.')
      setGameState('finished')
      setDealerHidden(false)
    } else if (playerValue === 21) {
      setMessage('21!')
    }
  }

  const handleStand = () => {
    if (gameState !== 'playing') return
    
    setGameState('dealerTurn')
    setDealerHidden(false)
    dealerPlay()
  }

  const dealerPlay = () => {
    const playDealer = () => {
      setDealerHand(currentHand => {
        const dealerValue = getHandValue(currentHand)
        
        if (dealerValue < 17) {
          setDeck(currentDeck => {
            const newDeck = [...currentDeck]
            const newCard = newDeck.pop()
            if (newCard) {
              setTimeout(() => {
                setDealerHand(prevHand => {
                  const updatedHand = [...prevHand, newCard]
                  setTimeout(() => playDealer(), 500)
                  return updatedHand
                })
              }, 100)
            }
            return newDeck
          })
          return currentHand
        } else {
          setTimeout(() => {
            setPlayerHand(playerHand => {
              setDealerHand(dealerHand => {
                const playerValue = getHandValue(playerHand)
                const dealerValue = getHandValue(dealerHand)
                
                if (dealerValue > 21) {
                  setMessage('Dealer busts! You win!')
                  setBalance(prev => prev + bet * 2)
                } else if (playerValue > dealerValue) {
                  setMessage('You win!')
                  setBalance(prev => prev + bet * 2)
                } else if (playerValue < dealerValue) {
                  setMessage('Dealer wins!')
                } else {
                  setMessage('Push!')
                  setBalance(prev => prev + bet)
                }
                
                setGameState('finished')
                return dealerHand
              })
              return playerHand
            })
          }, 500)
          return currentHand
        }
      })
    }
    
    setTimeout(() => playDealer(), 500)
  }

  const checkWinner = () => {
    setPlayerHand(currentPlayerHand => {
      setDealerHand(currentDealerHand => {
        const playerValue = getHandValue(currentPlayerHand)
        const dealerValue = getHandValue(currentDealerHand)
        
        if (dealerValue > 21) {
          setMessage('Dealer busts! You win!')
          setBalance(prev => prev + bet * 2)
        } else if (playerValue > dealerValue) {
          setMessage('You win!')
          setBalance(prev => prev + bet * 2)
        } else if (playerValue < dealerValue) {
          setMessage('Dealer wins!')
        } else {
          setMessage('Push!')
          setBalance(prev => prev + bet)
        }
        
        setGameState('finished')
        return currentDealerHand
      })
      return currentPlayerHand
    })
  }

  const handleBetChange = (amount) => {
    if (gameState !== 'betting') return
    const newBet = Math.max(1, Math.min(balance, bet + amount))
    setBet(newBet)
  }

  const renderCard = (card, hidden = false) => {
    if (hidden) {
      return (
        <div className="card card-hidden">
          <div className="card-back">🂠</div>
        </div>
      )
    }
    
    const isRed = card.suit === '♥' || card.suit === '♦'
    
    return (
      <div className={`card ${isRed ? 'red' : ''}`}>
        <div className="card-value">{card.value}</div>
        <div className="card-suit">{card.suit}</div>
      </div>
    )
  }

  const playerValue = getHandValue(playerHand)
  const dealerValue = dealerHidden ? getCardValue(dealerHand[0]) : getHandValue(dealerHand)

  return (
    <div className="blackjack-container">
      <div className="blackjack-header">
        <h2>🃏 Blackjack</h2>
        <div className="balance-display">
          Balance: {balance} coins
        </div>
      </div>

      <div className="game-area">
        <div className="dealer-section">
          <div className="hand-label">Dealer {!dealerHidden && `(${dealerValue})`}</div>
          <div className="hand">
            {dealerHand.map((card, index) => 
              renderCard(card, dealerHidden && index === 1)
            )}
          </div>
        </div>

        <div className="player-section">
          <div className="hand-label">You ({playerValue})</div>
          <div className="hand">
            {playerHand.map((card) => renderCard(card))}
          </div>
        </div>
      </div>

      <div className="message-display">{message}</div>

      <div className="blackjack-controls">
        {gameState === 'betting' && (
          <>
            <div className="bet-controls">
              <span>Bet: {bet} coins</span>
              <div className="bet-buttons">
                <button onClick={() => handleBetChange(-5)} disabled={bet <= 1}>-5</button>
                <button onClick={() => handleBetChange(-1)} disabled={bet <= 1}>-1</button>
                <button onClick={() => handleBetChange(1)} disabled={bet >= balance}>+1</button>
                <button onClick={() => handleBetChange(5)} disabled={bet >= balance}>+5</button>
              </div>
            </div>
            <button onClick={dealCards} disabled={balance < bet} className="deal-button">
              Deal Cards
            </button>
          </>
        )}

        {gameState === 'playing' && (
          <div className="game-buttons">
            <button onClick={handleHit} className="hit-button">Hit</button>
            <button onClick={handleStand} className="stand-button">Stand</button>
          </div>
        )}

        {gameState === 'finished' && (
          <button onClick={startNewGame} className="new-game-button">
            New Game
          </button>
        )}
      </div>
    </div>
  )
}

export default Blackjack

