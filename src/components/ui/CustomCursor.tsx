import { useStore } from '@/store'

export default function CustomCursor() {
  const { cursorState } = useStore()
  return (
    <>
      <div id="cursor-dot" />
      <div
        id="cursor-ring"
        className={`flex items-center justify-center font-mono text-[9px] uppercase tracking-widest text-electric-cyan font-bold pointer-events-none select-none ${
          cursorState !== 'default' ? cursorState : ''
        }`}
      >
        {cursorState === 'open' && 'OPEN'}
        {cursorState === 'drag' && 'DRAG'}
        {cursorState === 'magnify' && 'VIEW'}
      </div>
    </>
  )
}
