import { useState, useEffect, useRef } from 'react'
import './SlotMachine.css'

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣']
const PAYOUTS = {
  '777': 100,
  '💎💎💎': 50,
  '⭐⭐⭐': 30,
  '🔔🔔🔔': 20,
  '🍇🍇🍇': 15,
  '🍊🍊🍊': 10,
  '🍋🍋🍋': 8,
  '🍒🍒🍒': 5
}

function SlotMachine() {
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(10)
  const [reels, setReels] = useState(['🍒', '🍋', '🍊'])
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [message, setMessage] = useState('Place your bet and spin!')
  const [winningLine, setWinningLine] = useState(false)
  const spinIntervalRef = useRef(null)

  const spinReel = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  }

  const checkWin = (newReels) => {
    const line = newReels.join('')
    
    // Check for three of a kind
    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      const payout = PAYOUTS[line] || 0
      return payout
    }
    
    // Check for two of a kind (smaller payout)
    if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
      return bet * 0.5 // Small consolation
    }
    
    return 0
  }

  const handleSpin = () => {
    if (isSpinning || balance < bet) return

    setBalance(prev => prev - bet)
    setIsSpinning(true)
    setWinningLine(false)
    setMessage('Spinning...')
    setLastWin(0)

    let spinCount = 0
    const maxSpins = 30 + Math.floor(Math.random() * 20)

    spinIntervalRef.current = setInterval(() => {
      setReels([spinReel(), spinReel(), spinReel()])
      spinCount++

      if (spinCount >= maxSpins) {
        clearInterval(spinIntervalRef.current)
        
        const finalReels = [spinReel(), spinReel(), spinReel()]
        setReels(finalReels)
        
        const winAmount = checkWin(finalReels)
        
        setTimeout(() => {
          if (winAmount > 0) {
            setBalance(prev => prev + winAmount)
            setLastWin(winAmount)
            setWinningLine(true)
            setMessage(`🎉 You won ${winAmount} coins!`)
          } else {
            setMessage('Better luck next time!')
          }
          setIsSpinning(false)
        }, 300)
      }
    }, 50)
  }

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current)
      }
    }
  }, [])

  const handleBetChange = (amount) => {
    if (isSpinning) return
    const newBet = Math.max(1, Math.min(balance, bet + amount))
    setBet(newBet)
  }

  return (
    <div className="slot-machine-container">
      <div className="slot-header">
        <h2>🎰 Slot Machine</h2>
        <div className="balance-display">
          <span>Balance: {balance} coins</span>
        </div>
      </div>

      <div className="slot-machine">
        <div className={`reels-container ${winningLine ? 'winning' : ''}`}>
          {reels.map((symbol, index) => (
            <div key={index} className={`reel ${isSpinning ? 'spinning' : ''}`}>
              <div className="reel-symbol">{symbol}</div>
            </div>
          ))}
        </div>
        
        <div className="slot-message">{message}</div>
        
        {lastWin > 0 && (
          <div className="win-display">+{lastWin} coins!</div>
        )}
      </div>

      <div className="slot-controls">
        <div className="bet-controls">
          <span>Bet: {bet} coins</span>
          <div className="bet-buttons">
            <button 
              onClick={() => handleBetChange(-5)} 
              disabled={isSpinning || bet <= 1}
              className="bet-btn"
            >
              -5
            </button>
            <button 
              onClick={() => handleBetChange(-1)} 
              disabled={isSpinning || bet <= 1}
              className="bet-btn"
            >
              -1
            </button>
            <button 
              onClick={() => handleBetChange(1)} 
              disabled={isSpinning || bet >= balance}
              className="bet-btn"
            >
              +1
            </button>
            <button 
              onClick={() => handleBetChange(5)} 
              disabled={isSpinning || bet >= balance}
              className="bet-btn"
            >
              +5
            </button>
          </div>
        </div>

        <button 
          onClick={handleSpin} 
          disabled={isSpinning || balance < bet}
          className="spin-button"
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </button>

        <div className="payouts-info">
          <h3>Payouts:</h3>
          <div className="payouts-list">
            {Object.entries(PAYOUTS).slice(0, 5).map(([combo, amount]) => (
              <div key={combo} className="payout-item">
                {combo}: {amount}x bet
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlotMachine

