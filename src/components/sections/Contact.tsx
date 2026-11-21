import { useState } from 'react'
import { PERSON } from '@/data'
import { sound } from '@/utils/sound'

function triggerConfetti() {
  const colors = ['#FFFFFF', '#E2E8F0', '#94A3B8', '#34D399']
  for (let i = 0; i < 35; i++) {
    const el = document.createElement('div')
    el.style.cssText = `position:fixed;left:${Math.random() * 100}vw;top:60vh;width:6px;height:6px;background:${colors[i % 4]};border-radius:50%;pointer-events:none;z-index:99999;transition:all 1.4s cubic-bezier(0.16,1,0.3,1);`
    document.body.appendChild(el)
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random() - 0.5) * 260}px, ${-Math.random() * 320 - 80}px) rotate(${Math.random() * 360}deg)`
      el.style.opacity = '0'
    })
    setTimeout(() => el.remove(), 1500)
  }
}

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    sound.playClick()
    navigator.clipboard.writeText(PERSON.email)
    setCopied(true)
    triggerConfetti()
    setTimeout(() => setCopied(false), 2400)
  }

  const scrollToTop = () => {
    sound.playClick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="contact" className="py-28 sm:py-36 border-t border-white/[0.08] bg-[#090A0E] text-[#F8FAFC] select-none scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-12 max-w-7xl relative z-10">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.03] text-white/60 font-mono text-xs uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>AVAILABLE FOR ARCHITECTURE &amp; ROLES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Giant Bold Headline & CTAs (cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h2
              className="font-display font-bold uppercase tracking-tight leading-none text-white"
              style={{ fontSize: 'clamp(44px, 8.5vw, 110px)' }}
            >
              LET'S BUILD<br />
              <span className="text-titanium">
                INTELLIGENT
              </span><br />
              SYSTEMS.
            </h2>

            <p className="font-body text-white/70 text-base sm:text-xl max-w-xl leading-relaxed">
              Available for AI systems architecture consulting, autonomous agent design, and enterprise RAG infrastructure reviews.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={`mailto:${PERSON.email}`}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e8f0] transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <span>Send an email</span>
                <span>↗</span>
              </a>

              <button
                onClick={copyEmail}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/[0.03] text-white font-mono text-xs font-medium uppercase tracking-wider hover:border-white/50 hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <span>{copied ? '✓ Copied to clipboard!' : 'Copy email'}</span>
              </button>
            </div>
          </div>

          {/* Right: Glass Contact Dossier Card (cols 8-12) */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-7 sm:p-9 space-y-6">
              <div>
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-1">
                  DIRECT EMAIL
                </span>
                <a
                  href={`mailto:${PERSON.email}`}
                  onMouseEnter={() => sound.playHover()}
                  className="font-mono text-sm sm:text-base text-white hover:underline underline-offset-4 transition-colors"
                >
                  {PERSON.email}
                </a>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-1">
                  LOCATION &amp; AVAILABILITY
                </span>
                <span className="font-body text-sm sm:text-base text-white">
                  Hyderabad, India · Remote Worldwide
                </span>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-1">
                  CORE SPECIALIZATION
                </span>
                <span className="font-body text-sm text-white/80 leading-relaxed block">
                  Agent Orchestration · Enterprise RAG · Local Inference · Computer Vision
                </span>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-3">
                  EXTERNAL PROFILES
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://github.com/JashwanthBurgula"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    className="px-3.5 py-1.5 rounded-xs border border-white/15 bg-white/[0.02] text-xs font-mono text-white/70 hover:text-white hover:border-white/40 transition-all"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href="https://linkedin.com/in/jashwanth-burgula"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    className="px-3.5 py-1.5 rounded-xs border border-white/15 bg-white/[0.02] text-xs font-mono text-white/70 hover:text-white hover:border-white/40 transition-all"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="/resume.pdf"
                    download
                    onMouseEnter={() => sound.playHover()}
                    className="px-3.5 py-1.5 rounded-xs border border-white/30 bg-white/[0.08] text-xs font-mono text-white hover:bg-white hover:text-black transition-all"
                  >
                    Resume PDF ↓
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="mt-24 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-white/40 font-mono text-xs gap-4">
          <div>
            © 2026 Jashwanth Burugula. Built with React 18, Three.js &amp; GLSL.
          </div>
          <button
            onClick={scrollToTop}
            onMouseEnter={() => sound.playHover()}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Back to top</span>
            <span>↑</span>
          </button>
        </div>

      </div>
    </section>
  )
}
