import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store'
import { PERSON } from '@/data'

const Hero3DScene = lazy(() => import('@/components/scenes/Hero3DScene'))

const ROLES = ['AI/ML Engineer', 'Generative AI Engineer', 'LLM & RAG Developer', 'Team Lead']

export default function Hero() {
  const { setCursorState } = useStore()
  const [roleIdx, setRoleIdx] = useState(0)
  const [roleText, setRoleText] = useState('')
  const [typing, setTyping] = useState(true)

  // Typewriter for roles
  useEffect(() => {
    const role = ROLES[roleIdx]
    let i = 0
    setRoleText('')
    setTyping(true)
    const iv = setInterval(() => {
      i++
      setRoleText(role.slice(0, i))
      if (i >= role.length) {
        clearInterval(iv)
        setTyping(false)
        setTimeout(() => setRoleIdx(r => (r + 1) % ROLES.length), 2000)
      }
    }, 60)
    const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3
    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)'
    setCursorState('default')
  }

  return () => clearInterval(iv)
  }, [roleIdx])

  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3
    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)'
    setCursorState('default')
  }

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(#22D3EE 1px, transparent 1px), linear-gradient(90deg, #22D3EE 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT: Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">
            &gt; HELLO, WORLD_
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-none mb-4 text-warm-white">
            Hi, I'm<br />
            <span className="text-gradient">Jashwanth.</span>
          </h1>

          {/* Rotating role card */}
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse-slow" />
            <span className="font-mono text-sm text-warm-white/80">
              {roleText}{typing ? <span className="animate-blink">|</span> : null}
            </span>
          </div>

          {/* Dot-matrix tagline */}
          <div className="font-dot text-2xl md:text-4xl text-electric-cyan mb-8 tracking-widest">
            AI THAT SHIPS
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#work"
              className="px-8 py-3.5 bg-electric-cyan text-black font-mono text-sm font-bold tracking-widest hover:bg-white transition-all duration-200 cursor-pointer will-change-transform shadow-lg shadow-cyan-500/20"
              onMouseMove={handleMagneticMove}
              onMouseEnter={() => setCursorState('ring')}
              onMouseLeave={handleMagneticLeave}
            >
              VIEW MY WORK →
            </a>
            <a
              href="mailto:jashwanthburgula@gmail.com"
              className="px-8 py-3.5 border border-white/20 text-warm-white font-mono text-sm tracking-widest hover:border-electric-cyan hover:text-electric-cyan transition-all duration-200 cursor-pointer will-change-transform"
              onMouseMove={handleMagneticMove}
              onMouseEnter={() => setCursorState('ring')}
              onMouseLeave={handleMagneticLeave}
            >
              HIRE ME
            </a>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="mt-16 flex items-center gap-2 text-white/30 font-mono text-xs"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>SCROLL</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* RIGHT: Portrait */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Giant outlined name BEHIND */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span
              className="font-display font-black text-7xl md:text-[10rem] select-none whitespace-nowrap"
              style={{ color: 'transparent', WebkitTextStroke: '1px rgba(242,240,235,0.08)' }}
            >
              JASHWANTH
            </span>
          </div>

          {/* Portrait box with 3D Canvas */}
          <div className="relative z-10 w-80 h-[480px] md:w-[420px] md:h-[540px] border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col justify-between overflow-hidden shadow-2xl shadow-cyan-950/20 backdrop-blur-xs">
            <div className="absolute inset-0 z-0">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-xs text-electric-cyan/40">INITIALIZING 3D ENGINE...</div>}>
                <Hero3DScene />
              </Suspense>
            </div>

            {/* Top biometric corner marks */}
            <div className="relative z-20 flex justify-between p-3 pointer-events-none">
              <span className="font-mono text-[9px] text-electric-cyan/50">SYS:ONLINE</span>
              <span className="font-mono text-[9px] text-white/30">DEPTH:ACTIVE</span>
            </div>

            {/* "AI ENGINEER" label IN FRONT (Sandwiched over 3D portrait) */}
            <div className="relative z-20 w-full px-5 pb-5 pointer-events-none">
              <span className="inline-block font-display font-black text-2xl md:text-3xl text-warm-white bg-bg/90 backdrop-blur-md px-4 py-1.5 border border-white/10 tracking-wider">
                AI ENGINEER
              </span>
            </div>
          </div>

          {/* Floating badges */}
          {[
            { label: '7 Agents', icon: '🤖', pos: 'top-4 -left-8' },
            { label: '92%+ Acc', icon: '🎯', pos: 'top-20 -right-8' },
            { label: '<3% CPU', icon: '⚡', pos: 'bottom-24 -left-10' },
            { label: 'RAG + LLM', icon: '🧠', pos: 'bottom-8 -right-8' },
          ].map((b) => (
            <motion.div
              key={b.label}
              className={`absolute ${b.pos} bg-bg border border-white/10 backdrop-blur-sm px-3 py-1.5 rounded-sm z-20`}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
            >
              <span className="font-mono text-xs text-electric-cyan">{b.icon} {b.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
