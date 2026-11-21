import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '@/utils/sound'

// 7 Agent Definitions based on Bujji AI & Jashwanth's Architecture
interface AgentNode {
  id: string
  name: string
  sub: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  role: string
  latency: string
  status: 'idle' | 'active' | 'resolved'
}

const INITIAL_NODES: AgentNode[] = [
  {
    id: 'wake',
    name: 'Wake Agent',
    sub: 'Vosk Offline Engine',
    x: 20,
    y: 22,
    role: 'Offline hotword detection (<3% CPU)',
    latency: '8ms',
    status: 'idle',
  },
  {
    id: 'stt',
    name: 'STT Agent',
    sub: 'Faster-Whisper',
    x: 18,
    y: 54,
    role: 'Local speech-to-text (English + Telugu)',
    latency: '34ms',
    status: 'idle',
  },
  {
    id: 'router',
    name: 'Router Core',
    sub: '3-Tier Orchestrator',
    x: 50,
    y: 48,
    role: 'Rules -> Local Qwen 2.5 7B -> Gemini Fallback',
    latency: '14ms',
    status: 'idle',
  },
  {
    id: 'codeforge',
    name: 'CodeForge Agent',
    sub: 'Autonomous Coder',
    x: 82,
    y: 24,
    role: 'Contextual code generation & bug fixes',
    latency: '85ms',
    status: 'idle',
  },
  {
    id: 'vision',
    name: 'Vision Model',
    sub: 'ResNet + EfficientNet',
    x: 22,
    y: 84,
    role: 'Diabetic retinopathy grading (92%+ acc)',
    latency: '62ms',
    status: 'idle',
  },
  {
    id: 'tools',
    name: 'Tool Exec',
    sub: 'OS Automation',
    x: 50,
    y: 86,
    role: 'Local filesystem, Docker API, browser control',
    latency: '19ms',
    status: 'idle',
  },
  {
    id: 'memory',
    name: 'ChromaDB Memory',
    sub: 'Vector Store RAG',
    x: 80,
    y: 78,
    role: 'Dense cosine similarity retrieval (k=5)',
    latency: '12ms',
    status: 'idle',
  },
]

// Network Connections (Edges)
const CONNECTIONS = [
  ['wake', 'router'],
  ['stt', 'router'],
  ['router', 'codeforge'],
  ['router', 'vision'],
  ['router', 'tools'],
  ['router', 'memory'],
  ['codeforge', 'memory'],
  ['tools', 'memory'],
]

// Preset Task Pipelines
const TASK_PRESETS = {
  swarm: {
    title: 'Multi-Agent Swarm Orchestration',
    activeNodes: ['wake', 'stt', 'router', 'codeforge', 'tools', 'memory'],
    streamLines: [
      '// [SWARM INITIALIZED]: Listening on local audio stream (16kHz)',
      '> Wake Agent: Hotword "Hey Bujji" verified (confidence = 0.985)',
      '> STT Agent: Audio decoded -> "Refactor concurrency workers and query vector store"',
      '> Router Core: Complexity score = 0.78 -> Routing to Local Qwen 2.5 7B',
      '> ChromaDB: Cosine search for nearest architecture embeddings (similarity = 0.942)',
      '> CodeForge: Synthesizing asyncio task pool with bounded queue size 16...',
      '> Tool Exec: Validated Python syntax in sandboxed runtime (0 warnings)',
      '// [SWARM RESOLVED]: Multi-agent pipeline completed in 92ms.',
    ],
    traces: [
      { tag: 'VOSK_WAKE', time: '+8ms', desc: 'Audio frame matched keyword' },
      { tag: 'WHISPER_STT', time: '+34ms', desc: 'Beam size 2 transcript' },
      { tag: 'ROUTER_CORE', time: '+14ms', desc: 'Selected local tier model' },
      { tag: 'CHROMADB_KNN', time: '+12ms', desc: 'Retrieved 5 context chunks' },
      { tag: 'CODEFORGE', time: '+85ms', desc: 'Emitted 42 tokens' },
      { tag: 'TOOL_EXEC', time: '+19ms', desc: 'Container sandbox execution' },
    ],
    cosine: 0.942,
    latency: 92,
  },
  benchmark: {
    title: 'ByteSentinel 85% Latency Cut Stress Test',
    activeNodes: ['router', 'tools', 'memory'],
    streamLines: [
      '// [BENCHMARK RUNNER]: Evaluating Sequential vs Concurrent Execution',
      '> Baseline: Synchronous sequential pipeline execution: 600.4 seconds',
      '> Optimizing: Spawning Celery distributed worker pool + Redis queue',
      '> Concurrency Pipeline: Chunked asynchronous token streaming (16 parallel workers)',
      '> Memory Footprint: Bounded VRAM usage at 6.8 GB (Zero OOM errors)',
      '> Benchmark Complete: Generation duration reduced from 600s -> 89.2s',
      '// [EFFICIENCY METRIC]: ~85.1% Total Latency Reduction achieved.',
    ],
    traces: [
      { tag: 'ASYNC_POOL', time: '+12ms', desc: 'Spawned 16 worker threads' },
      { tag: 'REDIS_CACHE', time: '+4ms', desc: 'Cache hit ratio 88.4%' },
      { tag: 'TOKEN_STREAM', time: '+45ms', desc: 'Throughput 148 tok/s' },
      { tag: 'PIPELINE_DONE', time: '+89s', desc: 'Generation complete' },
    ],
    cosine: 0.968,
    latency: 89,
  },
  retina: {
    title: 'Healthcare CV: Diabetic Retinopathy Diagnostic Pipeline',
    activeNodes: ['router', 'vision', 'memory'],
    streamLines: [
      '// [CV INFERENCE]: Loading high-resolution fundus retinal photograph',
      '> OpenCV Preprocessing: Histogram equalization + circular mask (512x512)',
      '> Model Backbone: Hybrid ResNet-50 + EfficientNet-B4 ensemble loaded',
      '> Feature Extraction: Detecting microaneurysms, hemorrhages & exudates',
      '> Softmax Classifier: Class 2 (Moderate NPDR) confidence = 94.6%',
      '> Clinical Report: Generated diagnostic rationale with bounding coordinates',
      '// [INFERENCE COMPLETED]: Diagnostic grading verified in 62ms.',
    ],
    traces: [
      { tag: 'OPENCV_PREP', time: '+15ms', desc: 'Normalized color space' },
      { tag: 'RESNET_50', time: '+32ms', desc: 'Extracted spatial embeddings' },
      { tag: 'EFFICIENTNET', time: '+28ms', desc: 'Fine-grained lesion maps' },
      { tag: 'SOFTMAX_OUT', time: '+4ms', desc: 'Class confidence 94.6%' },
    ],
    cosine: 0.946,
    latency: 62,
  },
}

export default function AgenticSwarmLab() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES)
  const [activePreset, setActivePreset] = useState<'swarm' | 'benchmark' | 'retina'>('swarm')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTaskNode, setActiveTaskNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(INITIAL_NODES[2]) // Default router

  // Terminal & Trace states
  const [streamIndex, setStreamIndex] = useState(TASK_PRESETS.swarm.streamLines.length)
  const [currentTraces, setCurrentTraces] = useState(TASK_PRESETS.swarm.traces)
  const [cosineScore, setCosineScore] = useState(0.942)
  const [liveLatency, setLiveLatency] = useState(42)

  // Raw CLI Toggle State
  const [showRawCli, setShowRawCli] = useState(false)
  const [cliInput, setCliInput] = useState('')
  const [cliLogs, setCliLogs] = useState<string[]>([
    'JB-OS v2.6.4 [AI SYSTEMS COMMAND INTERFACE]',
    "Type 'help', 'skills', 'bujji', 'stats', 'swarm', or 'resume'.",
  ])

  // Live telemetry micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(Math.random() * 8) + 38)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Listen for global open-cli-terminal events
  useEffect(() => {
    const handleOpenCli = () => {
      setShowRawCli(true)
      const el = document.getElementById('swarm-lab') || document.getElementById('play')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('open-cli-terminal', handleOpenCli)
    return () => window.removeEventListener('open-cli-terminal', handleOpenCli)
  }, [])

  // Run Preset Pipeline
  const runPipeline = (presetKey: 'swarm' | 'benchmark' | 'retina') => {
    sound.playClick()
    setActivePreset(presetKey)
    setIsRunning(true)
    setStreamIndex(0)
    const preset = TASK_PRESETS[presetKey]
    setCurrentTraces(preset.traces)
    setCosineScore(preset.cosine)

    // Reset node statuses
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: preset.activeNodes.includes(n.id) ? 'active' : 'idle',
      }))
    )

    // Stream lines sequentially with sound clicks
    let currentLine = 0
    const totalLines = preset.streamLines.length

    const interval = setInterval(() => {
      currentLine++
      setStreamIndex(currentLine)
      sound.playBrickHit(440 + currentLine * 40)

      // Sequentially highlight nodes
      const activeId = preset.activeNodes[currentLine % preset.activeNodes.length]
      setActiveTaskNode(activeId)

      if (currentLine >= totalLines) {
        clearInterval(interval)
        setIsRunning(false)
        setActiveTaskNode(null)
        sound.playPortalWarp()
        setNodes((prev) =>
          prev.map((n) => ({
            ...n,
            status: preset.activeNodes.includes(n.id) ? 'resolved' : 'idle',
          }))
        )
      }
    }, 280)
  }

  // Handle Raw CLI submission
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
          '  swarm     - Run autonomous multi-agent pipeline simulation',
          '  benchmark - Run 85% latency optimization stress test',
          '  retina    - Execute healthcare diabetic retinopathy CV model',
          '  skills    - Display full technical stack & frameworks',
          '  bujji     - Inspect Bujji AI architecture specs',
          '  stats     - View verified leadership & latency metrics',
          '  resume    - Trigger direct resume PDF download',
          '  contact   - Display verified email & LinkedIn links',
          '  clear     - Reset the terminal display'
        )
        break
      case 'swarm':
        runPipeline('swarm')
        newLogs.push('Executing 7-agent swarm pipeline...')
        break
      case 'benchmark':
        runPipeline('benchmark')
        newLogs.push('Executing ByteSentinel 85% latency stress test...')
        break
      case 'retina':
        runPipeline('retina')
        newLogs.push('Executing diabetic retinopathy computer vision pipeline...')
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
        newLogs.push('Email: jashwanthburgula@gmail.com · Hyderabad, India (Remote Worldwide)')
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

  const currentPresetData = TASK_PRESETS[activePreset]

  return (
    <section
      id="swarm-lab"
      className="py-24 sm:py-32 relative bg-[#090A0E] border-t border-white/[0.08] select-none scroll-mt-20 overflow-hidden"
    >
      {/* Legacy link anchor */}
      <div id="play" className="sr-only" />
      {/* Background Studio Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[800px] h-[500px] bg-white/[0.015] rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-6 sm:px-12 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.03] text-white/60 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>04 // DEVELOPER FLEX · AUTONOMOUS MULTI-AGENT SWARM &amp; SYSTEM LAB</span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight uppercase leading-none">
              AI SWARM ORCHESTRATION
            </h2>
            <p className="font-body text-white/60 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Interactive testbed for distributed multi-agent state machines, local LLM routing, and 
              sub-100ms vector embeddings from <span className="text-white font-medium">Bujji AI</span> and <span className="text-white font-medium">ByteSentinel</span>.
            </p>
          </div>

          {/* Quick Raw CLI Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick()
                setShowRawCli(!showRawCli)
              }}
              onMouseEnter={() => sound.playHover()}
              className="px-4 py-2 rounded-xs border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/50 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="text-emerald-400 font-bold">&gt;_</span>
              <span>{showRawCli ? 'Hide Shell' : 'Interactive Shell [~]'}</span>
            </button>
          </div>
        </div>

        {/* ── TOP TELEMETRY DECK BAR ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 mb-6 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md font-mono text-xs text-white/70">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <div>
              <span className="text-white/40 block text-[10px] uppercase">SWARM STATUS</span>
              <span className="text-white font-semibold">7 AGENTS ONLINE</span>
            </div>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">LOCAL LATENCY</span>
            <span className="text-emerald-400 font-semibold">{liveLatency}ms</span>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">VRAM USAGE</span>
            <span className="text-white font-semibold">6.8 GB / 12 GB</span>
          </div>

          <div>
            <span className="text-white/40 block text-[10px] uppercase">ROUTING ENGINE</span>
            <span className="text-white/90 font-medium">Qwen 2.5 7B &rarr; Gemini</span>
          </div>
        </div>

        {/* ── MAIN INTERACTIVE SPLIT STAGE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: 7-AGENT INTERACTIVE TOPOLOGY GRAPH (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0c0d13]/90 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Stage Title */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] z-10">
              <div className="font-mono text-xs text-white/50 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <span>TOPOLOGY GRAPH // 7 BUJJI AI AGENT NODES</span>
              </div>
              <span className="font-mono text-[10px] text-white/40 uppercase">
                {isRunning ? 'RUNNING TASK...' : 'CLICK / HOVER NODES'}
              </span>
            </div>

            {/* SVG Network Graph Canvas */}
            <div className="relative w-full h-[360px] sm:h-[420px] my-3">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connection lines */}
                {CONNECTIONS.map(([srcId, dstId]) => {
                  const src = nodes.find((n) => n.id === srcId)
                  const dst = nodes.find((n) => n.id === dstId)
                  if (!src || !dst) return null

                  const isEdgeActive =
                    isRunning &&
                    currentPresetData.activeNodes.includes(srcId) &&
                    currentPresetData.activeNodes.includes(dstId)

                  const isHighlighted =
                    hoveredNode === srcId || hoveredNode === dstId

                  return (
                    <g key={`${srcId}-${dstId}`}>
                      <line
                        x1={`${src.x}%`}
                        y1={`${src.y}%`}
                        x2={`${dst.x}%`}
                        y2={`${dst.y}%`}
                        stroke={
                          isEdgeActive
                            ? '#38bdf8'
                            : isHighlighted
                            ? '#ffffff'
                            : 'rgba(255, 255, 255, 0.12)'
                        }
                        strokeWidth={isEdgeActive ? 2.5 : isHighlighted ? 1.5 : 1}
                        strokeDasharray={isEdgeActive ? '4 3' : 'none'}
                        className={isEdgeActive ? 'animate-pulse' : ''}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Render Agent Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id
                const isHovered = hoveredNode === node.id
                const isTaskActive = activeTaskNode === node.id
                const isResolved = node.status === 'resolved'

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => {
                      sound.playClick()
                      setSelectedNode(node)
                    }}
                    onMouseEnter={() => {
                      sound.playHover()
                      setHoveredNode(node.id)
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`px-3 py-2 rounded-xl border backdrop-blur-md transition-all shadow-lg flex items-center gap-2.5 ${
                        isTaskActive
                          ? 'border-cyan-400 bg-cyan-950/90 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                          : isResolved
                          ? 'border-emerald-400/80 bg-emerald-950/60 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                          : isSelected
                          ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : isHovered
                          ? 'border-white/60 bg-white/5'
                          : 'border-white/15 bg-[#090A0E]/80'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-all ${
                          isTaskActive
                            ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-ping'
                            : isResolved
                            ? 'bg-emerald-400'
                            : isSelected
                            ? 'bg-white'
                            : 'bg-white/40 group-hover:bg-white'
                        }`}
                      />
                      <div className="text-left">
                        <div className="font-mono text-xs text-white font-semibold whitespace-nowrap leading-tight">
                          {node.name}
                        </div>
                        <div className="font-mono text-[9px] text-white/50 whitespace-nowrap leading-tight">
                          {node.sub}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Selected Node Inspector Footer */}
            {selectedNode && (
              <div className="mt-2 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-between text-left font-mono text-xs">
                <div>
                  <span className="text-white/40 block text-[9px] uppercase">SELECTED NODE</span>
                  <span className="text-white font-semibold">{selectedNode.name}</span>
                  <span className="text-white/50 text-[11px] ml-2 font-normal hidden sm:inline">
                    · {selectedNode.role}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white/40 block text-[9px] uppercase">LATENCY</span>
                  <span className="text-emerald-400 font-semibold">{selectedNode.latency}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DUAL-PANE EXECUTION TERMINAL & TRACES (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0c0d13]/90 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="font-mono text-xs text-white/60 ml-2">
                  JB-OS // {currentPresetData.title}
                </span>
              </div>
              <div className="font-mono text-[10px] text-white/40 uppercase">
                VEC SIMILARITY: <span className="text-emerald-400 font-bold">{cosineScore}</span>
              </div>
            </div>

            {/* Split Stream / Trace Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-[300px] sm:min-h-[360px]">
              
              {/* Left Code / Token Output (cols 1-7) */}
              <div className="md:col-span-7 rounded-xl bg-black/60 border border-white/[0.05] p-3.5 font-mono text-xs flex flex-col justify-between text-left overflow-y-auto max-h-[360px]">
                <div className="space-y-2">
                  <div className="text-white/40 text-[10px] uppercase border-b border-white/5 pb-1 mb-2">
                    LIVE EXECUTION STREAM
                  </div>
                  {currentPresetData.streamLines.slice(0, streamIndex).map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={
                        line.startsWith('//')
                          ? 'text-cyan-400 font-semibold'
                          : line.startsWith('>')
                          ? 'text-white/90'
                          : 'text-white/50'
                      }
                    >
                      {line}
                    </motion.div>
                  ))}
                  {isRunning && (
                    <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse align-middle ml-1" />
                  )}
                </div>

                <div className="pt-2 text-[10px] text-white/30 border-t border-white/5">
                  STATUS: {isRunning ? 'EXECUTING PIPELINE...' : 'READY FOR DISPATCH'}
                </div>
              </div>

              {/* Right Execution Traces & Vector Gauge (cols 8-12) */}
              <div className="md:col-span-5 rounded-xl bg-black/60 border border-white/[0.05] p-3.5 font-mono text-xs flex flex-col justify-between text-left">
                <div>
                  <div className="text-white/40 text-[10px] uppercase border-b border-white/5 pb-1 mb-2">
                    TRACE HIERARCHY
                  </div>
                  <div className="space-y-2">
                    {currentTraces.map((tr, idx) => (
                      <div key={idx} className="flex items-start justify-between text-[11px]">
                        <div>
                          <span className="text-emerald-400 font-semibold">[{tr.tag}]</span>
                          <span className="text-white/60 block text-[10px]">{tr.desc}</span>
                        </div>
                        <span className="text-white/40 text-[10px]">{tr.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Similarity Meter */}
                <div className="pt-3 border-t border-white/5 mt-3">
                  <div className="flex justify-between text-[10px] text-white/50 mb-1">
                    <span>COSINE SIMILARITY</span>
                    <span className="text-emerald-400 font-bold">{cosineScore}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${cosineScore * 100}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Action Trigger Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-3 border-t border-white/[0.08]">
              <button
                disabled={isRunning}
                onClick={() => runPipeline('swarm')}
                onMouseEnter={() => sound.playHover()}
                className={`px-3 py-2.5 rounded-xs font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer text-center ${
                  activePreset === 'swarm' && isRunning
                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                    : 'bg-white text-black hover:bg-[#E2E8F0] shadow-md'
                }`}
              >
                <span>▶ Run Swarm Task</span>
              </button>

              <button
                disabled={isRunning}
                onClick={() => runPipeline('benchmark')}
                onMouseEnter={() => sound.playHover()}
                className={`px-3 py-2.5 rounded-xs border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
                  activePreset === 'benchmark' && isRunning
                    ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                    : 'border-white/20 bg-white/[0.03] text-white hover:border-white/50 hover:bg-white/[0.08]'
                }`}
              >
                <span>⚡ Latency Cut (-85%)</span>
              </button>

              <button
                disabled={isRunning}
                onClick={() => runPipeline('retina')}
                onMouseEnter={() => sound.playHover()}
                className={`px-3 py-2.5 rounded-xs border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer text-center ${
                  activePreset === 'retina' && isRunning
                    ? 'border-purple-400 bg-purple-950/80 text-purple-300'
                    : 'border-white/20 bg-white/[0.03] text-white hover:border-white/50 hover:bg-white/[0.08]'
                }`}
              >
                <span>👁 Retina CV Scan</span>
              </button>
            </div>

          </div>

        </div>

        {/* ── OPTIONAL EMBEDDED RAW UNIX COMMAND LINE SHELL ── */}
        <AnimatePresence>
          {showRawCli && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 rounded-2xl border border-white/[0.12] bg-black/90 p-5 font-mono text-xs text-left shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 text-white/50">
                <span>terminal@jashwanth:~$ JB-OS COMMAND INTERFACE</span>
                <span className="text-[10px]">TYPE &apos;HELP&apos; FOR OPTIONS</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto mb-3 text-white/80">
                {cliLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('>') ? 'text-white' : 'text-white/60'}>
                    {log}
                  </div>
                ))}
              </div>

              <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-2 border-t border-white/10">
                <span className="text-emerald-400 font-bold">&gt;</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="type a command (e.g. swarm, benchmark, retina, skills, bujji, resume)..."
                  className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs placeholder:text-white/30"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] uppercase cursor-pointer"
                >
                  Exec
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
