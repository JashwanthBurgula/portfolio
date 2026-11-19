import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'

const WORDS = ['JASHWANTH', 'BURUGULA', 'PORTFOLIO']

export default function Preloader() {
  const { setPreloaderDone } = useStore()
  const [progress, setProgress] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  // typewriter effect per word
  useEffect(() => {
    if (wordIdx >= WORDS.length) return
    const word = WORDS[wordIdx]
    let i = 0
    setDisplayed('')
    const iv = setInterval(() => {
      i++
      setDisplayed(word.slice(0, i))
      if (i >= word.length) {
        clearInterval(iv)
        setTimeout(() => setWordIdx(w => w + 1), 600)
      }
    }, 80)
    return () => clearInterval(iv)
  }, [wordIdx])

  // progress counter
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); return 100 }
        return p + 1
      })
    }, 30)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => { setDone(true); setTimeout(setPreloaderDone, 600) }, 400)
    }
  }, [progress, setPreloaderDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Expanding dot */}
          <motion.div
            className="absolute rounded-full bg-electric-cyan"
            initial={{ width: 8, height: 8, opacity: 1 }}
            animate={{ width: progress < 10 ? 8 : 0, height: progress < 10 ? 8 : 0, opacity: progress < 10 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Typewriter text */}
          <motion.div
            className="font-dot text-5xl md:text-8xl text-electric-cyan tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress >= 10 ? 1 : 0 }}
          >
            {displayed}
            <span className="animate-blink">_</span>
          </motion.div>

          {/* Progress */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-48 h-px bg-white/10 relative overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-electric-cyan" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-mono text-xs text-white/40">{String(progress).padStart(3,'0')}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
