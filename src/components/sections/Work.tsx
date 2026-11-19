import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '@/data'
import { useStore } from '@/store'

// Lazy-load the 3D corridor and the 7 interactive 3D worlds
const WorkDoorsCorridor = lazy(() => import('@/components/scenes/WorkDoorsCorridor'))
const Bujji3DWorld = lazy(() => import('@/components/scenes/worlds/Bujji3DWorld'))
const MarketingConstellation3D = lazy(() => import('@/components/scenes/worlds/MarketingConstellation3D'))
const ERPBuilding3D = lazy(() => import('@/components/scenes/worlds/ERPBuilding3D'))
const RetinaEye3D = lazy(() => import('@/components/scenes/worlds/RetinaEye3D'))
const PlantDisease3D = lazy(() => import('@/components/scenes/worlds/PlantDisease3D'))
const JobEmbedding3D = lazy(() => import('@/components/scenes/worlds/JobEmbedding3D'))
const DNAHelix3D = lazy(() => import('@/components/scenes/worlds/DNAHelix3D'))

const WORLD_COMPONENTS = [
  Bujji3DWorld,
  MarketingConstellation3D,
  ERPBuilding3D,
  RetinaEye3D,
  PlantDisease3D,
  JobEmbedding3D,
  DNAHelix3D,
]

export default function Work() {
  const [openProject, setOpenProject] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'problem' | 'build' | 'result'>('problem')
  const { setCursorState } = useStore()

  const handleNextWorld = (currentIndex: number) => {
    const next = (currentIndex + 1) % PROJECTS.length
    setOpenProject(next)
    setActiveTab('problem')
  }

  return (
    <section id="work" className="py-32 border-t border-white/5 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">
          04 — SELECTED WORK
        </div>
        <h2 className="text-4xl md:text-7xl font-display font-bold mb-4">
          Enter the<br /><span className="text-gradient">Worlds.</span>
        </h2>
        <p className="font-mono text-sm text-white/40 mb-10 max-w-xl">
          Magic happens behind the doors. Each project exists in its own 3D universe — with distinct visual architectures, live shaders, and interactive controls.
        </p>

        {/* 3D Portal Corridor */}
        <div className="mb-14">
          <Suspense fallback={<div className="h-48 border border-white/10 flex items-center justify-center font-mono text-xs text-white/20">LOADING PORTAL CORRIDOR...</div>}>
            <WorkDoorsCorridor
              activeProjectIndex={openProject}
              onSelectProject={(idx) => {
                setOpenProject(idx)
                setActiveTab('problem')
              }}
            />
          </Suspense>
        </div>

        {/* 7 Project Accordion Worlds */}
        <div className="space-y-6">
          {PROJECTS.map((project, i) => {
            const WorldComponent = WORLD_COMPONENTS[i]
            const isOpen = openProject === i

            return (
              <motion.div
                key={project.id}
                className="border border-white/10 bg-black/40 overflow-hidden rounded-sm transition-colors duration-300"
                style={{ borderColor: isOpen ? project.color + '60' : 'rgba(255,255,255,0.08)' }}
                layout
              >
                {/* Project Header Bar */}
                <button
                  className="w-full flex items-center gap-6 p-6 text-left hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => {
                    setOpenProject(isOpen ? -1 : i)
                    setActiveTab('problem')
                  }}
                  onMouseEnter={() => setCursorState('open')}
                  onMouseLeave={() => setCursorState('default')}
                >
                  <span className="font-mono text-xs text-white/30 w-8 flex-shrink-0">
                    {project.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-display font-bold text-xl md:text-2xl text-warm-white group-hover:text-electric-cyan transition-colors truncate">
                        {project.title}
                      </h3>
                      <span className="font-mono text-xs text-white/40 hidden md:block flex-shrink-0">
                        {project.subtitle}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-white/40 mt-1 hidden md:block">
                      {project.pitch}
                    </p>
                  </div>
                  {/* Glowing color accent node */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                      background: project.color,
                      boxShadow: isOpen ? `0 0 16px ${project.color}` : 'none',
                    }}
                  />
                  <span
                    className="font-mono text-white/30 text-lg transition-transform duration-300 flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(45deg)' : '' }}
                  >
                    +
                  </span>
                </button>

                {/* Expanded Interactive World */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 border-t border-white/5">
                        <div className="grid lg:grid-cols-12 gap-8 mt-6 items-start">
                          {/* Left: Dedicated Interactive 3D World (7 cols) */}
                          <div className="lg:col-span-7">
                            <Suspense
                              fallback={
                                <div className="w-full h-[460px] border border-white/10 bg-black/60 flex items-center justify-center font-mono text-xs text-white/30">
                                  INITIALIZING 3D WORLD...
                                </div>
                              }
                            >
                              <WorldComponent />
                            </Suspense>
                          </div>

                          {/* Right: Story tabs, metrics, tech chips, next door (5 cols) */}
                          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            <div>
                              {/* 3-Step Story Reveal Tabs */}
                              <div className="flex border border-white/10 mb-4 rounded-sm overflow-hidden">
                                {(['problem', 'build', 'result'] as const).map((tab) => (
                                  <button
                                    key={tab}
                                    className={`flex-1 font-mono text-xs py-2 uppercase tracking-widest transition-all ${
                                      activeTab === tab
                                        ? 'text-black font-bold shadow-sm'
                                        : 'text-white/40 hover:text-white/70'
                                    }`}
                                    style={{
                                      background: activeTab === tab ? project.color : 'transparent',
                                    }}
                                    onClick={() => setActiveTab(tab)}
                                  >
                                    {tab}
                                  </button>
                                ))}
                              </div>

                              <AnimatePresence mode="wait">
                                <motion.p
                                  key={activeTab}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="font-display text-sm md:text-base text-warm-white/80 leading-relaxed mb-6 min-h-[96px]"
                                >
                                  {project[activeTab]}
                                </motion.p>
                              </AnimatePresence>

                              {/* Key Metrics Grid */}
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                {project.metrics.map((m) => (
                                  <div
                                    key={m.label}
                                    className="border border-white/10 bg-white/5 p-3 rounded-sm"
                                  >
                                    <div
                                      className="font-display font-bold text-xl"
                                      style={{ color: project.color }}
                                    >
                                      {m.value}
                                    </div>
                                    <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider mt-0.5">
                                      {m.label}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Tech Stack Chip Row */}
                              <div className="mb-6">
                                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2">
                                  TECH ARSENAL
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {project.tech.map((t) => (
                                    <span
                                      key={t}
                                      className="font-mono text-[10px] px-2.5 py-1 border border-white/10 bg-white/5 text-white/60 rounded-xs"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* "Next world →" Navigation Door */}
                            <div className="pt-4 border-t border-white/5 flex justify-end">
                              <button
                                onClick={() => handleNextWorld(i)}
                                className="flex items-center gap-2 font-mono text-xs font-bold text-electric-cyan hover:text-white transition-colors border border-electric-cyan/40 px-4 py-2 hover:border-electric-cyan"
                                onMouseEnter={() => setCursorState('ring')}
                                onMouseLeave={() => setCursorState('default')}
                              >
                                <span>NEXT WORLD ({PROJECTS[(i + 1) % PROJECTS.length].title})</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
