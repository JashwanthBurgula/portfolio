'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function MagneticButton({ children, onClick, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.3
    const dy = (e.clientY - cy) * 0.3
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-150 ease-out ${className}`}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  )
}
