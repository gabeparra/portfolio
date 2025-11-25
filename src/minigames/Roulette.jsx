import { useState, useEffect, useRef } from 'react'
import './Roulette.css'

const NUMBERS = [
  { num: 0, color: 'green' },
  { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' },
  { num: 4, color: 'black' }, { num: 21, color: 'red' }, { num: 2, color: 'black' },
  { num: 25, color: 'red' }, { num: 17, color: 'black' }, { num: 34, color: 'red' },
  { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
  { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' },
  { num: 8, color: 'black' }, { num: 23, color: 'red' }, { num: 10, color: 'black' },
  { num: 5, color: 'red' }, { num: 24, color: 'black' }, { num: 16, color: 'red' },
  { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
  { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' },
  { num: 22, color: 'black' }, { num: 18, color: 'red' }, { num: 29, color: 'black' },
  { num: 7, color: 'red' }, { num: 28, color: 'black' }, { num: 12, color: 'red' },
  { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
]

const BET_TYPES = {
  'red': { label: 'Red', payout: 2, numbers: NUMBERS.filter(n => n.color === 'red').map(n => n.num) },
  'black': { label: 'Black', payout: 2, numbers: NUMBERS.filter(n => n.color === 'black').map(n => n.num) },
  'green': { label: 'Green (0)', payout: 36, numbers: [0] },
  'even': { label: 'Even', payout: 2, numbers: NUMBERS.filter(n => n.num !== 0 && n.num % 2 === 0).map(n => n.num) },
  'odd': { label: 'Odd', payout: 2, numbers: NUMBERS.filter(n => n.num !== 0 && n.num % 2 === 1).map(n => n.num) },
  '1-18': { label: '1-18', payout: 2, numbers: Array.from({ length: 18 }, (_, i) => i + 1) },
  '19-36': { label: '19-36', payout: 2, numbers: Array.from({ length: 18 }, (_, i) => i + 19) }
}

function Roulette() {
  const [balance, setBalance] = useState(1000)
  const [betAmount, setBetAmount] = useState(10)
  const [selectedBets, setSelectedBets] = useState({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningNumber, setWinningNumber] = useState(null)
  const [lastWin, setLastWin] = useState(0)
  const [message, setMessage] = useState('Place your bets!')
  const [spinAngle, setSpinAngle] = useState(0)
  const spinIntervalRef = useRef(null)

  const handleBet = (betType) => {
    if (isSpinning || balance < betAmount) return
    
    const betKey = Object.keys(BET_TYPES).find(key => 
      BET_TYPES[key].label.toLowerCase().replace(' (0)', '').replace('-', '-') === betType
    ) || betType
    
    setSelectedBets(prev => ({
      ...prev,
      [betKey]: (prev[betKey] || 0) + betAmount
    }))
    
    setBalance(prev => prev - betAmount)
  }

  const handleBetAmountChange = (amount) => {
    if (isSpinning) return
    const newBet = Math.max(1, Math.min(balance, betAmount + amount))
    setBetAmount(newBet)
  }

  const clearBets = () => {
    if (isSpinning) return
    const totalBets = Object.values(selectedBets).reduce((sum, bet) => sum + bet, 0)
    setBalance(prev => prev + totalBets)
    setSelectedBets({})
  }

  const spin = () => {
    const totalBets = Object.values(selectedBets).reduce((sum, bet) => sum + bet, 0)
    if (isSpinning || totalBets === 0) return

    setIsSpinning(true)
    setMessage('Spinning...')
    setLastWin(0)
    setWinningNumber(null)

    let currentAngle = spinAngle
    const spins = 5 + Math.random() * 3 // 5-8 full rotations
    const finalAngle = spins * 360 + Math.random() * 360
    const targetNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
    
    let frame = 0
    const totalFrames = 120

    spinIntervalRef.current = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const easeOut = 1 - Math.pow(1 - progress, 3) // Easing function
      currentAngle = spinAngle + finalAngle * easeOut
      setSpinAngle(currentAngle % 360)

      if (frame >= totalFrames) {
        clearInterval(spinIntervalRef.current)
        setWinningNumber(targetNumber)
        setSpinAngle((spinAngle + finalAngle) % 360)
        
        // Calculate wins
        let totalWin = 0
        for (let [betType, bet] of Object.entries(selectedBets)) {
          const betInfo = BET_TYPES[betType]
          if (betInfo && betInfo.numbers.includes(targetNumber.num)) {
            totalWin += bet * betInfo.payout
          }
        }

        setTimeout(() => {
          if (totalWin > 0) {
            setBalance(prev => prev + totalWin)
            setLastWin(totalWin)
            setMessage(`🎉 ${targetNumber.num} ${targetNumber.color}! You won ${totalWin} coins!`)
          } else {
            setMessage(`💔 ${targetNumber.num} ${targetNumber.color}. Better luck next time!`)
          }
          setIsSpinning(false)
          setSelectedBets({})
        }, 500)
      }
    }, 16)
  }

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current)
      }
    }
  }, [])

  const getTotalBets = () => {
    return Object.values(selectedBets).reduce((sum, bet) => sum + bet, 0)
  }

  const getWheelRotation = () => {
    const numberIndex = NUMBERS.findIndex(n => n.num === winningNumber?.num)
    const baseRotation = (360 / NUMBERS.length) * numberIndex
    return spinAngle - baseRotation
  }

  return (
    <div className="roulette-container">
      <div className="roulette-header">
        <h2>🎡 Roulette</h2>
        <div className="balance-display">
          Balance: {balance} coins
        </div>
      </div>

      <div className="roulette-game-area">
        <div className="wheel-container">
          <div 
            className="roulette-wheel"
            style={{ transform: `rotate(${getWheelRotation()}deg)` }}
          >
            {NUMBERS.map((number, index) => {
              const angle = (360 / NUMBERS.length) * index
              return (
                <div
                  key={number.num}
                  className={`wheel-number ${number.color} ${winningNumber?.num === number.num ? 'winning' : ''}`}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-150px) rotate(${-angle}deg)`
                  }}
                >
                  {number.num}
                </div>
              )
            })}
          </div>
          <div className="wheel-pointer"></div>
        </div>

        <div className="roulette-info">
          <div className="message-display">{message}</div>
          {lastWin > 0 && (
            <div className="win-display">+{lastWin} coins!</div>
          )}
          {winningNumber && (
            <div className="winning-number-display">
              Winning Number: <span className={`number-${winningNumber.color}`}>{winningNumber.num}</span>
            </div>
          )}
        </div>
      </div>

      <div className="roulette-controls">
        <div className="bet-amount-controls">
          <span>Bet Amount: {betAmount} coins</span>
          <div className="bet-buttons">
            <button onClick={() => handleBetAmountChange(-5)} disabled={isSpinning || betAmount <= 1}>-5</button>
            <button onClick={() => handleBetAmountChange(-1)} disabled={isSpinning || betAmount <= 1}>-1</button>
            <button onClick={() => handleBetAmountChange(1)} disabled={isSpinning || betAmount >= balance}>+1</button>
            <button onClick={() => handleBetAmountChange(5)} disabled={isSpinning || betAmount >= balance}>+5</button>
          </div>
        </div>

        <div className="bet-types">
          <h3>Place Your Bets:</h3>
          <div className="bet-types-grid">
            {Object.entries(BET_TYPES).map(([key, betInfo]) => {
              const bet = selectedBets[key] || 0
              return (
                <button
                  key={key}
                  onClick={() => handleBet(key)}
                  disabled={isSpinning || balance < betAmount}
                  className={`bet-type-btn ${bet > 0 ? 'active' : ''}`}
                >
                  <div>{betInfo.label}</div>
                  <div className="bet-info">
                    {bet > 0 && <span className="bet-amount">{bet}</span>}
                    <span className="payout">({betInfo.payout}x)</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={clearBets} disabled={isSpinning || getTotalBets() === 0} className="clear-bets-btn">
            Clear Bets ({getTotalBets()})
          </button>
          <button onClick={spin} disabled={isSpinning || getTotalBets() === 0} className="spin-btn">
            {isSpinning ? 'SPINNING...' : 'SPIN'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Roulette

