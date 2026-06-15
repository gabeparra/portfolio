import { useEffect, useRef } from 'react'

// Living starfield: 3 parallax layers, twinkle, shooting stars, and a rare UFO flyby.
// Renders behind all content (fixed, pointer-events: none).
function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width, height, dpr
    let stars = []
    let shootingStar = null
    let nextShootAt = 0
    let ufo = null
    let nextUfoAt = 0
    let rafId
    let lastT = performance.now()

    const LAYERS = [
      { count: 150, speed: 2.2, size: [0.4, 1.0], alpha: [0.25, 0.6] },
      { count: 70,  speed: 5.5, size: [0.8, 1.6], alpha: [0.4, 0.85] },
      { count: 28,  speed: 11,  size: [1.2, 2.2], alpha: [0.6, 1.0] },
    ]

    const rand = (a, b) => a + Math.random() * (b - a)

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedStars()
      // in reduced-motion the loop never runs, so paint a static frame on every resize
      if (reduceMotion) frame(performance.now())
    }

    function seedStars() {
      stars = []
      LAYERS.forEach((layer, li) => {
        for (let i = 0; i < layer.count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: rand(layer.size[0], layer.size[1]),
            baseA: rand(layer.alpha[0], layer.alpha[1]),
            phase: Math.random() * Math.PI * 2,
            twinkle: rand(0.5, 2.2),
            speed: layer.speed,
            layer: li,
            // a few stars get a color tint
            hue: Math.random() < 0.08 ? (Math.random() < 0.5 ? 'rgba(252,61,33,' : 'rgba(110,243,214,') : 'rgba(214,228,255,',
          })
        }
      })
    }

    function spawnShootingStar(now) {
      const fromTop = Math.random() < 0.7
      shootingStar = {
        x: rand(width * 0.1, width * 0.9),
        y: fromTop ? -20 : rand(0, height * 0.3),
        vx: rand(-420, -260) * (Math.random() < 0.5 ? 1 : -1),
        vy: rand(180, 320),
        life: 0,
        maxLife: rand(0.7, 1.2),
      }
      nextShootAt = now + rand(6000, 16000)
    }

    function spawnUfo(now) {
      const ltr = Math.random() < 0.5
      ufo = {
        x: ltr ? -60 : width + 60,
        y: rand(height * 0.08, height * 0.45),
        vx: (ltr ? 1 : -1) * rand(40, 70),
        bobPhase: Math.random() * Math.PI * 2,
        blink: 0,
      }
      nextUfoAt = now + rand(60000, 140000)
    }

    function drawUfo(u, t) {
      const bob = Math.sin(t / 400 + u.bobPhase) * 4
      const x = u.x
      const y = u.y + bob
      ctx.save()
      // beam shimmer (very subtle)
      const beam = ctx.createLinearGradient(x, y, x, y + 46)
      beam.addColorStop(0, 'rgba(138,255,128,0.10)')
      beam.addColorStop(1, 'rgba(138,255,128,0)')
      ctx.fillStyle = beam
      ctx.beginPath()
      ctx.moveTo(x - 7, y + 4)
      ctx.lineTo(x + 7, y + 4)
      ctx.lineTo(x + 16, y + 46)
      ctx.lineTo(x - 16, y + 46)
      ctx.closePath()
      ctx.fill()
      // dome
      ctx.beginPath()
      ctx.fillStyle = 'rgba(170,235,255,0.85)'
      ctx.ellipse(x, y - 5, 7, 5.5, 0, Math.PI, 0)
      ctx.fill()
      // saucer body
      ctx.beginPath()
      ctx.fillStyle = 'rgba(146,164,190,0.95)'
      ctx.ellipse(x, y, 17, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      // running lights
      const lights = [-10, 0, 10]
      lights.forEach((off, i) => {
        const on = Math.floor(t / 220) % 3 === i
        ctx.beginPath()
        ctx.fillStyle = on ? 'rgba(138,255,128,1)' : 'rgba(138,255,128,0.25)'
        ctx.arc(x + off, y + 3, 1.6, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    }

    function frame(now) {
      const dt = Math.min((now - lastT) / 1000, 0.05)
      lastT = now
      ctx.clearRect(0, 0, width, height)

      // stars
      for (const s of stars) {
        if (!reduceMotion) {
          s.x -= s.speed * dt
          if (s.x < -4) { s.x = width + 4; s.y = Math.random() * height }
        }
        const tw = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(now / 1000 * s.twinkle + s.phase)
        ctx.beginPath()
        ctx.fillStyle = s.hue + (s.baseA * tw) + ')'
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduceMotion) {
        // shooting star
        if (!shootingStar && now > nextShootAt) spawnShootingStar(now)
        if (shootingStar) {
          const ss = shootingStar
          ss.life += dt
          ss.x += ss.vx * dt
          ss.y += ss.vy * dt
          const fade = Math.max(0, 1 - ss.life / ss.maxLife)
          const tx = ss.x - ss.vx * 0.18
          const ty = ss.y - ss.vy * 0.18
          const grad = ctx.createLinearGradient(ss.x, ss.y, tx, ty)
          grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`)
          grad.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(ss.x, ss.y)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          if (ss.life > ss.maxLife || ss.x < -50 || ss.x > width + 50 || ss.y > height + 50) shootingStar = null
        }

        // UFO
        if (!ufo && now > nextUfoAt) spawnUfo(now)
        if (ufo) {
          ufo.x += ufo.vx * dt
          drawUfo(ufo, now)
          if (ufo.x < -80 || ufo.x > width + 80) ufo = null
        }
      }

      // keep the loop alive only while animating and the tab is visible
      if (!reduceMotion && !document.hidden) rafId = requestAnimationFrame(frame)
    }

    function onVisibility() {
      if (reduceMotion) return
      if (document.hidden) {
        cancelAnimationFrame(rafId)
      } else {
        lastT = performance.now()
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(frame)
      }
    }

    resize()
    nextShootAt = performance.now() + rand(2500, 7000)
    nextUfoAt = performance.now() + rand(20000, 45000)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    // reduced motion: paint one static frame and skip the animation loop entirely
    if (reduceMotion) frame(performance.now())
    else rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}

export default Starfield
