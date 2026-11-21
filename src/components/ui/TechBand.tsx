import { motion } from 'framer-motion'
import { sound } from '@/utils/sound'

const TECHNOLOGIES = [
  'PYTHON',
  'FASTAPI',
  'LANGCHAIN',
  'OLLAMA',
  'CHROMADB',
  'REACT',
  'TYPESCRIPT',
  'POSTGRESQL',
  'DOCKER',
  'PYTORCH',
  'TENSORFLOW',
  'AZURE',
]

export default function TechBand() {
  const items = [...TECHNOLOGIES, ...TECHNOLOGIES, ...TECHNOLOGIES]

  return (
    <div className="w-full overflow-hidden py-10 sm:py-14 border-y border-white/[0.08] bg-[#090A0E] select-none relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#090A0E] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#090A0E] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-10 sm:gap-16 whitespace-nowrap w-max"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 32,
        }}
      >
        {items.map((tech, i) => (
          <div
            key={i}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-10 sm:gap-16 group cursor-default"
          >
            <span
              className="font-display font-bold text-5xl sm:text-7xl lg:text-[76px] tracking-tight uppercase transition-all duration-300 text-outline-marquee group-hover:text-white group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              {tech}
            </span>
            <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white group-hover:shadow-[0_0_8px_#ffffff] transition-all" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
