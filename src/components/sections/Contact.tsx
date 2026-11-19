import { useState } from 'react'
import { motion } from 'framer-motion'
import { PERSON } from '@/data'
import { useStore } from '@/store'

function confetti() {
  // Simple confetti: create 30 colored divs that fly up and fade
  const colors = ['#22D3EE', '#FF3B30', '#F2F0EB', '#A855F7']
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div')
    el.style.cssText = `position:fixed;left:${Math.random() * 100}vw;top:50vh;width:8px;height:8px;background:${colors[i % 4]};border-radius:50%;pointer-events:none;z-index:99999;transition:all 1.5s ease-out;`
    document.body.appendChild(el)
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${-Math.random() * 300 - 100}px) rotate(${Math.random() * 360}deg)`
      el.style.opacity = '0'
    })
    setTimeout(() => el.remove(), 1600)
  }
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const { setCursorState } = useStore()

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSON.email)
    setCopied(true)
    confetti()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // EmailJS / Formspree integration point
    console.log('Form submit:', form)
    setSent(true)
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section id="contact" className="py-32 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">08 — CONTACT</div>

        <h2 className="text-4xl md:text-7xl font-display font-bold mb-16 leading-tight">
          Got a project?<br />
          <span className="text-gradient">Let's build intelligent systems.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-electric-cyan bg-electric-cyan/10 p-8 text-center"
              >
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-display font-bold text-xl text-warm-white">Message sent!</h3>
                <p className="font-mono text-sm text-white/50 mt-2">I'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {(['name', 'email', 'message'] as const).map((field) => (
                  <div key={field}>
                    <label className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-2">
                      {field} {field !== 'message' && '*'}
                    </label>
                    {field === 'message' ? (
                      <textarea
                        required
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-sm text-warm-white placeholder-white/20 focus:outline-none focus:border-electric-cyan transition-colors resize-none"
                        placeholder={`Your ${field}...`}
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      />
                    ) : (
                      <input
                        required
                        type={field === 'email' ? 'email' : 'text'}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-sm text-warm-white placeholder-white/20 focus:outline-none focus:border-electric-cyan transition-colors"
                        placeholder={field === 'email' ? 'your@email.com' : `Your ${field}...`}
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-4 bg-electric-cyan text-black font-mono text-sm font-bold tracking-widest hover:bg-white transition-colors"
                  onMouseEnter={() => setCursorState('ring')}
                  onMouseLeave={() => setCursorState('default')}
                >
                  SEND MESSAGE →
                </button>
              </form>
            )}
          </div>

          {/* Quick links */}
          <div className="space-y-6">
            {[
              { label: 'Email', value: PERSON.email, href: `mailto:${PERSON.email}` },
              { label: 'LinkedIn', value: 'jashwanth-burgula', href: PERSON.linkedin },
              { label: 'GitHub', value: 'JashwanthBurgula', href: PERSON.github },
              { label: 'Phone', value: PERSON.phone, href: `tel:${PERSON.phone.replace(/\s/g, '')}` },
            ].map((link) => (
              <div key={link.label} className="border-b border-white/10 pb-4">
                <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">{link.label}</div>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-lg text-warm-white hover:text-electric-cyan transition-colors"
                  onMouseEnter={() => setCursorState('ring')}
                  onMouseLeave={() => setCursorState('default')}
                >
                  {link.value}
                </a>
              </div>
            ))}

            {/* Copy email */}
            <button
              onClick={copyEmail}
              className="flex items-center gap-2 font-mono text-xs text-white/40 hover:text-electric-cyan transition-colors border border-white/10 px-4 py-2 hover:border-electric-cyan"
            >
              {copied ? '✓ COPIED!' : '⎘ COPY EMAIL'}
            </button>

            {/* Footer info */}
            <div className="pt-8 border-t border-white/5">
              <div className="font-mono text-xs text-white/20 space-y-1">
                <div>📍 {PERSON.location}</div>
                <div>🕐 Local time: {timeStr} IST</div>
                <div className="pt-4 text-white/10">Built with React Three Fiber · 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
