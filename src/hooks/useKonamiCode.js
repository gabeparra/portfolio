import { useEffect } from 'react'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function useKonamiCode(onKonamiCode) {
  useEffect(() => {
    let keySequence = []

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'a' ? e.key.toLowerCase() : e.key

      keySequence.push(key)

      if (keySequence.length > KONAMI_CODE.length) {
        keySequence.shift()
      }

      if (keySequence.join(',') === KONAMI_CODE.join(',')) {
        onKonamiCode()
        keySequence = []
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onKonamiCode])
}

