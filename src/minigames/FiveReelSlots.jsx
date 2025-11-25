import { useState, useEffect, useRef } from 'react'
import './SlotMachine.css'

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣', '🍀', '🎰']
const PAYLINES = [
  [0, 1, 2, 3, 4], // All middle
  [0, 1, 2], // First three
  [2, 3, 4], // Last three
  [0, 2, 4], // Zigzag
  [1, 3] // Middle two
]

const PAYOUTS = {
  '7️⃣7️⃣7️⃣7️⃣7️⃣': 500,
  '💎💎💎💎💎': 200,
  '⭐⭐⭐⭐⭐': 100,
  '🔔🔔🔔🔔🔔': 75,
  '🍇🍇🍇🍇🍇': 50,
  '🍊🍊🍊🍊🍊': 40,
  '🍋🍋🍋🍋🍋': 30,
  '🍒🍒🍒🍒🍒': 25,
  '🎰🎰🎰': 20,
  '🍀🍀🍀': 15
}

function FiveReelSlots() {
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(10)
  const [reels, setReels] = useState(['🍒', '🍋', '🍊', '🍇', '🔔'])
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [message, setMessage] = useState('Place your bet and spin!')
  const [winningLines, setWinningLines] = useState([])
  const spinIntervalRef = useRef(null)

  const spinReel = () => {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  }

  const checkWins = (newReels) => {
    const wins = []
    let totalWin = 0

    // Check each payline
    for (let line of PAYLINES) {
      const lineSymbols = line.map(index => newReels[index])
      const lineStr = lineSymbols.join('')
      
      // Check for matches
      if (lineSymbols.every(s => s === lineSymbols[0])) {
        const symbol = lineSymbols[0]
        const count = lineSymbols.length
        
        // Check for specific payouts
        if (count === 5) {
          const payout = PAYOUTS[lineStr] || 0
          if (payout > 0) {
            wins.push({ line, payout, symbols: lineSymbols })
            totalWin += payout
          }
        } else if (count >= 3) {
          // 3+ of a kind
          const basePayout = PAYOUTS[`${symbol}${symbol}${symbol}`] || 5
          const multiplier = count === 4 ? 2 : count === 5 ? 5 : 1
          const payout = basePayout * multiplier
          wins.push({ line, payout, symbols: lineSymbols })
          totalWin += payout
        }
      }
    }

    // Check for scattered symbols (anywhere on reels)
    const scatterSymbols = ['🎰', '🍀']
    for (let scatter of scatterSymbols) {
      const count = newReels.filter(s => s === scatter).length
      if (count >= 3) {
        const payout = PAYOUTS[scatter.repeat(3)] * (count - 2)
        totalWin += payout
        wins.push({ line: 'scatter', payout, symbols: [scatter], count })
      }
    }

    return { wins, totalWin }
  }

  const handleSpin = () => {
    if (isSpinning || balance < bet) return

    setBalance(prev => prev - bet)
    setIsSpinning(true)
    setWinningLines([])
    setMessage('Spinning...')
    setLastWin(0)

    let spinCount = 0
    const maxSpins = 40 + Math.floor(Math.random() * 20)

    spinIntervalRef.current = setInterval(() => {
      setReels([spinReel(), spinReel(), spinReel(), spinReel(), spinReel()])
      spinCount++

      if (spinCount >= maxSpins) {
        clearInterval(spinIntervalRef.current)
        
        const finalReels = [spinReel(), spinReel(), spinReel(), spinReel(), spinReel()]
        setReels(finalReels)
        
        const { wins, totalWin } = checkWins(finalReels)
        
        setTimeout(() => {
          if (totalWin > 0) {
            setBalance(prev => prev + totalWin)
            setLastWin(totalWin)
            setWinningLines(wins)
            setMessage(`🎉 You won ${totalWin} coins!`)
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
        <h2>🎰 5-Reel Slots</h2>
        <div className="balance-display">
          <span>Balance: {balance} coins</span>
        </div>
      </div>

      <div className="slot-machine">
        <div className={`reels-container five-reels ${winningLines.length > 0 ? 'winning' : ''}`}>
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

        {winningLines.length > 0 && (
          <div className="winning-lines">
            {winningLines.map((win, idx) => (
              <div key={idx} className="win-line-info">
                {win.line !== 'scatter' ? `Line ${win.line.join('-')}` : 'Scatter'} - {win.payout} coins
              </div>
            ))}
          </div>
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
          <h3>Top Payouts:</h3>
          <div className="payouts-list">
            <div className="payout-item">7️⃣7️⃣7️⃣7️⃣7️⃣: 500x bet</div>
            <div className="payout-item">💎💎💎💎💎: 200x bet</div>
            <div className="payout-item">⭐⭐⭐⭐⭐: 100x bet</div>
            <div className="payout-item">3+ Scatters: 15-20x bet</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FiveReelSlots

