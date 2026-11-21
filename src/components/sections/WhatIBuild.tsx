import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { sound } from '@/utils/sound'

const WhatIBuild3DScene = lazy(() => import('@/components/scenes/WhatIBuild3DScene'))

const CAPABILITIES = [
  {
    num: '01',
    title: 'Agentic AI & Multi-Agent Swarms',
    desc: 'Autonomous multi-agent orchestration with LangChain, intelligent model routing, and self-healing execution fallbacks.',
  },
  {
    num: '02',
    title: 'Enterprise RAG & Private Knowledge Systems',
    desc: 'Zero-downtime retrieval-augmented generation on locally hosted DeepSeek-R1 and Qwen2.5 over ChromaDB vector embeddings.',
  },
  {
    num: '03',
    title: 'Real-Time Voice & Conversational AI',
    desc: 'Sub-second offline Vosk wake word (<3% CPU), Whisper speech recognition, and bilingual LLM routing in English and Telugu.',
  },
  {
    num: '04',
    title: 'Computer Vision & Applied Healthcare ML',
    desc: 'End-to-end retinal image diagnostic pipelines grading 5 severity classes with ResNet, EfficientNet and 92%+ classification accuracy.',
  },
]

export default function WhatIBuild() {
  const [activeIdx, setActiveIdx] = useState<number>(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const current = hoveredIdx !== null ? hoveredIdx : activeIdx

  return (
    <section
      id="what-i-build"
      className="relative w-full py-24 sm:py-32 bg-[#090A0E] text-[#F8FAFC] overflow-hidden select-none scroll-mt-20"
    >
      <div className="container mx-auto px-6 sm:px-12 max-w-7xl">
        
        {/* ── TOP-RIGHT TITLE HEADER ── */}
        <div className="flex flex-col items-end mb-16 sm:mb-20">
          <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            <span>02 / CAPABILITIES</span>
          </div>
          <h2
            className="font-display font-bold text-titanium text-right uppercase tracking-tight leading-none"
            style={{ fontSize: 'clamp(44px, 7.5vw, 105px)' }}
          >
            CAN DO
          </h2>
        </div>

        {/* ── MAIN CONTENT: ROWS + SHARED 3D CANVAS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* 4 Rows (Left cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col border-b border-white/[0.08]">
            {CAPABILITIES.map((item, idx) => {
              const isHovered = hoveredIdx === idx
              const isActive = activeIdx === idx
              const isExpanded = isHovered || isActive

              return (
                <div
                  key={item.num}
                  className="relative border-t border-white/[0.08] transition-all duration-300 cursor-pointer overflow-hidden group hover:bg-white/[0.02]"
                  onClick={() => {
                    setActiveIdx(idx)
                    sound.playClick()
                  }}
                  onMouseEnter={() => {
                    setHoveredIdx(idx)
                    sound.playHover()
                  }}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Clean white line sweeps across top border on hover */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[1.5px] bg-white origin-left shadow-[0_0_12px_#ffffff] z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Row content */}
                  <div
                    className="flex flex-col justify-center py-7 sm:py-9 px-4 sm:px-6 transition-all duration-400"
                    style={{ minHeight: isExpanded ? '190px' : '135px' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-6 sm:gap-10">
                        {/* Number */}
                        <span className="font-mono text-sm sm:text-base font-semibold text-white/50 group-hover:text-white tracking-wider transition-colors">
                          {item.num}
                        </span>

                        {/* Title in Clash Display */}
                        <motion.h3
                          className="font-display font-medium text-2xl sm:text-3xl lg:text-[38px] text-white tracking-tight leading-snug"
                          animate={{ x: isExpanded ? 12 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.title}
                        </motion.h3>
                      </div>

                      {/* Diagonal Arrow (↗) */}
                      <motion.div
                        className="text-white/40 group-hover:text-white text-xl sm:text-2xl font-mono flex-shrink-0 transition-colors"
                        animate={{
                          x: isExpanded ? 6 : 0,
                          y: isExpanded ? -6 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        ↗
                      </motion.div>
                    </div>

                    {/* Description (fades in on hover/expand) */}
                    {isExpanded && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                        className="font-body text-white/60 text-sm sm:text-base max-w-xl pl-12 sm:pl-16 mt-3 leading-relaxed"
                      >
                        {item.desc}
                      </motion.p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 3D Glass Model Stage (Right cols 8-12) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl glass-panel overflow-hidden">
              {/* Corner decorative bracket */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/40 z-10 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/40 z-10 pointer-events-none" />

              {/* Top status indicator */}
              <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>TOPOLOGY {CAPABILITIES[current].num} / 04</span>
              </div>

              {/* R3F 3D Canvas */}
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-white/30">
                    INITIALIZING 3D TOPOLOGY...
                  </div>
                }
              >
                <WhatIBuild3DScene activeIndex={current} />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
