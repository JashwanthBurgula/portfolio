import { useStore } from '@/store'

export default function ScrollCounter() {
  const { section } = useStore()
  const current = String(Math.min(section + 1, 9)).padStart(2, '0')

  return (
    <div className="fixed bottom-6 left-6 z-40 font-mono text-xs select-none tabular-nums flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 border border-white/5 rounded-xs">
      <span className="text-electric-cyan font-bold">{current}</span>
      <span className="text-white/20">/</span>
      <span className="text-white/30">09</span>
    </div>
  )
}
