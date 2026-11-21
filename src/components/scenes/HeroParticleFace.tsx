import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { sound } from '@/utils/sound'
import { useStore } from '@/store'

export default function HeroParticleFace({
  className = '',
}: {
  className?: string
}) {
  const { theme } = useStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  // Normalized cursor coordinates (-1 to 1) relative to container center
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Ultra-fluid spring physics with realistic inertia and natural deceleration
  const springConfig = { damping: 24, stiffness: 175, mass: 0.55 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // 3D Perspective Tilt Angles (Pitch & Yaw)
  const rotateX = useTransform(springY, [-1, 1], [10, -10])
  const rotateY = useTransform(springX, [-1, 1], [-12, 12])

  // Parallax Layer Offsets
  const cardTranslateX = useTransform(springX, [-1, 1], [-6, 6])
  const cardTranslateY = useTransform(springY, [-1, 1], [-5, 5])

  // Studio rim light position (tracks the cursor in 3D space behind the silhouette)
  const glowX = useTransform(springX, [-1, 1], [55, -55])
  const glowY = useTransform(springY, [-1, 1], [40, -40])

  // Directional shadow offset responding to dynamic cursor light source
  const shadowOffsetX = useTransform(springX, [-1, 1], [12, -12])

  // Screen-wide mouse glide tracking
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const maxDistX = window.innerWidth * 0.5
      const maxDistY = window.innerHeight * 0.5

      const normX = Math.max(-1.15, Math.min(1.15, (e.clientX - centerX) / maxDistX))
      const normY = Math.max(-1.15, Math.min(1.15, (e.clientY - centerY) / maxDistY))

      mouseX.set(normX)
      mouseY.set(normY)
    }

    const handlePointerLeaveWindow = () => {
      // Smoothly float back to center rest position
      mouseX.set(0)
      mouseY.set(0)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeaveWindow)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeaveWindow)
    }
  }, [mouseX, mouseY])

  const handleMouseEnter = () => {
    setIsHovered(true)
    sound.playHover()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = () => {
    sound.playPortalWarp()
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 700)
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative w-full h-full flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* ── 3D PERSPECTIVE TILT STAGE ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: cardTranslateX,
          y: cardTranslateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[460px] sm:max-w-[540px] lg:max-w-[620px] flex items-center justify-center py-4"
      >
        {/* ── LAYER 0: ARCHITECTURAL RETICLE RINGS (DEPTH ANCHOR) ── */}
        <div
          className="absolute w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none flex items-center justify-center opacity-35 transition-opacity duration-500"
          style={{ transform: 'translateZ(-50px)' }}
        >
          <div
            className={`w-full h-full rounded-full border ${
              theme === 'dark' ? 'border-white/[0.08]' : 'border-black/[0.08]'
            } transition-colors`}
          />
          <div
            className={`absolute w-[78%] h-[78%] rounded-full border border-dashed ${
              theme === 'dark' ? 'border-white/[0.06]' : 'border-black/[0.06]'
            } animate-[spin_80s_linear_infinite] transition-colors`}
          />
          <div
            className={`absolute w-[56%] h-[56%] rounded-full border ${
              theme === 'dark' ? 'border-white/[0.04]' : 'border-black/[0.05]'
            } transition-colors`}
          />
        </div>

        {/* ── LAYER 1: DYNAMIC STUDIO RIM LIGHT & BACKLIGHT GLOW ── */}
        <motion.div
          style={{
            x: glowX,
            y: glowY,
            transform: 'translateZ(-30px)',
          }}
          className={`absolute w-[380px] h-[380px] sm:w-[450px] sm:h-[450px] rounded-full blur-[90px] pointer-events-none transition-all duration-700 ${
            theme === 'dark'
              ? isHovered
                ? 'bg-gradient-to-tr from-white/28 via-amber-300/20 to-cyan-400/12 opacity-95 scale-110'
                : 'bg-gradient-to-tr from-white/14 via-amber-300/09 to-cyan-400/05 opacity-60 scale-100'
              : isHovered
                ? 'bg-gradient-to-tr from-amber-500/22 via-orange-300/22 to-slate-400/18 opacity-90 scale-110'
                : 'bg-gradient-to-tr from-amber-500/12 via-orange-300/10 to-slate-400/10 opacity-55 scale-100'
          }`}
        />

        {/* ── LAYER 2: STUDIO FLOOR AMBIENT CONTACT SHADOW ── */}
        <div
          style={{ transform: 'translateZ(-10px)' }}
          className={`absolute bottom-4 w-[340px] sm:w-[420px] h-[36px] rounded-[100%] blur-[26px] pointer-events-none transition-opacity duration-500 ${
            theme === 'dark'
              ? 'bg-black/90 opacity-80'
              : 'bg-slate-900/25 opacity-70'
          }`}
        />

        {/* ── LAYER 3: RAZOR-SHARP PHOTOGRAPHIC PORTRAIT (100% CLEAN - ZERO PARTICLES) ── */}
        <motion.div
          style={{
            transform: 'translateZ(30px)',
          }}
          className="relative z-10 w-full flex items-end justify-center select-none"
        >
          <img
            src="/jashwanth.png"
            alt="Jashwanth Burugula - AI Systems Architect"
            className={`w-full h-auto object-contain select-none transition-all duration-500 [mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)] ${
              isHovered
                ? theme === 'dark'
                  ? 'filter brightness-105 contrast-108 saturate-105 drop-shadow-[0_20px_50px_rgba(255,255,255,0.20)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.92)]'
                  : 'filter brightness-102 contrast-106 saturate-102 drop-shadow-[0_20px_45px_rgba(15,23,42,0.18)]'
                : theme === 'dark'
                  ? 'filter brightness-100 contrast-105 drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)]'
                  : 'filter brightness-100 contrast-105 drop-shadow-[0_25px_45px_rgba(15,23,42,0.12)]'
            }`}
            draggable={false}
          />
        </motion.div>

        {/* ── TACTILE CLICK IMPULSE WAVE ── */}
        {isClicked && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0.9 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{ transform: 'translateZ(40px)' }}
            className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border-2 border-emerald-400/60 pointer-events-none z-30"
          />
        )}
      </motion.div>
    </div>
  )
}
