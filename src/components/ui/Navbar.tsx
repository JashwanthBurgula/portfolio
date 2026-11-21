import { useState, useEffect } from 'react'
import { sound } from '@/utils/sound'

const NAV_LINKS = [
  { label: 'OVERVIEW', href: '#hero', id: 'hero' },
  { label: 'ABOUT', href: '#about', id: 'about' },
  { label: 'CAPABILITIES', href: '#what-i-build', id: 'what-i-build' },
  { label: 'SYSTEMS', href: '#systems', id: 'systems' },
  { label: 'CONTACT', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [activeId, setActiveId] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const [soundActive, setSoundActive] = useState(false)

  // Real-time local clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setTimeStr(`${formatted} IST`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 30)

      const viewH = window.innerHeight
      const contactEl = document.getElementById('contact')
      const systemsEl = document.getElementById('systems') || document.getElementById('work')
      const buildEl = document.getElementById('what-i-build')
      const aboutEl = document.getElementById('about')

      if (contactEl && contactEl.getBoundingClientRect().top <= viewH * 0.4) {
        setActiveId('contact')
      } else if (systemsEl && systemsEl.getBoundingClientRect().top <= viewH * 0.4) {
        setActiveId('systems')
      } else if (buildEl && buildEl.getBoundingClientRect().top <= viewH * 0.4) {
        setActiveId('what-i-build')
      } else if (aboutEl && aboutEl.getBoundingClientRect().top <= viewH * 0.4) {
        setActiveId('about')
      } else {
        setActiveId('hero')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleToggleSound = () => {
    const isNowOn = sound.toggle()
    setSoundActive(isNowOn)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 transition-all duration-300 select-none ${
        isScrolled
          ? 'bg-[#090A0E]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent'
      }`}
    >
      {/* Left: Brand Monogram & Status */}
      <a
        href="#hero"
        className="flex items-center gap-3 group"
        onMouseEnter={() => sound.playHover()}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
        <span className="font-display font-semibold text-sm sm:text-base tracking-wider text-white uppercase group-hover:text-white/80 transition-colors">
          JASHWANTH&nbsp;&nbsp;BURUGULA
        </span>
      </a>

      {/* Center: Clean Nav Links with Active Indicator */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {NAV_LINKS.map((link) => {
          const isActive = activeId === link.id
          return (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className={`font-mono text-xs uppercase tracking-widest transition-all duration-200 relative py-1 ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </a>
          )
        })}
      </nav>

      {/* Right: Clock + Sound Toggle + Resume */}
      <div className="flex items-center gap-4 sm:gap-6 mr-12 sm:mr-20">
        {/* Real-time IST Clock */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-white/50 border border-white/10 px-3 py-1 rounded-full bg-white/[0.02]">
          <span>{timeStr || '23:45:00 IST'}</span>
        </div>

        {/* Web Audio Synthesizer Toggle */}
        <button
          onClick={handleToggleSound}
          onMouseEnter={() => sound.playHover()}
          className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border transition-all cursor-pointer ${
            soundActive
              ? 'border-white bg-white text-black font-semibold'
              : 'border-white/15 text-white/50 hover:text-white hover:border-white/30'
          }`}
          title="Toggle UI Sound Effects (Synthesized via Web Audio API)"
        >
          <span>AUDIO: {soundActive ? 'ON' : 'OFF'}</span>
        </button>

        {/* Resume Button */}
        <a
          href="/resume.pdf"
          download
          onMouseEnter={() => sound.playHover()}
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-white border border-white/20 bg-white/[0.05] px-3.5 py-1.5 rounded-xs hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          <span>RESUME</span>
          <span>↓</span>
        </a>
      </div>
    </header>
  )
}
