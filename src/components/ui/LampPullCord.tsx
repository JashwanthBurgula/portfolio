import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useStore } from '@/store'
import { sound } from '@/utils/sound'

export default function LampPullCord() {
  const { theme, toggleTheme } = useStore()
  const [isPulling, setIsPulling] = useState(false)
  const [lampFlash, setLampFlash] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Motion value for Y displacement
  const y = useMotionValue(0)
  const springY = useSpring(y, { stiffness: 450, damping: 18 })

  // Cord height stretches dynamically with pull
  const cordHeight = useTransform(springY, (latest) => 120 + Math.max(0, latest))

  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    setIsPulling(false)
    if (info.offset.y > 30) {
      triggerSwitch()
    }
    y.set(0)
  }

  const triggerSwitch = () => {
    sound.playLampClick()
    setLampFlash(true)
    setTimeout(() => setLampFlash(false), 350)
    toggleTheme()
    setHasInteracted(true)
  }

  const handleClick = () => {
    // Animate a quick tactile pull-down and release
    y.set(45)
    setTimeout(() => {
      triggerSwitch()
      y.set(0)
    }, 120)
  }

  return (
    <>
      {/* Light Bulb Flash / Ambient Glow on Switch */}
      {lampFlash && (
        <div
          className={`fixed inset-0 pointer-events-none z-[120] transition-opacity duration-300 ${
            theme === 'dark'
              ? 'bg-amber-100/30 backdrop-brightness-125'
              : 'bg-black/40 backdrop-brightness-75'
          }`}
        />
      )}

      {/* Hanging Lamp Cord Component */}
      <div className="fixed top-0 right-6 sm:right-12 z-[95] flex flex-col items-center pointer-events-auto select-none group">
        
        {/* Ceiling Mount Fixture */}
        <div
          className={`w-5 h-2 rounded-b-md transition-colors duration-300 shadow-md ${
            theme === 'dark'
              ? 'bg-[#2A2E39] border border-white/20'
              : 'bg-[#D1D5DB] border border-black/15'
          }`}
        />

        {/* Dynamic Cord Line */}
        <motion.div
          style={{ height: cordHeight }}
          className={`w-[2px] transition-colors duration-300 relative ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-white/30 via-amber-200/50 to-white/60'
              : 'bg-gradient-to-b from-black/30 via-amber-700/40 to-black/60'
          }`}
        >
          {/* Subtle bead spacing rings along the cord */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
        </motion.div>

        {/* Weighted Lamp Knob / Handle */}
        <motion.div
          style={{ y: springY }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 65 }}
          dragElastic={0.3}
          onDragStart={() => setIsPulling(true)}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          onMouseEnter={() => sound.playHover()}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-grab active:cursor-grabbing flex flex-col items-center -mt-0.5"
        >
          {/* Weighted Cylindrical Metallic Knob */}
          <div
            className={`w-4 h-9 rounded-full border shadow-xl flex flex-col items-center justify-between py-1 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-[#E2E8F0] via-[#94A3B8] to-[#475569] border-white/40 shadow-[0_6px_16px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-b from-[#475569] via-[#1E293B] to-[#0F172A] border-black/20 shadow-[0_6px_16px_rgba(0,0,0,0.2)] text-white'
            }`}
          >
            {/* Knurled Grip Rings */}
            <div className="w-2.5 h-[1px] bg-black/30" />
            <div className="w-2.5 h-[1px] bg-black/30" />
            <div className="w-2.5 h-[1px] bg-black/30" />
          </div>

          {/* Lower Teardrop Weight */}
          <div
            className={`w-2.5 h-2.5 rounded-full -mt-1 shadow-md transition-colors ${
              theme === 'dark'
                ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
            }`}
          />

          {/* Floating Tooltip Hint (Visible on hover or first visit) */}
          <div
            className={`absolute top-11 right-1/2 translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md transition-all duration-200 pointer-events-none shadow-lg ${
              isPulling || lampFlash
                ? 'opacity-100 scale-100'
                : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
            } ${
              theme === 'dark'
                ? 'bg-black/90 text-amber-300 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-white/95 text-slate-900 border-slate-300 shadow-md'
            }`}
          >
            <span>{theme === 'dark' ? '💡 Pull for Light Mode' : '🌙 Pull for Dark Mode'}</span>
          </div>

          {!hasInteracted && (
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute -bottom-6 font-mono text-[8px] text-amber-400/80 tracking-widest uppercase whitespace-nowrap pointer-events-none"
            >
              [PULL]
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  )
}
