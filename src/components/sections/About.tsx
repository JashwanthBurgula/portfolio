import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { sound } from '@/utils/sound'

// Animated Stat Counter
function StatCounter({
  target,
  prefix = '',
  suffix = '',
  label,
  inView,
}: {
  target: number
  prefix?: string
  suffix?: string
  label: string
  inView: boolean
}) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(easeOut * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  return (
    <div
      onMouseEnter={() => sound.playHover()}
      className="flex flex-col py-4 px-3 sm:px-6 group cursor-default"
    >
      <div className="font-display font-bold text-4xl sm:text-5xl lg:text-[60px] text-white leading-none mb-2 tracking-tight group-hover:text-titanium transition-colors">
        {prefix}{val}{suffix}
      </div>
      <div className="font-body text-xs sm:text-sm text-white/50 leading-snug">
        {label}
      </div>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen pt-28 sm:pt-36 pb-24 sm:pb-32 bg-[#090A0E] text-[#F8FAFC] overflow-hidden select-none border-t border-white/[0.08] scroll-mt-20"
    >
      <div className="container mx-auto px-6 sm:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ── LEFT: COLS 1-5 (EXECUTIVE TITLE & ENGINEERING DOSSIER) ── */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            {/* Tiny mono label */}
            <div className="font-mono text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              <span>01 / ABOUT</span>
            </div>

            {/* Giant "ABOUT" in titanium metallic headline style */}
            <motion.h2
              className="font-display font-bold text-titanium leading-none uppercase select-none tracking-tight"
              style={{ fontSize: 'clamp(64px, 10vw, 130px)' }}
              initial={{ clipPath: 'inset(100% 0 0 0)', y: 30 }}
              animate={inView ? { clipPath: 'inset(0% 0 0 0)', y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              ABOUT
            </motion.h2>

            <p className="font-mono text-xs text-white/70 uppercase tracking-widest font-semibold">
              AI/ML SYSTEMS LEAD &amp; MULTI-AGENT ARCHITECT
            </p>

            {/* Executive Engineering Dossier Card */}
            <div className="w-full glass-panel rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="font-mono text-[11px] text-white/40 uppercase tracking-widest border-b border-white/[0.08] pb-3 flex items-center justify-between">
                <span>SYSTEM DOSSIER</span>
                <span className="text-white font-medium">HYDERABAD, IN</span>
              </div>

              <div className="space-y-3.5 font-body text-sm">
                <div>
                  <span className="font-mono text-[11px] text-white/40 block mb-0.5">SPECIALIZATION</span>
                  <span className="text-white/90 font-medium">Generative AI, Multi-Agent Swarms, Local LLM Inference</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-white/40 block mb-0.5">CORE STACK</span>
                  <span className="text-white/90 font-medium">Python, LangChain, Ollama, ChromaDB, FastAPI, Docker, PyTorch</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-white/40 block mb-0.5">LEADERSHIP ROLE</span>
                  <span className="text-white/90 font-medium">Team Lead @ ByteSentinel (10-Member Engineering Team)</span>
                </div>
                <div>
                  <span className="font-mono text-[11px] text-white/40 block mb-0.5">ACADEMIC BACKGROUND</span>
                  <span className="text-white/90 font-medium">B.Tech in Computer Science &amp; Engineering (Final Year)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-white/40">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AVAILABLE FOR ROLES
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: COLS 6-12 (PITCH CARD & LIVE STAT COUNTERS) ── */}
          <div className="lg:col-span-7 flex flex-col space-y-10">
            
            {/* Glassmorphism Pitch Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[24px] p-8 sm:p-10 relative overflow-hidden"
              onMouseEnter={() => sound.playHover()}
            >
              {/* Line 1: Large Statement */}
              <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-5 tracking-tight leading-snug">
                I build AI that ships.
              </h3>

              {/* Paragraph */}
              <p className="font-body text-base sm:text-lg text-white/75 leading-relaxed mb-8">
                I'm an AI/ML Engineer and final-year B.Tech student who leads a 10-member team at ByteSentinel,
                building agentic AI, RAG systems and enterprise platforms on locally hosted LLMs.
                I also created Bujji, a voice-first desktop assistant, and shipped computer-vision models for healthcare.
              </p>

              {/* Status Row with Subtle Indicator */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <span className="font-mono text-xs sm:text-sm text-white/80 tracking-wide font-medium">
                  Currently: Team Lead @ ByteSentinel · Hyderabad
                </span>
              </div>
            </motion.div>

            {/* 4 Animated Stat Counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-white/[0.08] border-y border-white/[0.08] py-4"
            >
              <StatCounter
                target={10}
                label="Engineers led"
                inView={inView}
              />
              <StatCounter
                target={85}
                prefix="~"
                suffix="%"
                label="Faster AI content generation"
                inView={inView}
              />
              <StatCounter
                target={92}
                suffix="%+"
                label="Healthcare CV accuracy"
                inView={inView}
              />
              <StatCounter
                target={9}
                suffix="/10"
                label="Roadmap phases shipped"
                inView={inView}
              />
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}
