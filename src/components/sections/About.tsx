import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { STATS, TERMINAL_LINES, PERSON } from '@/data'
import { useState, useEffect, lazy, Suspense } from 'react'

const About3DScene = lazy(() => import('@/components/scenes/About3DScene'))

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const startTime = performance.now()

    const update = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(easeOut * value))

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }
    const raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return <span>{count}{suffix}</span>
}

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [termLine, setTermLine] = useState(0)

  useEffect(() => {
    if (!inView) return
    const iv = setInterval(() => setTermLine(l => Math.min(l + 1, TERMINAL_LINES.length - 1)), 450)
    return () => clearInterval(iv)
  }, [inView])

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">02 — ABOUT</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-16">
          Building AI<br /><span className="text-gradient">that actually ships.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: 3D particle portrait in grayscale + bio */}
          <div>
            <div className="w-full aspect-[3/4] max-w-sm bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-sm relative overflow-hidden mb-6 filter grayscale">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-xs text-white/30">REFORMING PARTICLES...</div>}>
                <About3DScene />
              </Suspense>
              <div className="absolute bottom-3 left-3 font-mono text-[9px] text-white/40 tracking-wider">
                MONOCHROME PARTICLE MATRIX
              </div>
            </div>
            <p className="font-display text-lg text-warm-white/70 leading-relaxed">{PERSON.bio}</p>
          </div>

          {/* Right: stats + terminal */}
          <div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="border border-white/10 bg-white/5 p-5 rounded-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl font-display font-bold text-electric-cyan mb-1">
                    <AnimatedNumber value={s.value} suffix={s.suffix} inView={inView} />
                  </div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Terminal */}
            <div className="bg-black/60 border border-white/10 rounded-sm p-5 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-signal-red" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-white/30">bash — currently</span>
              </div>
              {TERMINAL_LINES.slice(0, termLine + 1).map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-electric-cyan' : 'text-warm-white/70'}>
                  {line}
                </div>
              ))}
              <span className="text-electric-cyan animate-blink">▮</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
