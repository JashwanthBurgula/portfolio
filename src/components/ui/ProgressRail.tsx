import { useEffect } from 'react'
import { useStore } from '@/store'
import { sound } from '@/utils/sound'

const SECTIONS = [
  { id: 'hero', label: '01 OVERVIEW', num: '01' },
  { id: 'about', label: '02 ABOUT', num: '02' },
  { id: 'what-i-build', label: '03 CAPABILITIES', num: '03' },
  { id: 'systems', label: '04 SYSTEMS', num: '04' },
  { id: 'contact', label: '05 CONTACT', num: '05' },
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
          if (rect.top <= viewH * 0.5) active = i
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
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3.5 pointer-events-auto select-none"
    >
      {SECTIONS.map((s, i) => {
        const isActive = section === i
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`Go to section ${s.label}`}
            onMouseEnter={() => sound.playHover()}
            onClick={() => sound.playClick()}
            className="group flex items-center gap-2.5 cursor-pointer"
          >
            {/* Tooltip on hover */}
            <span className="font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#090A0E]/95 px-2.5 py-0.5 border border-white/15 rounded-xs tracking-wider shadow-md">
              {s.label}
            </span>

            {/* Indicator pill/dot */}
            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono text-[11px] transition-colors duration-300 ${
                  isActive ? 'text-white font-bold' : 'text-white/20 group-hover:text-white/50'
                }`}
              >
                {s.num}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2 h-5 bg-white shadow-[0_0_10px_#ffffff]'
                    : 'w-1.5 h-1.5 bg-white/15 group-hover:bg-white/40'
                }`}
              />
            </div>
          </a>
        )
      })}
    </div>
  )
}
