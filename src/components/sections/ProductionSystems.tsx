import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '@/utils/sound'
import { useStore } from '@/store'
import Systems3DTree from '@/components/scenes/Systems3DTree'

// ── TYPES ──
export interface PipelineNode {
  id: string
  name: string
  subtitle: string
  role: string
  latency: string
  metric: string
  badge: string
}

export interface SystemData {
  id: 'bujji' | 'marketing' | 'erp' | 'retina'
  num: string
  title: string
  shortTitle: string
  category: string
  tagline: string
  heroMetric: { val: string; label: string }
  metrics: { val: string; label: string }[]
  problem: string
  solution: string
  decisions: { title: string; desc: string }[]
  chips: string[]
  nodes: PipelineNode[]
  connections: { from: string; to: string }[]
  logs: string[]
  benchmark?: {
    baselineLabel: string
    baselineVal: string
    optimizedLabel: string
    optimizedVal: string
    cutPct: string
    description: string
  }
}

// ── 4 FLAGSHIP SYSTEMS ARCHITECTURES ──
const SYSTEMS: SystemData[] = [
  {
    id: 'bujji',
    num: '01',
    title: 'BUJJI AI',
    shortTitle: 'Bujji 7-Agent Swarm',
    category: 'Voice-First Autonomous Swarm',
    tagline: '7-Agent autonomous desktop swarm with offline Vosk wake word, bilingual STT & 3-tier LLM routing.',
    heroMetric: { val: '<3% CPU', label: 'Idle Background Usage' },
    metrics: [
      { val: '7-Agent', label: 'Autonomous Swarm' },
      { val: '<3%', label: 'Idle CPU Usage' },
      { val: 'EN + TE', label: 'Bilingual STT' },
      { val: '92ms', label: 'End-to-End Latency' },
    ],
    problem:
      'Desktop assistants require constant cloud connectivity, waste 20-30% CPU at idle, suffer high latency, and lack regional language comprehension (English + Telugu).',
    solution:
      'Architected a 7-agent swarm featuring offline Vosk wake-word detection (<3% CPU), Whisper speech recognition, three-tier routing (Rules → Local Qwen 2.5 7B via Ollama → Google Gemini API fallback), OpenCV screen perception, and CodeForge self-healing script generation.',
    decisions: [
      {
        title: 'Offline Wake Engine (<3% CPU)',
        desc: 'Vosk acoustic model continuously runs on raw audio frames in a lightweight C++ thread consuming under 3% idle background CPU.',
      },
      {
        title: '3-Tier Cost & Latency Funnel',
        desc: 'Tier 1 Regex (<5ms, zero cost) → Tier 2 Local Qwen 2.5 7B (private, offline) → Tier 3 Google Gemini cloud fallback.',
      },
      {
        title: 'Bilingual Speech Mapping',
        desc: 'Faster-Whisper local pipeline fine-tuned for mixed English + Telugu command vocabularies with automatic phonetic transcription.',
      },
      {
        title: 'CodeForge Self-Healing AST',
        desc: 'Autonomous code generation agent with sandboxed Python AST syntax validation and automatic runtime error repair.',
      },
    ],
    chips: ['Python', 'Whisper', 'Vosk', 'Ollama (Qwen 2.5)', 'Google Gemini', 'ChromaDB', 'OpenCV', 'pywinauto', 'Electron'],
    nodes: [
      {
        id: 'wake',
        name: 'Wake Engine',
        subtitle: 'Vosk Offline C++',
        role: 'Acoustic keyword detection (<3% CPU)',
        latency: '8ms',
        metric: '0.985 Conf',
        badge: 'TIER 0',
      },
      {
        id: 'stt',
        name: 'Speech Core',
        subtitle: 'Faster-Whisper',
        role: 'Bilingual phoneme transcription (EN + TE)',
        latency: '34ms',
        metric: 'Beam Sz 2',
        badge: 'TIER 1',
      },
      {
        id: 'router',
        name: '3-Tier Router',
        subtitle: 'Complexity Funnel',
        role: 'Rules (<5ms) → Local Qwen 7B → Gemini Cloud',
        latency: '14ms',
        metric: 'Score 0.82',
        badge: 'GATEWAY',
      },
      {
        id: 'memory',
        name: 'ChromaDB RAG',
        subtitle: 'Vector Store',
        role: 'Dense cosine similarity retrieval (k=5)',
        latency: '12ms',
        metric: '0.942 Cosine',
        badge: 'STORAGE',
      },
      {
        id: 'codeforge',
        name: 'CodeForge',
        subtitle: 'Self-Healing AST',
        role: 'Contextual code generation & syntax repair',
        latency: '45ms',
        metric: '42 Tok/s',
        badge: 'AGENT',
      },
      {
        id: 'tools',
        name: 'OS Executor',
        subtitle: 'pywinauto + OpenCV',
        role: 'Desktop perception & container execution',
        latency: '18ms',
        metric: '0 Exit Code',
        badge: 'RUNTIME',
      },
    ],
    connections: [
      { from: 'wake', to: 'stt' },
      { from: 'stt', to: 'router' },
      { from: 'router', to: 'memory' },
      { from: 'router', to: 'codeforge' },
      { from: 'codeforge', to: 'tools' },
      { from: 'memory', to: 'tools' },
    ],
    logs: [
      '// [BUJJI SWARM INITIALIZED]: Listening on 16kHz local audio stream',
      '> Wake Engine: Acoustic match "Hey Bujji" verified (confidence = 0.985, CPU = 2.4%)',
      '> Speech Core: Faster-Whisper decoded -> "Refactor concurrency workers and query vector store"',
      '> 3-Tier Router: Query complexity score 0.82 -> Dispatched to Local Qwen 2.5 7B via Ollama',
      '> ChromaDB Vector: Cosine similarity retrieval (k=5 context chunks retrieved, score = 0.942)',
      '> CodeForge: Synthesized asyncio worker pool with bounded semaphore (AST validation passed)',
      '> OS Executor: Ran sandboxed verification in local container (0 errors, execution took 18ms)',
      '// [SWARM RESOLVED]: Complete multi-agent pipeline executed in 92ms.',
    ],
  },
  {
    id: 'marketing',
    num: '02',
    title: 'BYTESENTINEL AI MARKETING',
    shortTitle: 'Marketing Concurrency Engine',
    category: 'High-Throughput Microservice Architecture',
    tagline: 'Led a 10-member engineering team cutting content generation latency by ~85% (600s to 89s).',
    heroMetric: { val: '~85%', label: 'Latency Cut (600s→89s)' },
    metrics: [
      { val: '~85%', label: 'Latency Reduction' },
      { val: '10', label: 'Engineers Led' },
      { val: '6', label: 'Docker Microservices' },
      { val: '0s', label: 'Cascading Downtime' },
    ],
    problem:
      'Sequential content generation pipelines took ~10 minutes (600s), microservices experienced cascading failures during third-party API rate limits, and lead scoring lacked qualification precision.',
    solution:
      'Engineered an independent LangChain RAG microservice on locally hosted DeepSeek-R1 & Qwen 2.5 via Ollama with automated fallback, a fault-tolerant FastAPI JWT/RBAC gateway with custom circuit breaker, and ThreadPoolExecutor concurrency across 5 content formats.',
    decisions: [
      {
        title: 'ThreadPoolExecutor Concurrency',
        desc: 'Parallelized asynchronous generation across 5 content formats (blogs, newsletters, social, ad copy, outreach), collapsing total execution from 600s to 89s.',
      },
      {
        title: 'Custom Circuit Breaker Pattern',
        desc: 'Implemented failure state machine (Closed → Open → Half-Open) isolating third-party LLM rate-limit spikes from crashing the API gateway.',
      },
      {
        title: 'Dual Local LLM Fallback (DeepSeek-R1 & Qwen)',
        desc: 'Self-hosted Ollama cluster dynamically routes complex reasoning to DeepSeek-R1 and high-throughput extraction to Qwen 2.5 7B.',
      },
      {
        title: 'Automated Headless Lead Ingestion',
        desc: 'Playwright scraper pipeline with Redis token caching (88.4% hit ratio) and transactional PostgreSQL persistence.',
      },
    ],
    chips: ['FastAPI', 'LangChain', 'DeepSeek-R1', 'Qwen 2.5', 'Ollama', 'ChromaDB', 'Playwright', 'Redis', 'Docker Compose'],
    benchmark: {
      baselineLabel: 'Sequential Synchronous Pipeline',
      baselineVal: '600.4s (~10 mins)',
      optimizedLabel: 'ThreadPoolExecutor Parallel Architecture',
      optimizedVal: '89.2s (~1.5 mins)',
      cutPct: '85.1%',
      description: 'Concurrent asynchronous workers generate 5 content formats simultaneously with Redis caching and zero cascading outages.',
    },
    nodes: [
      {
        id: 'gateway',
        name: 'API Gateway',
        subtitle: 'FastAPI + JWT',
        role: 'RBAC verification & request dispatch',
        latency: '12ms',
        metric: '99.9% Uptime',
        badge: 'SECURITY',
      },
      {
        id: 'breaker',
        name: 'Circuit Breaker',
        subtitle: 'Resilience Core',
        role: 'Automated isolation against rate-limit spikes',
        latency: '2ms',
        metric: '0s Outages',
        badge: 'RESILIENCE',
      },
      {
        id: 'pool',
        name: 'Concurrency Pool',
        subtitle: 'ThreadPoolExecutor',
        role: 'Parallel fan-out across 5 content formats',
        latency: '4ms',
        metric: '16 Workers',
        badge: 'PIPELINE',
      },
      {
        id: 'rag',
        name: 'LangChain RAG',
        subtitle: 'DeepSeek-R1 + Qwen',
        role: 'Dual-LLM reasoning & contextual extraction',
        latency: '45ms',
        metric: '148 Tok/s',
        badge: 'LOCAL LLM',
      },
      {
        id: 'cache',
        name: 'Redis Cache',
        subtitle: 'Distributed KV',
        role: 'Sub-millisecond token & prompt caching',
        latency: '3ms',
        metric: '88.4% Hit',
        badge: 'CACHE',
      },
      {
        id: 'db',
        name: 'PostgreSQL Vault',
        subtitle: 'SQLAlchemy ORM',
        role: 'Transactional ACID storage for marketing leads',
        latency: '16ms',
        metric: '10K+ Leads',
        badge: 'DATABASE',
      },
    ],
    connections: [
      { from: 'gateway', to: 'breaker' },
      { from: 'breaker', to: 'pool' },
      { from: 'pool', to: 'rag' },
      { from: 'rag', to: 'cache' },
      { from: 'cache', to: 'db' },
    ],
    logs: [
      '// [BENCHMARK RUNNER]: Evaluating Synchronous Sequential vs Concurrent Architecture',
      '> Baseline: Synchronous sequential execution across 5 content formats: 600.4 seconds',
      '> Spawning ThreadPoolExecutor: 16 asynchronous worker threads allocated',
      '> Circuit Breaker: State = CLOSED (0 faults recorded across gateway and scraper)',
      '> Dual-LLM Routing: DeepSeek-R1 handling reasoning; Qwen 2.5 handling copy extraction',
      '> Redis Layer: Cache hit ratio evaluated at 88.4% (saved ~42,000 external API tokens)',
      '> Database Persistence: Transaction committed to PostgreSQL via SQLAlchemy in 16ms',
      '// [BENCHMARK COMPLETE]: Latency reduced from 600.4s -> 89.2s (~85.1% total reduction).',
    ],
  },
  {
    id: 'erp',
    num: '03',
    title: 'BYTESENTINEL AI ERP / HRMS',
    shortTitle: 'Enterprise HRMS & Payroll',
    category: 'Enterprise 7-Portal Operations Platform',
    tagline: '7 role-based enterprise portals across 9/10 roadmap phases with Indian statutory payroll.',
    heroMetric: { val: '7 Portals', label: 'Role-Based Portals' },
    metrics: [
      { val: '7', label: 'Role-Based Portals' },
      { val: '9/10', label: 'Roadmap Phases Shipped' },
      { val: 'Dual', label: 'Sequential Sign-off' },
      { val: '100%', label: 'Statutory Compliance' },
    ],
    problem:
      'Enterprise HR, statutory payroll (PF, ESI, TDS), and candidate hiring operated across fragmented tools with high compliance risk, error-prone manual calculations, and slow review cycles.',
    solution:
      'Architected 7 role-based enterprise portals (FastAPI, React 18, TypeScript, PostgreSQL) with automated Indian statutory payroll enforcing strict sequential dual approval (HR approval → Finance sign-off → WeasyPrint PDF payslips via Celery/MinIO) and Gemini/Groq AI resume screening.',
    decisions: [
      {
        title: '7 Isolated Role-Based Portals',
        desc: 'SuperAdmin, HR, Finance, Employee, Manager, Recruiter, and Client portals with granular JWT/RBAC security boundaries.',
      },
      {
        title: 'Strict Dual Sequential Approval',
        desc: 'HR approval automatically enforces an immutable audit trail before the Finance CFO can authorize payroll disbursement.',
      },
      {
        title: 'Automated Indian Statutory Engine',
        desc: 'Accurately calculates Provident Fund (PF), Employee State Insurance (ESI), and TDS tax slabs with zero human miscalculation.',
      },
      {
        title: 'Cryptographic PDF Generation & MinIO',
        desc: 'Celery asynchronous workers compile payslips via WeasyPrint and securely persist them into MinIO S3 object storage.',
      },
    ],
    chips: ['FastAPI', 'React 18', 'TypeScript', 'PostgreSQL', 'Redis', 'Celery', 'MinIO', 'Google Gemini', 'Groq', 'Docker'],
    nodes: [
      {
        id: 'portals',
        name: '7 Role Portals',
        subtitle: 'React 18 + TS',
        role: 'Granular RBAC for HR, Finance, Employees, Execs',
        latency: 'Instant',
        metric: '7 Portals',
        badge: 'UI ARCH',
      },
      {
        id: 'resume_ai',
        name: 'Resume Screener',
        subtitle: 'Gemini + Groq',
        role: 'Multi-model candidate parsing with Pydantic',
        latency: '68ms',
        metric: 'Structured',
        badge: 'AI INGEST',
      },
      {
        id: 'payroll',
        name: 'Statutory Engine',
        subtitle: 'PF · ESI · TDS',
        role: 'Automated Indian tax & deduction computation',
        latency: '15ms',
        metric: '100% Legal',
        badge: 'FINTECH',
      },
      {
        id: 'approval',
        name: 'Dual Approval Gate',
        subtitle: 'HR ──► Finance',
        role: 'Sequential cryptographic sign-off verification',
        latency: 'Enforced',
        metric: '2-Tier Gate',
        badge: 'GOVERNANCE',
      },
      {
        id: 'celery',
        name: 'Celery Queue',
        subtitle: 'Redis Broker',
        role: 'Distributed asynchronous task workers',
        latency: '8ms',
        metric: 'Non-blocking',
        badge: 'ASYNC',
      },
      {
        id: 'vault',
        name: 'MinIO Vault',
        subtitle: 'WeasyPrint PDF',
        role: 'Cryptographic PDF payslip generation & storage',
        latency: '35ms',
        metric: 'S3 Secure',
        badge: 'STORAGE',
      },
    ],
    connections: [
      { from: 'portals', to: 'resume_ai' },
      { from: 'resume_ai', to: 'payroll' },
      { from: 'payroll', to: 'approval' },
      { from: 'approval', to: 'celery' },
      { from: 'celery', to: 'vault' },
    ],
    logs: [
      '// [ENTERPRISE HRMS INITIATED]: Processing statutory payroll run (Cycle: Current Month)',
      '> Portal Gate: HR Manager submitted batch attendance & salary structure for 450 employees',
      '> Statutory Core: Calculated PF (12%), ESI (0.75%), and TDS tax slab per Indian statutory law',
      '> Dual-Approval Gate: Gate 1 (HR Sign-off) [VERIFIED]. Forwarding to Finance Authority',
      '> Finance Gate: CFO digital cryptographic signature authorized [PAYROLL APPROVED]',
      '> Celery Queue: Dispatched 450 asynchronous background PDF generation workers via Redis',
      '> MinIO Vault: WeasyPrint compiled 450 cryptographic PDF payslips; saved to S3 bucket',
      '// [COMPLIANCE COMPLETED]: 100% Statutory compliance verified with complete immutable audit trail.',
    ],
  },
  {
    id: 'retina',
    num: '04',
    title: 'HEALTHCARE COMPUTER VISION',
    shortTitle: 'Diabetic Retinopathy CV',
    category: 'Applied Clinical Computer Vision',
    tagline: 'Hybrid CNN, ResNet & EfficientNet transfer learning grading 5 severity classes at 92%+ accuracy.',
    heroMetric: { val: '92%+', label: 'Clinical Accuracy' },
    metrics: [
      { val: '92%+', label: 'Clinical Accuracy' },
      { val: '-40%', label: 'Manual Screening Time' },
      { val: '5', label: 'Severity Classes Graded' },
      { val: '62ms', label: 'Inference Latency' },
    ],
    problem:
      'Manual grading of fundus retinal photographs by ophthalmologists creates massive clinical diagnostic bottlenecks in rural and overburdened healthcare clinics.',
    solution:
      'Engineered an end-to-end computer vision pipeline using OpenCV circular crop and CLAHE illumination normalization, followed by a transfer-learning ensemble of ResNet-50 and EfficientNet-B4 classifying 5 severity stages (Normal, Mild, Moderate, Severe, PDR).',
    decisions: [
      {
        title: 'OpenCV CLAHE Contrast Equalization',
        desc: 'Removes clinical illumination artifacts and isolates fine retinal blood vessels across diverse camera hardware.',
      },
      {
        title: 'Dual Ensemble Backbone (ResNet + EfficientNet)',
        desc: 'ResNet-50 captures global retinal lesions while EfficientNet-B4 extracts microscopic microaneurysms and hard exudates.',
      },
      {
        title: '5-Stage Clinical Grading',
        desc: 'Full multiclass softmax classifying Normal (0), Mild (1), Moderate (2), Severe (3), and Proliferative PDR (4).',
      },
      {
        title: 'Diagnostic Attention Heatmap',
        desc: 'Grad-CAM visual localization highlighting exact retinal pathology coordinates for clinician sign-off.',
      },
    ],
    chips: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'ResNet-50', 'EfficientNet', 'Scikit-learn', 'MLflow', 'Docker'],
    nodes: [
      {
        id: 'fundus_in',
        name: 'Retinal Ingestion',
        subtitle: '2048x2048 Fundus',
        role: 'High-resolution color fundus photograph loading',
        latency: '4ms',
        metric: 'Color Input',
        badge: 'INGEST',
      },
      {
        id: 'clahe',
        name: 'CLAHE Normalizer',
        subtitle: 'OpenCV Preprocess',
        role: 'Circular mask crop & illumination equalization',
        latency: '15ms',
        metric: 'Contrast Eq',
        badge: 'VISION PREP',
      },
      {
        id: 'resnet',
        name: 'ResNet-50 Backbone',
        subtitle: 'Deep Transfer ML',
        role: 'Global spatial feature & lesion embeddings',
        latency: '24ms',
        metric: 'Spatial Map',
        badge: 'BACKBONE 1',
      },
      {
        id: 'efficientnet',
        name: 'EfficientNet-B4',
        subtitle: 'Compound Scaling',
        role: 'Microaneurysms & exudate fine-grain detection',
        latency: '22ms',
        metric: 'Micro Features',
        badge: 'BACKBONE 2',
      },
      {
        id: 'ensemble',
        name: 'Softmax Fusion',
        subtitle: 'Ensemble Calibrator',
        role: 'Probability distribution over 5 severity stages',
        latency: '5ms',
        metric: '92%+ Acc',
        badge: 'CLASSIFIER',
      },
      {
        id: 'gradcam',
        name: 'Grad-CAM Heatmap',
        subtitle: 'Clinical Explainability',
        role: 'Pathology localization bounding coordinates',
        latency: '12ms',
        metric: 'Explainable AI',
        badge: 'CLINICAL DX',
      },
    ],
    connections: [
      { from: 'fundus_in', to: 'clahe' },
      { from: 'clahe', to: 'resnet' },
      { from: 'clahe', to: 'efficientnet' },
      { from: 'resnet', to: 'ensemble' },
      { from: 'efficientnet', to: 'ensemble' },
      { from: 'ensemble', to: 'gradcam' },
    ],
    logs: [
      '// [HEALTHCARE CV PIPELINE]: Loading fundus retinal image (Patient ID: #RET-8429)',
      '> OpenCV CLAHE: Applied circular retina crop; normalized illumination & vascular contrast (15ms)',
      '> ResNet-50 Backbone: Extracted global spatial embeddings; detected macula & optic disc landmarks (24ms)',
      '> EfficientNet-B4 Backbone: Evaluated microvascular lesions, cotton wool spots & dot hemorrhages (22ms)',
      '> Ensemble Fusion: Combined multi-scale logits via calibrated softmax classifier',
      '> Diagnostic Classification: Class 2 (Moderate NPDR) diagnosed with 94.6% clinical confidence',
      '> Grad-CAM Explainability: Generated diagnostic attention heatmap isolating microaneurysms at [x: 412, y: 388]',
      '// [INFERENCE COMPLETED]: Clinical diagnostic report rendered in 62ms total inference latency.',
    ],
  },
]

export default function ProductionSystems() {
  const { theme } = useStore()
  const [activeSystemId, setActiveSystemId] = useState<'bujji' | 'marketing' | 'erp' | 'retina'>('bujji')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [isRunningPipeline, setIsRunningPipeline] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(-1)
  const [liveLogs, setLiveLogs] = useState<string[]>([])
  const [raceProgress, setRaceProgress] = useState(0)
  const [viewMode, setViewMode] = useState<'pipeline' | '3dtree'>('pipeline')

  const activeSystem = SYSTEMS.find((s) => s.id === activeSystemId) || SYSTEMS[0]
  const logTerminalRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight
    }
  }, [liveLogs])

  // Reset states on system switch
  useEffect(() => {
    setActiveNodeId(null)
    setIsRunningPipeline(false)
    setActiveStep(-1)
    setLiveLogs(activeSystem.logs.slice(0, 3))
    setRaceProgress(0)
  }, [activeSystemId])

  // Run the Interactive Architectural Pipeline
  const handleTriggerPipeline = () => {
    if (isRunningPipeline) return
    sound.playPortalWarp()
    setIsRunningPipeline(true)
    setActiveStep(0)
    setLiveLogs([activeSystem.logs[0]])
    setRaceProgress(0)

    const totalNodes = activeSystem.nodes.length
    let currentStep = 0

    // Concurrency benchmark race progression if marketing
    let raceInterval: ReturnType<typeof setInterval> | null = null
    if (activeSystem.id === 'marketing') {
      let progress = 0
      raceInterval = setInterval(() => {
        progress += 14
        if (progress >= 100) {
          progress = 100
          if (raceInterval) clearInterval(raceInterval)
        }
        setRaceProgress(progress)
      }, 150)
    }

    const stepInterval = setInterval(() => {
      currentStep++
      if (currentStep < totalNodes) {
        setActiveStep(currentStep)
        setActiveNodeId(activeSystem.nodes[currentStep].id)
        sound.playBrickHit(420 + currentStep * 40)

        // Add log
        if (currentStep < activeSystem.logs.length) {
          setLiveLogs((prev) => [...prev, activeSystem.logs[currentStep]])
        }
      } else {
        // Complete
        clearInterval(stepInterval)
        if (raceInterval) clearInterval(raceInterval)
        setActiveStep(totalNodes)
        setActiveNodeId(null)
        setIsRunningPipeline(false)
        setRaceProgress(100)
        sound.playPortalWarp()

        // Append final logs
        setLiveLogs(activeSystem.logs)
      }
    }, 450)
  }

  return (
    <section
      id="systems"
      className="py-24 sm:py-32 relative border-t select-none scroll-mt-16 transition-colors duration-500"
    >
      {/* Background Soft Studio Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/3 w-[650px] h-[650px] rounded-full blur-[160px] pointer-events-none transition-opacity duration-700 ${
            theme === 'dark' ? 'bg-white/[0.02]' : 'bg-amber-500/[0.04]'
          }`}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-12 max-w-7xl relative z-10">
        
        {/* ── SECTION HEADER & VIEW CONTROLS ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 pb-6 border-b border-white/[0.08] gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.03] text-white/60 font-mono text-xs uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>03 // PRODUCTION SYSTEMS ARCHITECTURE</span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-[76px] text-white tracking-tight uppercase leading-[0.92]">
              ENGINEERED SYSTEMS.
            </h2>
            <p className="font-body text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
              Explore the production architecture of 4 flagship platforms. Click below to inspect live data conduits, 
              interactive microservice pipelines, and latency benchmarks.
            </p>
          </div>

          {/* View Mode Toggle: Interactive Pipeline vs 3D Tree */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md">
            <button
              onClick={() => {
                sound.playClick()
                setViewMode('pipeline')
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>⚡ Interactive Pipeline</span>
            </button>

            <button
              onClick={() => {
                sound.playClick()
                setViewMode('3dtree')
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === '3dtree'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🌿 3D Orbit Tree</span>
            </button>
          </div>
        </div>

        {/* ── 4 FLAGSHIP SYSTEMS SELECTOR TABS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SYSTEMS.map((sys) => {
            const isActive = activeSystemId === sys.id
            return (
              <button
                key={sys.id}
                onClick={() => {
                  sound.playClick()
                  setActiveSystemId(sys.id)
                }}
                onMouseEnter={() => sound.playHover()}
                className={`p-4 rounded-xl border text-left transition-all duration-300 relative flex flex-col justify-between group cursor-pointer ${
                  isActive
                    ? 'border-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.12)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/50 mb-1">
                    <span>SYS // {sys.num}</span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/20'
                      }`}
                    />
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-titanium transition-colors">
                    {sys.title}
                  </h4>
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                    {sys.category}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-baseline justify-between">
                  <span className="font-mono text-[10px] text-white/50 uppercase">Key Proof</span>
                  <span className="font-display font-bold text-sm text-emerald-400">
                    {sys.heroMetric.val}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── CONDITIONAL VIEW: 3D TREE OR INTERACTIVE ARCHITECTURAL PIPELINE ── */}
        {viewMode === '3dtree' ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d13]/90 backdrop-blur-xl p-6 min-h-[550px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="font-mono text-xs text-white/60 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span>3D Cybernetic Architecture Tree · Click branches to inspect</span>
              </div>
              <button
                onClick={() => setViewMode('pipeline')}
                className="text-white/60 hover:text-white font-mono text-xs uppercase underline cursor-pointer"
              >
                Switch to Live Pipeline →
              </button>
            </div>
            <div className="w-full h-[480px]">
              <Systems3DTree
                activeId={activeSystemId}
                onSelectSystem={(id) => setActiveSystemId(id as 'bujji' | 'marketing' | 'erp' | 'retina')}
              />
            </div>
          </div>
        ) : (
          /* ── MAIN DIRECTION 1: THE INTERACTIVE ARCHITECTURAL PIPELINE ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* ── LEFT COLUMN (cols 1-5): EXECUTIVE ARCHITECTURAL DOSSIER ── */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                {/* Dossier Header */}
                <div>
                  <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <span>SYSTEM {activeSystem.num} DOSSIER</span>
                    <span className="text-white/20">/</span>
                    <span className="text-emerald-400 font-semibold">PRODUCTION VERIFIED</span>
                  </div>
                  <h3 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight uppercase leading-tight">
                    {activeSystem.title}
                  </h3>
                  <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed mt-2">
                    {activeSystem.tagline}
                  </p>
                </div>

                {/* 4 Quantitative Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {activeSystem.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md"
                    >
                      <div className="font-display font-bold text-2xl text-white tracking-tight">
                        {m.val}
                      </div>
                      <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Problem vs Solution */}
                <div className="space-y-3 p-4 rounded-xl border border-white/[0.08] bg-[#0c0d13]/80 backdrop-blur-md font-body text-xs sm:text-sm">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider block mb-1">
                      ENGINEERING CHALLENGE
                    </span>
                    <p className="text-white/60 leading-relaxed">{activeSystem.problem}</p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.06]">
                    <span className="font-mono text-[10px] uppercase text-emerald-400 tracking-wider block mb-1">
                      ARCHITECTURAL SOLUTION
                    </span>
                    <p className="text-white/90 leading-relaxed">{activeSystem.solution}</p>
                  </div>
                </div>

                {/* Key Architectural Decisions */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
                    <span>KEY ARCHITECTURAL DECISIONS</span>
                  </h5>
                  <div className="space-y-2">
                    {activeSystem.decisions.map((dec, i) => (
                      <div
                        key={dec.title}
                        className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.015] hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-display text-xs font-semibold text-white mb-0.5">
                          <span className="font-mono text-[10px] text-emerald-400">0{i + 1}</span>
                          <span>{dec.title}</span>
                        </div>
                        <p className="font-body text-xs text-white/60 leading-relaxed pl-5">
                          {dec.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="pt-4 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1.5">
                  {activeSystem.chips.map((chip) => (
                    <span
                      key={chip}
                      className="px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-white/60 font-mono text-[10px] uppercase tracking-wider"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN (cols 6-12): ILLUMINATED ARCHITECTURAL PIPELINE & TELEMETRY ── */}
            <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0d13]/90 backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              
              {/* Top Pipeline Bar */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/[0.08] mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                      {activeSystem.shortTitle}
                    </h4>
                    <p className="font-mono text-[10px] text-white/40 uppercase">
                      ACTIVE ARCHITECTURE BLUEPRINT · {activeSystem.nodes.length} STAGES
                    </p>
                  </div>
                </div>

                {/* Primary Trigger Button */}
                <button
                  onClick={handleTriggerPipeline}
                  disabled={isRunningPipeline}
                  className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    isRunningPipeline
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-white text-black hover:bg-white/90 font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                  }`}
                >
                  <span>{isRunningPipeline ? '▶ Executing Pipeline...' : '▶ Run Live Pipeline'}</span>
                </button>
              </div>

              {/* ── THE INTERACTIVE SYSTEM BLUEPRINT NODES ── */}
              <div className="relative py-2 mb-6">
                
                {/* Visual Conduit Flow Banner */}
                <div className="hidden sm:flex items-center justify-between px-2 mb-3 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  <span>INPUT INGESTION</span>
                  <span>── CONCURRENT DISPATCH ──►</span>
                  <span>PRODUCTION OUTPUT</span>
                </div>

                {/* Grid of Microservice / Agent Pipeline Nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                  {activeSystem.nodes.map((node, idx) => {
                    const isNodeActive = activeStep === idx
                    const isNodeComplete = activeStep > idx || activeStep === activeSystem.nodes.length
                    const isSelected = activeNodeId === node.id

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          sound.playClick()
                          setActiveNodeId(node.id)
                        }}
                        onMouseEnter={() => sound.playHover()}
                        className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                          isNodeActive
                            ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(52,211,153,0.25)] scale-[1.02]'
                            : isNodeComplete
                              ? 'border-white/30 bg-white/[0.04]'
                              : isSelected
                                ? 'border-white bg-white/10'
                                : 'border-white/10 bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.03]'
                        }`}
                      >
                        {/* Status Pulse Bar */}
                        {isNodeActive && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-pulse" />
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 text-white/60 tracking-wider">
                              {node.badge}
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-[10px]">
                              {isNodeActive ? (
                                <span className="text-emerald-400 font-bold animate-pulse">● ACTIVE</span>
                              ) : isNodeComplete ? (
                                <span className="text-emerald-400">✓ {node.latency}</span>
                              ) : (
                                <span className="text-white/40">{node.latency}</span>
                              )}
                            </div>
                          </div>

                          <h5 className="font-display font-bold text-sm text-white tracking-tight">
                            {node.name}
                          </h5>
                          <div className="font-mono text-[10px] text-white/50 mb-1">
                            {node.subtitle}
                          </div>
                          <p className="font-body text-xs text-white/60 leading-tight">
                            {node.role}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px]">
                          <span className="text-white/40 uppercase">METRIC:</span>
                          <span className="text-white/90 font-medium">{node.metric}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── MARKETING BENCHMARK RACE BAR (IF APPLICABLE) ── */}
              {activeSystem.benchmark && (
                <div className="p-4 rounded-xl border border-white/10 bg-black/60 mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                      BENCHMARK TELEMETRY // SEQUENTIAL VS CONCURRENT
                    </span>
                    <span className="font-display font-bold text-sm text-emerald-400">
                      {activeSystem.benchmark.cutPct} LATENCY REDUCTION
                    </span>
                  </div>

                  {/* Sequential Baseline Bar (600s) */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-white/50">
                      <span>Baseline (Sequential 5 Formats)</span>
                      <span className="text-rose-400 font-semibold">{activeSystem.benchmark.baselineVal}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="w-full h-full bg-rose-500/70" />
                    </div>
                  </div>

                  {/* ThreadPoolExecutor Concurrency Bar (89s) */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-white/70">
                      <span>ThreadPoolExecutor Parallel Pipeline (Optimized)</span>
                      <span className="text-emerald-400 font-bold">{activeSystem.benchmark.optimizedVal}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-400 shadow-[0_0_12px_#34d399]"
                        style={{ width: `${Math.max(15, raceProgress * 0.15)}%` }}
                        animate={{ width: isRunningPipeline ? `${15 + raceProgress * 0.85 * 0.15}%` : '15%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── REAL-TIME EXECUTION LOG TERMINAL ── */}
              <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-white/40 text-[10px] uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>REAL-TIME PIPELINE TRACE STREAM</span>
                  </div>
                  <span>{activeSystem.heroMetric.val}</span>
                </div>

                <div
                  ref={logTerminalRef}
                  className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin text-white/80 leading-relaxed pr-2"
                >
                  {liveLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith('//')
                          ? 'text-emerald-400 font-bold'
                          : log.startsWith('>')
                            ? 'text-white/80 pl-2'
                            : 'text-white/50'
                      }
                    >
                      {log}
                    </div>
                  ))}
                  {isRunningPipeline && (
                    <div className="text-emerald-400 animate-pulse pl-2 font-bold">
                      &gt; Streaming asynchronous tokens...
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}
