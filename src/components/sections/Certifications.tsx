import { useState } from 'react'
import { CERTIFICATIONS } from '@/data'

export default function Certifications() {
  const [flipped, setFlipped] = useState<number | null>(null)

  return (
    <section id="certifications" className="py-32 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="font-mono text-xs text-electric-cyan mb-4 tracking-widest">07 — CERTIFICATIONS</div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-16">
          Proof of<br /><span className="text-gradient">proficiency.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={i}
              className="h-48 cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => setFlipped(flipped === i ? null : i)}
            >
              <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flipped === i ? 'rotateY(180deg)' : '',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 border border-white/10 bg-white/5 p-6 flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-8 h-8 rounded-full" style={{ background: cert.color }} />
                  <div>
                    <div className="font-mono text-xs text-white/30 mb-1">{cert.code}</div>
                    <h3 className="font-display font-bold text-warm-white text-sm leading-tight">{cert.title}</h3>
                  </div>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 border p-6 flex flex-col justify-center items-center text-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderColor: cert.color,
                    background: `${cert.color}10`,
                  }}
                >
                  <div className="font-display font-bold text-warm-white mb-2">{cert.title}</div>
                  <div className="font-mono text-xs" style={{ color: cert.color }}>{cert.issuer}</div>
                  <div className="font-mono text-xs text-white/30 mt-2">Tap to flip back</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
