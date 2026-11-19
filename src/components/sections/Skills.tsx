import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { SKILLS } from '@/data'
import { useStore } from '@/store'

const SkillsSphere3D = lazy(() => import('@/components/scenes/SkillsSphere3D'))

const COLORS: Record<string, string> = {
  'Generative AI & LLMs': '#22D3EE',
  'ML & Deep Learning': '#FF3B30',
  'Backend & APIs': '#A855F7',
  'Databases': '#F59E0B',
  'Frontend & Automation': '#22C55E',
  'DevOps & Cloud': '#6366F1',
  'Voice & Vision': '#EC4899',
}

export default function Skills() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const { setCursorState } = useStore()
  const groups = Object.keys(SKILLS)
  const displayGroups = activeGroup ? [activeGroup] : groups

  return (
    <section id="skills" className="py-32 border-t border-white/5 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">05 — SKILLS</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
          The stack<br /><span className="text-gradient">I think in.</span>
        </h2>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            className={`font-mono text-xs px-3 py-1.5 border rounded-full transition-colors ${
              !activeGroup ? 'border-electric-cyan text-electric-cyan' : 'border-white/20 text-white/40 hover:border-white/40'
            }`}
            onClick={() => setActiveGroup(null)}
          >
            ALL
          </button>
          {groups.map((g) => (
            <button
              key={g}
              className="font-mono text-xs px-3 py-1.5 border rounded-full transition-colors cursor-pointer"
              style={
                activeGroup === g
                  ? { borderColor: COLORS[g], color: COLORS[g], backgroundColor: `${COLORS[g]}15` }
                  : { borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }
              }
              onClick={() => setActiveGroup(activeGroup === g ? null : g)}
              onMouseEnter={() => setCursorState('ring')}
              onMouseLeave={() => setCursorState('default')}
            >
              {g}
            </button>
          ))}
        </div>

        {/* 3D Tech-Sphere & Categorical List Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: 3D Tech-Sphere (5 cols) */}
          <div className="lg:col-span-5">
            <Suspense fallback={<div className="h-[400px] border border-white/10 flex items-center justify-center font-mono text-xs text-white/20">LOADING 3D SPHERE...</div>}>
              <SkillsSphere3D activeCategory={activeGroup} />
            </Suspense>
          </div>

          {/* Right: Categorical skill chip groups (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {displayGroups.map((group) => (
              <motion.div
                key={group}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-white/5 pb-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[group] }} />
                  <span className="font-mono text-xs text-white/50 uppercase tracking-widest font-bold">
                    {group}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(SKILLS as Record<string, string[]>)[group].map((skill) => (
                    <motion.span
                      key={`${group}-${skill}`}
                      className="px-3 py-1.5 border border-white/10 bg-white/5 font-mono text-xs text-warm-white/80 rounded-xs hover:border-opacity-80 transition-all cursor-default"
                      whileHover={{ scale: 1.05, borderColor: COLORS[group], color: COLORS[group] }}
                      onMouseEnter={() => setCursorState('ring')}
                      onMouseLeave={() => setCursorState('default')}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
