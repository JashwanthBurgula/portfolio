import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'

export default function Preloader() {
  const { setPreloaderDone } = useStore()
  const [phase, setPhase] = useState<'dot' | 'name' | 'dissolve'>('dot')

  useEffect(() => {
    // 0.4s: Dot expands into name
    const t1 = setTimeout(() => setPhase('name'), 400)
    // 1.8s: Start dissolve transition
    const t2 = setTimeout(() => setPhase('dissolve'), 1800)
    // 2.3s: Preloader unmounts completely
    const t3 = setTimeout(() => setPreloaderDone(), 2300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [setPreloaderDone])

  return (
    <AnimatePresence>
      {phase !== 'dissolve' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070709] select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {phase === 'dot' && (
            <motion.div
              className="w-3.5 h-3.5 rounded-full bg-[#FF3B30] shadow-[0_0_25px_rgba(255,59,48,0.9)]"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 2.0, 1.0], opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          )}

          {phase === 'name' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-4"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/50">
                  INITIALIZING ARCHITECTURE
                </span>
              </div>

              {/* Giant Chrome Name (matching reference video) */}
              <h1 className="font-display font-semibold text-6xl sm:text-8xl md:text-9xl tracking-tight text-chrome uppercase leading-none">
                JASHWANTH
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="flex items-center justify-center gap-4 mt-4 font-mono text-xs text-white/60 tracking-[0.25em]"
              >
                <span>PORTFOLIO // 2026</span>
                <span className="w-1 h-1 rounded-full bg-[#FF3B30]" />
                <span className="text-[#FF3B30]">AI/ML ENGINEER</span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
