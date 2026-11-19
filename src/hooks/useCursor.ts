import { useEffect, useRef } from 'react'
import { useStore, type CursorState } from '@/store'

export function useCursorTracker() {
  const cursorDot = useRef<HTMLDivElement | null>(null)
  const cursorRing = useRef<HTMLDivElement | null>(null)
  const { cursorState } = useStore()
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const dot = document.getElementById('cursor-dot') as HTMLDivElement
    const ring = document.getElementById('cursor-ring') as HTMLDivElement
    cursorDot.current = dot
    cursorRing.current = ring

    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', move)

    const animate = () => {
      if (dot) { dot.style.left = pos.current.x + 'px'; dot.style.top = pos.current.y + 'px' }
      if (ring) { ring.style.left = pos.current.x + 'px'; ring.style.top = pos.current.y + 'px' }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf.current) }
  }, [])

  return cursorState
}
