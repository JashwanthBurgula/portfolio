'use client'

import { useEffect } from 'react'
import { useStore } from '@/store'

const SECTIONS = [
  { id: 'hero', label: '01 HERO' },
  { id: 'about', label: '02 ABOUT' },
  { id: 'what-i-build', label: '03 WHAT I BUILD' },
  { id: 'work', label: '04 WORK' },
  { id: 'skills', label: '05 SKILLS' },
  { id: 'journey', label: '06 JOURNEY' },
  { id: 'certifications', label: '07 CERTS' },
  { id: 'break-it', label: '08 STRESS' },
  { id: 'contact', label: '09 CONTACT' },
]

export default function ProgressRail() {
  const { section, setSection } = useStore()

  useEffect(() => {
    const handleScroll = () => {
      const viewH = window.innerHeight

      let active = 0
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= viewH * 0.45) active = i
        }
      })
      setSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setSection])

  return (
    <div
      id="progress-rail"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-2.5 pointer-events-auto"
    >
      {SECTIONS.map((s, i) => {
        const isActive = section === i
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`Go to section ${s.label}`}
            className="group flex items-center gap-2 cursor-pointer"
          >
            {/* Tooltip on hover */}
            <span className="font-mono text-[9px] text-electric-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1.5 py-0.5 border border-electric-cyan/30 rounded-xs">
              {s.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-1.5 h-6 bg-electric-cyan shadow-[0_0_10px_2px_#22D3EE]'
                  : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/60'
              }`}
            />
          </a>
        )
      })}
    </div>
  )
}
