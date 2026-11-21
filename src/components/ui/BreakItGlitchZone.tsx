import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '@/utils/sound'

// 5x7 ASCII Bitmap Font Table for "AI THAT SHIPS"
const FONT_5X7: Record<string, number[][]> = {
  'A': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'I': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  'H': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  'S': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  'P': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  ' ': [
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0],
  ],
}

interface Brick {
  x: number
  y: number
  w: number
  h: number
  alive: boolean
  color: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

export default function BreakItGlitchZone() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [autoPilot, setAutoPilot] = useState(false)
  const [victory, setVictory] = useState(false)
  const [bricksRemaining, setBricksRemaining] = useState(0)

  // Interactive CLI Terminal State
  const [showTerminal, setShowTerminal] = useState(false)
  const [cliInput, setCliInput] = useState('')
  const [cliLogs, setCliLogs] = useState<string[]>([
    'JB-OS v2.6.4 [AI SYSTEMS COMMAND INTERFACE]',
    "Type 'help' to inspect available system commands.",
  ])

  const stateRef = useRef<{
    paddleX: number
    paddleW: number
    ballX: number
    ballY: number
    ballVx: number
    ballVy: number
    ballRadius: number
    bricks: Brick[]
    particles: Particle[]
    autoPilot: boolean
  }>({
    paddleX: 300,
    paddleW: 90,
    ballX: 350,
    ballY: 300,
    ballVx: 3.5,
    ballVy: -3.5,
    ballRadius: 5,
    bricks: [],
    particles: [],
    autoPilot: false,
  })

  // Sync autoPilot
  useEffect(() => {
    stateRef.current.autoPilot = autoPilot
  }, [autoPilot])

  // Global CLI trigger & keyboard shortcut
  useEffect(() => {
    const handleOpenCli = () => {
      setShowTerminal(true)
      const el = document.getElementById('play')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        setShowTerminal((prev) => !prev)
        const el = document.getElementById('play')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('open-cli-terminal', handleOpenCli)
    window.addEventListener('keydown', handleGlobalKey)
    return () => {
      window.removeEventListener('open-cli-terminal', handleOpenCli)
      window.removeEventListener('keydown', handleGlobalKey)
    }
  }, [])

  const initGame = (w: number, h: number) => {
    const text1 = 'AI THAT'
    const text2 = 'SHIPS'
    const brickSize = w < 600 ? 5 : 8
    const gap = 2
    const bricks: Brick[] = []

    const renderWord = (word: string, startY: number, color: string) => {
      let totalWidth = 0
      for (const char of word) {
        const matrix = FONT_5X7[char] || FONT_5X7[' ']
        totalWidth += matrix[0].length * (brickSize + gap) + gap * 2
      }

      let curX = (w - totalWidth) / 2
      for (const char of word) {
        const matrix = FONT_5X7[char] || FONT_5X7[' ']
        const cols = matrix[0].length
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
              bricks.push({
                x: curX + c * (brickSize + gap),
                y: startY + r * (brickSize + gap),
                w: brickSize,
                h: brickSize,
                alive: true,
                color,
              })
            }
          }
        }
        curX += cols * (brickSize + gap) + gap * 2
      }
    }

    renderWord(text1, 55, '#FFFFFF')
    renderWord(text2, 55 + 7 * (brickSize + gap) + 16, '#94A3B8')

    stateRef.current.bricks = bricks
    stateRef.current.paddleX = w / 2 - 45
    stateRef.current.paddleW = w < 600 ? 70 : 100
    stateRef.current.ballX = w / 2
    stateRef.current.ballY = h - 60
    stateRef.current.ballVx = (Math.random() > 0.5 ? 1 : -1) * 3.5
    stateRef.current.ballVy = -4
    stateRef.current.particles = []

    setBricksRemaining(bricks.length)
    setVictory(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const width = Math.min(parent.clientWidth, 860)
      const height = 440
      canvas.width = width
      canvas.height = height
      initGame(width, height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Mouse control
    const handleMouseMove = (e: MouseEvent) => {
      if (stateRef.current.autoPilot) return
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      stateRef.current.paddleX = Math.max(
        0,
        Math.min(canvas.width - stateRef.current.paddleW, mouseX - stateRef.current.paddleW / 2)
      )
    }

    // Touch control
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return
      const rect = canvas.getBoundingClientRect()
      const touchX = e.touches[0].clientX - rect.left
      stateRef.current.paddleX = Math.max(
        0,
        Math.min(canvas.width - stateRef.current.paddleW, touchX - stateRef.current.paddleW / 2)
      )
    }

    // Keyboard control
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 25
      if (e.key === 'ArrowLeft') {
        stateRef.current.paddleX = Math.max(0, stateRef.current.paddleX - step)
      } else if (e.key === 'ArrowRight') {
        stateRef.current.paddleX = Math.min(
          canvas.width - stateRef.current.paddleW,
          stateRef.current.paddleX + step
        )
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('keydown', handleKeyDown)

    // Game loop
    const loop = () => {
      const w = canvas.width
      const h = canvas.height
      const s = stateRef.current

      // Clear with dark obsidian background
      ctx.fillStyle = '#090A0E'
      ctx.fillRect(0, 0, w, h)

      // Ambient scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)'
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1)
      }

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      // Auto-pilot
      if (s.autoPilot) {
        const targetX = s.ballX - s.paddleW / 2
        s.paddleX += (targetX - s.paddleX) * 0.16
        s.paddleX = Math.max(0, Math.min(w - s.paddleW, s.paddleX))
      }

      // Update ball
      s.ballX += s.ballVx
      s.ballY += s.ballVy

      // Wall collisions
      if (s.ballX - s.ballRadius <= 0) {
        s.ballX = s.ballRadius
        s.ballVx = Math.abs(s.ballVx)
        sound.playBrickHit(320)
      } else if (s.ballX + s.ballRadius >= w) {
        s.ballX = w - s.ballRadius
        s.ballVx = -Math.abs(s.ballVx)
        sound.playBrickHit(320)
      }

      if (s.ballY - s.ballRadius <= 0) {
        s.ballY = s.ballRadius
        s.ballVy = Math.abs(s.ballVy)
        sound.playBrickHit(340)
      }

      // Paddle collision
      const paddleY = h - 25
      const paddleH = 10

      if (
        s.ballY + s.ballRadius >= paddleY &&
        s.ballY - s.ballRadius <= paddleY + paddleH &&
        s.ballX >= s.paddleX &&
        s.ballX <= s.paddleX + s.paddleW
      ) {
        const hitPoint = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2)
        s.ballVx = hitPoint * 4.5
        s.ballVy = -Math.abs(s.ballVy)
        sound.playBrickHit(420)

        // Spawn paddle sparks
        for (let i = 0; i < 4; i++) {
          s.particles.push({
            x: s.ballX,
            y: paddleY,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3,
            size: Math.random() * 2 + 1,
            alpha: 1,
            color: '#FFFFFF',
          })
        }
      }

      // Bottom death reset
      if (s.ballY - s.ballRadius > h) {
        s.ballX = w / 2
        s.ballY = h / 2
        s.ballVy = -4
        s.ballVx = (Math.random() - 0.5) * 5
      }

      // Brick collision
      let activeCount = 0
      for (const b of s.bricks) {
        if (!b.alive) continue
        activeCount++

        if (
          s.ballX + s.ballRadius >= b.x &&
          s.ballX - s.ballRadius <= b.x + b.w &&
          s.ballY + s.ballRadius >= b.y &&
          s.ballY - s.ballRadius <= b.y + b.h
        ) {
          b.alive = false
          s.ballVy = -s.ballVy
          setScore((prev) => prev + 10)
          sound.playBrickHit(520 + Math.random() * 200)

          // Spawn explosion particles
          for (let p = 0; p < 8; p++) {
            s.particles.push({
              x: b.x + b.w / 2,
              y: b.y + b.h / 2,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              size: Math.random() * 2.5 + 1,
              alpha: 1,
              color: b.color,
            })
          }
          break
        }
      }

      setBricksRemaining(activeCount)
      if (activeCount === 0 && !victory) {
        setVictory(true)
      }

      // Draw bricks
      for (const b of s.bricks) {
        if (!b.alive) continue
        ctx.fillStyle = b.color
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)'
        ctx.shadowBlur = 6
        ctx.fillRect(b.x, b.y, b.w, b.h)
      }
      ctx.shadowBlur = 0

      // Update & draw particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.035
        if (p.alpha <= 0) {
          s.particles.splice(i, 1)
          continue
        }
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
      ctx.globalAlpha = 1

      // Draw glowing paddle
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(s.paddleX, paddleY, s.paddleW, paddleH, 4)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw ball
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(s.ballX, s.ballY, s.ballRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleResetGame = () => {
    sound.playClick()
    const canvas = canvasRef.current
    if (!canvas) return
    initGame(canvas.width, canvas.height)
    setScore(0)
  }

  // CLI Command Runner
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = cliInput.trim().toLowerCase()
    if (!cmd) return
    sound.playClick()

    const newLogs = [...cliLogs, `> ${cliInput}`]

    switch (cmd) {
      case 'help':
        newLogs.push(
          'AVAILABLE COMMANDS:',
          '  skills    - Display full technical stack & frameworks',
          '  bujji     - Inspect Bujji AI architecture specs',
          '  stats     - View verified leadership & latency metrics',
          '  resume    - Trigger direct resume PDF download',
          '  contact   - Display verified email & LinkedIn links',
          '  clear     - Reset the terminal display'
        )
        break
      case 'skills':
        newLogs.push(
          'CORE CAPABILITIES:',
          '  - Languages: Python, TypeScript, SQL, C++',
          '  - AI/ML: PyTorch, TensorFlow, LangChain, Ollama, ChromaDB, Hugging Face',
          '  - Backend: FastAPI, Docker Compose, Redis, Celery, PostgreSQL',
          '  - Vision & Voice: OpenCV, Faster-Whisper, Vosk, ResNet, EfficientNet'
        )
        break
      case 'bujji':
        newLogs.push(
          'BUJJI AI ARCHITECTURE:',
          '  - Swarm: 7 autonomous agents (Wake, Speech, Router, Vision, Automation, CodeForge, Memory)',
          '  - Wake Word: Vosk offline detector (<3% idle CPU)',
          '  - STT: Local Whisper speech recognition (English + Telugu)',
          '  - Routing: 3-Tier funnel (Rules -> Qwen2.5 7B local -> Gemini API cloud)'
        )
        break
      case 'stats':
        newLogs.push(
          'VERIFIED BENCHMARKS:',
          '  - 10+ Engineers Led at ByteSentinel',
          '  - ~85% Content Generation Latency Cut (600s -> 90s)',
          '  - 92%+ Diabetic Retinopathy Diagnostic Accuracy',
          '  - 9/10 Enterprise HRMS Roadmap Phases Shipped'
        )
        break
      case 'resume':
        newLogs.push('Downloading Jashwanth_Burugula_Resume.pdf...')
        window.open('/resume.pdf', '_blank')
        break
      case 'contact':
        newLogs.push(
          'CONTACT INFORMATION:',
          '  - Email: jashwanthburgula@gmail.com',
          '  - Location: Hyderabad, India (Remote Worldwide)',
          '  - GitHub: github.com/JashwanthBurgula',
          '  - LinkedIn: linkedin.com/in/jashwanth-burgula'
        )
        break
      case 'clear':
        setCliLogs(['Terminal cleared. Type "help" for options.'])
        setCliInput('')
        return
      default:
        newLogs.push(`Command not recognized: '${cmd}'. Type 'help' for available commands.`)
        break
    }

    setCliLogs(newLogs)
    setCliInput('')
  }

  return (
    <section id="play" className="py-24 sm:py-32 relative bg-[#090A0E] border-t border-white/[0.08] select-none scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-12 max-w-5xl text-center relative z-10">
        
        {/* Header Badges */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.03] text-white/60 font-mono text-xs uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
          <span>DEVELOPER FLEX // INTERACTIVE ARCADE &amp; CLI</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight uppercase leading-none mb-3">
          BREAK IT IF YOU CAN
        </h2>

        <p className="font-body text-white/50 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
          Move your mouse or arrow keys to control the paddle and shatter the 5x7 ASCII bitmap font matrix.
        </p>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between max-w-3xl mx-auto px-4 py-2.5 mb-4 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md font-mono text-xs text-white/70 gap-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-white/40">SCORE:</span>{' '}
              <span className="text-white font-bold">{score}</span>
            </div>
            <div>
              <span className="text-white/40">BRICKS:</span>{' '}
              <span className="text-white font-medium">{bricksRemaining}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playClick()
                setShowTerminal(!showTerminal)
              }}
              onMouseEnter={() => sound.playHover()}
              className="px-3 py-1 rounded border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-colors text-[11px] uppercase tracking-wider cursor-pointer"
            >
              {showTerminal ? 'Hide Terminal' : '⚡ Open CLI [~]'}
            </button>
            <button
              onClick={() => {
                sound.playClick()
                setAutoPilot((prev) => !prev)
              }}
              onMouseEnter={() => sound.playHover()}
              className={`px-3 py-1 rounded border transition-all text-[11px] uppercase tracking-wider cursor-pointer ${
                autoPilot
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/15 text-white/50 hover:text-white hover:border-white/30'
              }`}
            >
              {autoPilot ? 'AI PILOT: ON' : 'AI AUTO-PILOT'}
            </button>
            <button
              onClick={handleResetGame}
              onMouseEnter={() => sound.playHover()}
              className="px-3 py-1 rounded border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-colors text-[11px] uppercase tracking-wider cursor-pointer"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Interactive Canvas Stage */}
        <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden glass-panel">
          <canvas ref={canvasRef} className="w-full h-auto block cursor-none" />

          {/* Victory Screen */}
          {victory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#090A0E]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-2xl mb-4">
                ✓
              </div>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight uppercase mb-2">
                SYSTEM BREACHED!
              </h3>
              <p className="font-mono text-xs sm:text-sm text-white/60 max-w-md mb-6 leading-relaxed">
                All 5x7 bitmap matrix bricks cleared. Unlocked complete autonomous capability suite.
              </p>
              <button
                onClick={handleResetGame}
                onMouseEnter={() => sound.playHover()}
                className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e8f0] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </div>

        {/* Interactive Drop-Down Developer CLI Terminal */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mt-6 mx-auto max-w-3xl glass-panel rounded-2xl p-5 text-left font-mono text-xs border border-white/15 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08] text-white/40 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 text-white/60">terminal@jashwanth:~$</span>
                </div>
                <span>TYPE 'HELP'</span>
              </div>

              {/* Terminal Logs */}
              <div className="space-y-1 max-h-48 overflow-y-auto mb-3 text-white/80 select-text">
                {cliLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('>') ? 'text-white font-semibold' : 'text-white/60'}>
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Input Form */}
              <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
                <span className="text-emerald-400 font-bold">&gt;</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="type a command (e.g. skills, stats, bujji, resume)..."
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20 font-mono text-xs"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 font-mono text-[11px] text-white/30 tracking-wider">
          [ 5X7 ASCII BITMAP FONT MATRIX: AI THAT SHIPS ]
        </div>
      </div>
    </section>
  )
}
