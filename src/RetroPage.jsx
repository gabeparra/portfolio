import { useState, useEffect, useRef } from 'react'
import './RetroPage.css'

function RetroPage() {
  const [gif1Position, setGif1Position] = useState({ x: 50, y: 50 })
  const [gif2Position, setGif2Position] = useState({ x: 150, y: 150 })
  const [gif3Position, setGif3Position] = useState({ x: 250, y: 250 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const gif1Ref = useRef(null)
  const gif2Ref = useRef(null)
  const gif3Ref = useRef(null)
  const animationFrameRef = useRef(null)
  const positionsRef = useRef({ gif1: { x: 50, y: 50 }, gif2: { x: 150, y: 150 }, gif3: { x: 250, y: 250 } })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

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

    const calculateNewPosition = (currentPos, gifRef, otherGifs) => {
      if (!gifRef.current) return currentPos

      const gifRect = gifRef.current.getBoundingClientRect()
      
      const defaultSize = 150
      const gifWidth = gifRect.width > 0 ? gifRect.width : defaultSize
      const gifHeight = gifRect.height > 0 ? gifRect.height : defaultSize

      const gifCenterX = currentPos.x + gifWidth / 2
      const gifCenterY = currentPos.y + gifHeight / 2

      const screenCenterX = window.innerWidth / 2
      const screenCenterY = window.innerHeight / 2

      const distanceX = mousePosition.x - gifCenterX
      const distanceY = mousePosition.y - gifCenterY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      const avoidDistance = 150
      const centerSeekDistance = 300
      const collisionDistance = (gifWidth + gifHeight) / 2 + 20
      let newX = currentPos.x
      let newY = currentPos.y
      let deltaX = 0
      let deltaY = 0

      if (distance < avoidDistance && distance > 0) {
        const angle = Math.atan2(distanceY, distanceX)
        const moveSpeed = (avoidDistance - distance) / 5
        deltaX = -Math.cos(angle) * moveSpeed
        deltaY = -Math.sin(angle) * moveSpeed
      } 
      else if (distance > centerSeekDistance || (mousePosition.x === 0 && mousePosition.y === 0)) {
        const centerDistX = screenCenterX - gifWidth / 2 - currentPos.x
        const centerDistY = screenCenterY - gifHeight / 2 - currentPos.y
        const centerDistance = Math.sqrt(centerDistX * centerDistX + centerDistY * centerDistY)
        
        if (centerDistance > 10) {
          const centerAngle = Math.atan2(centerDistY, centerDistX)
          const centerSpeed = Math.min(centerDistance / 30, 3)
          deltaX = Math.cos(centerAngle) * centerSpeed
          deltaY = Math.sin(centerAngle) * centerSpeed
        }
      }

      newX = currentPos.x + deltaX
      newY = currentPos.y + deltaY

      const newGifInfo = {
        centerX: newX + gifWidth / 2,
        centerY: newY + gifHeight / 2,
        width: gifWidth,
        height: gifHeight,
        left: newX,
        top: newY
      }

      for (const otherGif of otherGifs) {
        if (otherGif.ref === gifRef) continue
        
        const otherInfo = getGifInfo(otherGif.ref, otherGif.position)
        if (!otherInfo) continue

        if (checkCollision(newGifInfo, otherInfo, collisionDistance)) {
          const collisionAngle = Math.atan2(
            newGifInfo.centerY - otherInfo.centerY,
            newGifInfo.centerX - otherInfo.centerX
          )
          const avoidSpeed = (collisionDistance - Math.sqrt(
            Math.pow(newGifInfo.centerX - otherInfo.centerX, 2) +
            Math.pow(newGifInfo.centerY - otherInfo.centerY, 2)
          )) / 3
          
          newX += Math.cos(collisionAngle) * avoidSpeed
          newY += Math.sin(collisionAngle) * avoidSpeed
          
          newGifInfo.centerX = newX + gifWidth / 2
          newGifInfo.centerY = newY + gifHeight / 2
          newGifInfo.left = newX
          newGifInfo.top = newY
        }
      }

      const padding = Math.max(10, window.innerWidth * 0.02)
      const maxX = window.innerWidth - gifWidth - padding
      const maxY = window.innerHeight - gifHeight - padding

      if (newX < padding) {
        newX = padding
      } else if (newX > maxX) {
        newX = maxX
      }

      if (newY < padding) {
        newY = padding
      } else if (newY > maxY) {
        newY = maxY
      }

      return { x: newX, y: newY }
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

      const newPos1 = calculateNewPosition(currentPos1, gif1Ref, otherGifs1)
      const newPos2 = calculateNewPosition(currentPos2, gif2Ref, otherGifs2)
      const newPos3 = calculateNewPosition(currentPos3, gif3Ref, otherGifs3)

      positionsRef.current = { gif1: newPos1, gif2: newPos2, gif3: newPos3 }

      setGif1Position(newPos1)
      setGif2Position(newPos2)
      setGif3Position(newPos3)

      animationFrameRef.current = requestAnimationFrame(moveGifs)
    }

    animationFrameRef.current = requestAnimationFrame(moveGifs)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mousePosition])

  return (
    <div className="retro-page">
      <h1>Gabriel's Web Page</h1>
      
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
          src="/OIP.webp"
          alt="Interactive GIF 3"
          className="interactive-gif"
          style={{
            left: `${gif3Position.x}px`,
            top: `${gif3Position.y}px`
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
      
      <div className="content">
        <p>Welcome to my portfolio!</p>
      </div>
    </div>
  )
}

export default RetroPage

