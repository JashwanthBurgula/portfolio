import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'

export default function BreakItGlitchZone() {
  const [stress, setStress] = useState<number>(0)
  const [glitching, setGlitching] = useState<boolean>(false)
  const [broken, setBroken] = useState<boolean>(false)
  const { bujjiMode, setBujjiMode, setCursorState } = useStore()

  const handleInjectChaos = () => {
    setGlitching(true)
    setStress((prev) => {
      const next = prev + 25
      if (next >= 100) {
        setBroken(true)
        setBujjiMode(true)
        return 100
      }
      return next
    })
    setTimeout(() => setGlitching(false), 600)
  }

  const handleReset = () => {
    setStress(0)
    setBroken(false)
  }

  return (
    <section id="break-it" className="py-20 border-t border-white/5 relative overflow-hidden bg-black/60">
      <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
        <div className="font-mono text-xs text-signal-red mb-3 tracking-widest uppercase">
          &gt; EXPERIMENTAL STRESS BENCH_
        </div>

        <h2 className={`font-dot text-3xl md:text-5xl text-warm-white tracking-widest mb-4 ${glitching ? 'translate-x-1 text-signal-red' : ''}`}>
          {broken ? '⚠️ CRITICAL OVERLOAD: BUJJI PROTOCOL ENGAGED' : 'BREAK IT IF YOU CAN'}
        </h2>

        <p className="font-mono text-xs text-white/40 max-w-md mx-auto mb-8">
          Interactive client-side stress test. Push system clock frequencies, stress GPU shaders, and test fault containment.
        </p>

        {/* Stress meter */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between font-mono text-xs text-white/40 mb-2">
            <span>CORE STRESS:</span>
            <span className={stress > 70 ? 'text-signal-red font-bold' : 'text-electric-cyan'}>
              {stress}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-xs overflow-hidden">
            <motion.div
              className={`h-full ${stress > 70 ? 'bg-signal-red' : 'bg-electric-cyan'}`}
              animate={{ width: `${stress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!broken ? (
            <>
              <button
                onClick={handleInjectChaos}
                className="px-6 py-3 border border-signal-red text-signal-red font-mono text-xs font-bold tracking-widest hover:bg-signal-red hover:text-white transition-colors cursor-pointer"
                onMouseEnter={() => setCursorState('ring')}
                onMouseLeave={() => setCursorState('default')}
              >
                💥 INJECT GLITCH (+25%)
              </button>
              <button
                onClick={() => setBujjiMode(!bujjiMode)}
                className="px-6 py-3 border border-electric-cyan text-electric-cyan font-mono text-xs font-bold tracking-widest hover:bg-electric-cyan hover:text-black transition-colors cursor-pointer"
                onMouseEnter={() => setCursorState('ring')}
                onMouseLeave={() => setCursorState('default')}
              >
                👾 TOGGLE BUJJI HUD
              </button>
            </>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-green-400 text-green-300 font-mono text-xs font-bold tracking-widest hover:bg-green-400 hover:text-black transition-colors cursor-pointer"
            >
              🔄 RESTORE SYSTEM INTEGRITY
            </button>
          )}
        </div>

        <div className="mt-8 font-mono text-[10px] text-white/20">
          PRO-TIP: Enter the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) anywhere to trigger secret Bujji Mode
        </div>
      </div>
    </section>
  )
}
