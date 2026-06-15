import { useState, useEffect, useRef } from 'react'
import './RetroPage.css'
import GamesList from './GamesList.jsx'

function RetroPage() {
  const [activeTab, setActiveTab] = useState('retro') // 'retro' or 'games'
  const [gameSelected, setGameSelected] = useState(false)
  const [gif1Position, setGif1Position] = useState({ x: 50, y: 50 })
  const [gif2Position, setGif2Position] = useState({ x: 150, y: 150 })
  const [gif3Position, setGif3Position] = useState({ x: 250, y: 250 })
  const gif1Ref = useRef(null)
  const gif2Ref = useRef(null)
  const gif3Ref = useRef(null)
  const animationFrameRef = useRef(null)
  const positionsRef = useRef({ gif1: { x: 50, y: 50 }, gif2: { x: 150, y: 150 }, gif3: { x: 250, y: 250 } })
  const velocitiesRef = useRef({ 
    gif1: { vx: 0, vy: 0 }, 
    gif2: { vx: 0, vy: 0 }, 
    gif3: { vx: 0, vy: 0 } 
  })
  const initializedRef = useRef(false)

  useEffect(() => {
    // only bounce the GIFs while the Retro tab is actually showing, and never under reduced motion
    if (activeTab !== 'retro') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (!initializedRef.current) {
      const speed = 3
      velocitiesRef.current = {
        gif1: { 
          vx: (Math.random() > 0.5 ? 1 : -1) * (speed + Math.random() * 1), 
          vy: (Math.random() > 0.5 ? 1 : -1) * (speed + Math.random() * 1) 
        },
        gif2: { 
          vx: (Math.random() > 0.5 ? 1 : -1) * (speed + Math.random() * 1), 
          vy: (Math.random() > 0.5 ? 1 : -1) * (speed + Math.random() * 1) 
        },
        gif3: { 
          vx: (Math.random() > 0.5 ? 1 : -1) * (speed + Math.random() * 1), 
          vy: (Math.random() > 0.5 ? 1 : -1) * (speed + Math.random() * 1) 
        }
      }
      initializedRef.current = true
    }

    const getGifInfo = (ref, currentPos) => {
      if (!ref.current) return null
      const rect = ref.current.getBoundingClientRect()
      return {
        centerX: currentPos.x + rect.width / 2,
        centerY: currentPos.y + rect.height / 2,
        width: rect.width || 150,
        height: rect.height || 150,
        left: currentPos.x,
        top: currentPos.y
      }
    }

    const checkCollision = (gif1Info, gif2Info, minDistance) => {
      const distanceX = gif1Info.centerX - gif2Info.centerX
      const distanceY = gif1Info.centerY - gif2Info.centerY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
      return distance < minDistance
    }

    const calculateNewPosition = (currentPos, gifRef, currentVelocity, otherGifs) => {
      if (!gifRef.current) {
        return { newPos: currentPos, velocity: currentVelocity }
      }

      const defaultSize = 150
      let gifWidth = defaultSize
      let gifHeight = defaultSize

      try {
        const gifRect = gifRef.current.getBoundingClientRect()
        if (gifRect && gifRect.width > 0 && gifRect.height > 0) {
          gifWidth = gifRect.width
          gifHeight = gifRect.height
        } else if (gifRef.current.naturalWidth > 0 && gifRef.current.naturalHeight > 0) {
          gifWidth = gifRef.current.naturalWidth
          gifHeight = gifRef.current.naturalHeight
        }
      } catch (e) {
        console.warn('Error getting image dimensions:', e)
      }

      let vx = currentVelocity.vx
      let vy = currentVelocity.vy
      const speed = Math.sqrt(vx * vx + vy * vy)
      const minSpeed = 10
      
      if (speed < minSpeed) {
        const angle = Math.random() * Math.PI * 2
        vx = Math.cos(angle) * minSpeed
        vy = Math.sin(angle) * minSpeed
      }

      let newX = currentPos.x + vx
      let newY = currentPos.y + vy

      const maxX = window.innerWidth - gifWidth
      const maxY = window.innerHeight - gifHeight

      if (newX <= 0) {
        newX = 0
        vx = -vx
      } else if (newX >= maxX) {
        newX = maxX
        vx = -vx
      }

      if (newY <= 0) {
        newY = 0
        vy = -vy
      } else if (newY >= maxY) {
        newY = maxY
        vy = -vy
      }

      const newGifInfo = {
        centerX: newX + gifWidth / 2,
        centerY: newY + gifHeight / 2,
        width: gifWidth,
        height: gifHeight,
        left: newX,
        top: newY
      }

      const collisionDistance = (gifWidth + gifHeight) / 2 + 10

      for (const otherGif of otherGifs) {
        if (otherGif.ref === gifRef) continue
        
        const otherInfo = getGifInfo(otherGif.ref, otherGif.position)
        if (!otherInfo) continue

        if (checkCollision(newGifInfo, otherInfo, collisionDistance)) {
          const collisionAngle = Math.atan2(
            newGifInfo.centerY - otherInfo.centerY,
            newGifInfo.centerX - otherInfo.centerX
          )
          
          const newAngle = collisionAngle
          
          const speed = Math.sqrt(vx * vx + vy * vy)
          vx = Math.cos(newAngle) * speed
          vy = Math.sin(newAngle) * speed
          
          newX = currentPos.x + vx
          newY = currentPos.y + vy
          
          if (newX < 0) {
            newX = 0
            vx = -vx
          } else if (newX > maxX) {
            newX = maxX
            vx = -vx
          }

          if (newY < 0) {
            newY = 0
            vy = -vy
          } else if (newY > maxY) {
            newY = maxY
            vy = -vy
          }
        }
      }
      
      return { 
        newPos: { x: newX, y: newY }, 
        velocity: { vx, vy } 
      }
    }

    const moveGifs = () => {
      const currentPos1 = positionsRef.current.gif1
      const currentPos2 = positionsRef.current.gif2
      const currentPos3 = positionsRef.current.gif3

      const otherGifs1 = [
        { ref: gif2Ref, position: currentPos2 },
        { ref: gif3Ref, position: currentPos3 }
      ]
      const otherGifs2 = [
        { ref: gif1Ref, position: currentPos1 },
        { ref: gif3Ref, position: currentPos3 }
      ]
      const otherGifs3 = [
        { ref: gif1Ref, position: currentPos1 },
        { ref: gif2Ref, position: currentPos2 }
      ]

      const v1 = velocitiesRef.current.gif1
      const v2 = velocitiesRef.current.gif2
      const v3 = velocitiesRef.current.gif3

      const result1 = calculateNewPosition(currentPos1, gif1Ref, v1, otherGifs1)
      const result2 = calculateNewPosition(currentPos2, gif2Ref, v2, otherGifs2)
      const result3 = calculateNewPosition(currentPos3, gif3Ref, v3, otherGifs3)

      positionsRef.current = { 
        gif1: result1.newPos, 
        gif2: result2.newPos, 
        gif3: result3.newPos 
      }
      velocitiesRef.current = { 
        gif1: result1.velocity, 
        gif2: result2.velocity, 
        gif3: result3.velocity 
      }

      setGif1Position(result1.newPos)
      setGif2Position(result2.newPos)
      setGif3Position(result3.newPos)

      animationFrameRef.current = requestAnimationFrame(moveGifs)
    }

    animationFrameRef.current = requestAnimationFrame(moveGifs)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeTab])

  return (
    <div className="retro-page">
      {!gameSelected && (
        <div className="header-with-tabs">
          <h1>Gabriel's Web Page</h1>
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'retro' ? 'active' : ''}`}
              onClick={() => setActiveTab('retro')}
            >
              Retro
            </button>
            <button 
              className={`tab-button ${activeTab === 'games' ? 'active' : ''}`}
              onClick={() => setActiveTab('games')}
            >
              Games
            </button>
          </div>
        </div>
      )}

      {activeTab === 'retro' && (
        <>
          <div className="animated-elements">
            <img
              ref={gif1Ref}
              src="/simpsons-dance.gif"
              alt="Interactive GIF 1"
              className="interactive-gif"
              style={{
                left: `${gif1Position.x}px`,
                top: `${gif1Position.y}px`
              }}
            />
            <img
              ref={gif2Ref}
              src="/homer-simpson-dancing.gif"
              alt="Interactive GIF 2"
              className="interactive-gif"
              style={{
                left: `${gif2Position.x}px`,
                top: `${gif2Position.y}px`
              }}
            />
            <img
              ref={gif3Ref}
              src="/homer-simpson-homer-dance.gif"
              alt="Interactive GIF 3"
              className="interactive-gif"
              style={{
                left: `${gif3Position.x}px`,
                top: `${gif3Position.y}px`,
                zIndex: 101
              }}
            />
            
            <div className="toaster toaster-1">🍞</div>
            <div className="toaster toaster-2">🍞</div>
            <div className="toaster toaster-3">🍞</div>
            
            <div className="clock clock-1">⏰</div>
            <div className="clock clock-2">⏰</div>
            <div className="clock clock-3">⏰</div>
            <div className="clock clock-4">⏰</div>
            
            <div className="worm worm-1">🐛</div>
            <div className="worm worm-2">🐛</div>
            <div className="worm worm-3">🐛</div>
            <div className="worm worm-4">🐛</div>
            
            <div className="lips lips-1">👄</div>
            <div className="lips lips-2">👄</div>
            
            <div className="bell bell-1">🔔</div>
            <div className="bell bell-2">🔔</div>
            
            <div className="character">👤</div>
          </div>
        </>
      )}

      {activeTab === 'games' && (
        <GamesList onGameSelect={setGameSelected} />
      )}
    </div>
  )
}

export default RetroPage

