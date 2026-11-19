import { useEffect, useRef } from 'react'
import { useStore } from '@/store'

export function useKonamiCode() {
  const { setBujjiMode } = useStore()
  const buffer = useRef<string[]>([])
  const SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      buffer.current.push(e.key)
      if (buffer.current.length > SEQUENCE.length) buffer.current.shift()
      if (buffer.current.join(',') === SEQUENCE.join(',')) {
        setBujjiMode(true)
        buffer.current = []
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setBujjiMode])
}

export function useTabVisibility() {
  const original = document.title
  useEffect(() => {
    const handleVis = () => {
      document.title = document.hidden ? 'Come back, I\'m still building… 👾' : original
    }
    document.addEventListener('visibilitychange', handleVis)
    return () => document.removeEventListener('visibilitychange', handleVis)
  }, [original])
}
