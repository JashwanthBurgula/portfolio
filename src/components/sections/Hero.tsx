import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { sound } from '@/utils/sound'

const HeroParticleFace = lazy(() => import('@/components/scenes/HeroParticleFace'))

const TELEMETRY_STATS = [
  {
    num: '10+',
    title: 'Engineers Led',
    sub: 'Direct reports & cross-functional lead at ByteSentinel',
  },
  {
    num: '85%',
    title: 'Latency Cut',
    sub: 'Concurrency pipelines reduced generation from 600s to 90s',
  },
  {
    num: '7-Agent',
    title: 'Autonomous Swarm',
    sub: 'Voice assistant with offline Vosk, Whisper & 3-tier LLM routing',
  },
  {
    num: '92%+',
    title: 'Healthcare CV Accuracy',
    sub: 'Diabetic retinopathy grading via ResNet & EfficientNet pipelines',
  },
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Smooth transforms on scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.95])
  const textTranslateY = useTransform(scrollYProgress, [0, 0.85], [0, -40])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = (clientX / innerWidth) * 2 - 1
    const y = -(clientY / innerHeight) * 2 + 1
    setParallax({ x: x * 20, y: -y * 15 })
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#090A0E] text-[#F8FAFC] select-none pt-24 sm:pt-28 pb-12 sm:pb-16 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Soft Studio Ambient Light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-white/[0.025] rounded-full blur-[140px]" />
      </div>

      <motion.div
        className="container mx-auto px-6 sm:px-12 max-w-7xl relative z-10 flex-1 flex flex-col justify-between"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        
        {/* ── MAIN HERO STAGE: ASYMMETRICAL SPLIT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1 my-auto py-4 sm:py-6">
          
          {/* Left Column (cols 1-6): Monolithic Typography & Executive Dossier */}
          <motion.div
            className="lg:col-span-6 flex flex-col space-y-6"
            style={{ y: textTranslateY }}
          >
            {/* Status & Discipline Tag */}
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs uppercase tracking-widest text-white/50 font-medium">
                AI / ML SYSTEMS LEAD · HYDERABAD, IN
              </span>
            </div>

            {/* Monolithic Swiss Name Headline */}
            <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-[84px] text-white tracking-tight leading-[0.92] uppercase select-none">
              JASHWANTH<br />
              <span className="text-titanium">BURUGULA</span>
            </h1>

            {/* Subtitle / Role */}
            <div className="font-mono text-xs sm:text-sm uppercase tracking-wider text-white/60 font-medium pt-1">
              PRINCIPAL AI &amp; ML SYSTEMS ARCHITECT
            </div>

            {/* Executive Bio */}
            <p className="font-body text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
              Leading a 10-member engineering team at ByteSentinel. Specializing in autonomous multi-agent
              swarms, zero-downtime private RAG architectures on local LLMs, and high-accuracy computer vision pipelines.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                href="#systems"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-xs hover:bg-[#E2E8F0] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <span>Production Systems</span>
                <span>↓</span>
              </a>

              <a
                href="#what-i-build"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 border border-white/20 bg-white/[0.03] text-white font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-xs hover:border-white/50 hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <span>Capabilities</span>
                <span>→</span>
              </a>

              <button
                onClick={() => {
                  sound.playClick()
                  window.dispatchEvent(new CustomEvent('open-cli-terminal'))
                }}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider px-4 py-2.5 rounded-xs hover:border-white/40 hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <span className="text-emerald-400 font-bold">&gt;_</span>
                <span>Terminal</span>
              </button>

              <a
                href="#contact"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white font-mono text-xs uppercase tracking-wider px-3 py-2.5 transition-colors cursor-pointer"
              >
                <span>Direct Contact</span>
                <span>↗</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column (cols 7-12): Enlarged Interactive Stardust Particle Portrait */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]">
            {/* Interactive 3D Stardust Particle Face with Quantum Shockwave & Dynamic Cursor Color Shift */}
            <div className="relative z-10 w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="/jashwanth.png"
                      alt="Jashwanth Burugula - AI/ML Systems Lead"
                      className="max-h-[92%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                    />
                  </div>
                }
              >
                <HeroParticleFace />
              </Suspense>
            </div>
          </div>

        </div>

        {/* ── BOTTOM HUD: 4 FROSTED GLASS TELEMETRY CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08] relative z-20">
          {TELEMETRY_STATS.map((stat) => (
            <div
              key={stat.title}
              onMouseEnter={() => sound.playHover()}
              className="glass-panel bg-[#090A0E]/85 backdrop-blur-xl p-5 rounded-xl flex flex-col justify-between group cursor-default shadow-xl border border-white/[0.08]"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display font-bold text-3xl sm:text-4xl text-white group-hover:text-titanium transition-colors">
                  {stat.num}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition-colors" />
              </div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-white/90 font-semibold mb-1">
                {stat.title}
              </h4>
              <p className="font-body text-xs text-white/50 leading-relaxed">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

      </motion.div>
    </section>
  )
}
