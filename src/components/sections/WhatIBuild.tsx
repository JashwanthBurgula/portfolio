import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WHAT_I_BUILD } from '@/data'
import { useStore } from '@/store'

const WhatIBuild3DScene = lazy(() => import('@/components/scenes/WhatIBuild3DScene'))

export default function WhatIBuild() {
  const [open, setOpen] = useState<number>(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const { setCursorState } = useStore()

  const currentActive = hovered !== null ? hovered : open

  return (
    <section id="what-i-build" className="py-32 border-t border-white/5 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">03 — WHAT I BUILD</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-16">
          Intelligence,<br /><span className="text-gradient">engineered.</span>
        </h2>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Accordion list */}
          <div className="lg:col-span-8 space-y-0">
            {WHAT_I_BUILD.map((item, i) => (
              <div
                key={item.num}
                className="border-t border-white/10 group cursor-pointer relative"
                onClick={() => setOpen(i)}
                onMouseEnter={() => {
                  setHovered(i)
                  setCursorState('ring')
                }}
                onMouseLeave={() => {
                  setHovered(null)
                  setCursorState('default')
                }}
              >
                {/* Red hover & active slide line */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-signal-red"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: open === i || hovered === i ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                />

                <div className="flex items-center gap-6 py-7 pl-6 pr-4 relative">
                  {/* Glitch number */}
                  <span className="font-mono text-sm tracking-wider text-white/30 group-hover:text-signal-red group-hover:translate-x-0.5 transition-all">
                    {item.num}
                  </span>
                  <h3 className="flex-1 text-xl md:text-3xl font-display font-semibold text-warm-white group-hover:text-electric-cyan transition-colors">
                    {item.title}
                  </h3>
                  <span
                    className="font-mono text-white/40 text-xl transition-transform duration-300"
                    style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </div>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pl-14 pr-6 text-warm-white/70 font-display text-base md:text-lg leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>

          {/* Right: Real-time 3D loop for active/hovered capability */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center p-6 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm">
            <div className="font-mono text-[9px] text-electric-cyan/60 tracking-widest uppercase mb-2">
              REAL-TIME 3D TOPOLOGY
            </div>
            <Suspense fallback={<div className="w-48 h-48 flex items-center justify-center font-mono text-xs text-white/20">LOADING 3D LOOP...</div>}>
              <WhatIBuild3DScene activeIndex={currentActive} />
            </Suspense>
            <div className="font-mono text-xs text-white/40 mt-3 text-center">
              {WHAT_I_BUILD[currentActive].title}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
