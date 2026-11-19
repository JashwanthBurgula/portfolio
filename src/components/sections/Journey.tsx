import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { JOURNEY } from '@/data'

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: ref })

  return (
    <section id="journey" className="py-32 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">06 — JOURNEY</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold">
          Let's go back<br /><span className="text-gradient">in time.</span>
        </h2>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={ref}
        className="flex overflow-x-auto gap-8 pb-8 px-12 snap-x snap-mandatory relative"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Giant year behind */}
        <div className="absolute left-0 font-display font-black text-[20rem] text-white/[0.02] pointer-events-none select-none leading-none top-1/2 -translate-y-1/2 whitespace-nowrap">
          {JOURNEY.map(j => j.year).join('  ')}
        </div>

        {JOURNEY.map((item, i) => (
          <motion.div
            key={i}
            className="snap-center flex-shrink-0 w-80 border border-white/10 bg-white/5 backdrop-blur-sm p-6 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Connector line */}
            {i < JOURNEY.length - 1 && (
              <div className="absolute top-1/2 -right-8 w-8 h-px bg-electric-cyan/30" />
            )}
            <div className="font-mono text-xs text-electric-cyan mb-3">{item.year}</div>
            <h3 className="font-display text-xl font-bold text-warm-white mb-1">{item.title}</h3>
            <div className="font-mono text-xs text-signal-red mb-3">{item.org}</div>
            <p className="font-display text-sm text-warm-white/50 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
