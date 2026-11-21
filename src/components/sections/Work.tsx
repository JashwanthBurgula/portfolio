import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound } from '@/utils/sound'

const WorkDoorsCorridor = lazy(() => import('@/components/scenes/WorkDoorsCorridor'))
const Bujji3DWorld = lazy(() => import('@/components/scenes/worlds/Bujji3DWorld'))
const MarketingConstellation3D = lazy(() => import('@/components/scenes/worlds/MarketingConstellation3D'))
const ERPBuilding3D = lazy(() => import('@/components/scenes/worlds/ERPBuilding3D'))

const WORLDS_DATA = [
  {
    num: '01',
    title: 'BUJJI AI',
    subtitle: 'Voice-First Autonomous Desktop Assistant (Personal Flagship)',
    pitch: 'Autonomous Windows voice assistant with a 7-agent swarm for English and Telugu — offline Vosk wake word (<3% CPU), Whisper STT, 3-tier routing, and CodeForge self-healing code generation.',
    story: {
      problem: 'Traditional desktop assistants depend on continuous cloud connections, waste 20-30% CPU at idle, suffer high latency, and lack regional language comprehension (English + Telugu).',
      build: 'Architected a 7-agent swarm with offline Vosk wake-word (<3% CPU), Whisper speech recognition, three-tier LLM routing (Rules → Qwen2.5 7B via Ollama → Google Gemini API), OpenCV vision perception, and CodeForge self-healing code generation.',
      result: 'Shipped a responsive, offline-capable assistant with sub-second voice execution, multi-agent task dispatch, self-correcting script execution, and seamless English/Telugu command routing.',
    },
    metrics: [
      { value: '7', label: 'Agent Swarm' },
      { value: '<3%', label: 'Idle CPU' },
      { value: 'English + Telugu', label: 'Bilingual STT' },
    ],
    chips: ['Python', 'Whisper', 'Vosk', 'Ollama (Qwen2.5)', 'Google Gemini', 'ChromaDB', 'Pydantic', 'Electron', 'pywinauto', 'OpenCV'],
    highlights: ['7-Agent Swarm', 'Offline Vosk (<3% CPU)', '3-Tier Routing Funnel', 'CodeForge Self-Healing', 'English + Telugu', 'ChromaDB Memory'],
    deepDive: [
      { label: 'Voice Pipeline', detail: 'Vosk offline wake-word detector (<3% idle CPU) seamlessly triggers Faster-Whisper local STT with bilingual English and Telugu phoneme mapping.' },
      { label: '3-Tier LLM Routing', detail: 'Tier 1: Regex & rule-based engine (<5ms, zero token cost) → Tier 2: Local Qwen2.5 7B via Ollama (private & offline) → Tier 3: Google Gemini API fallback with Pydantic structured outputs.' },
      { label: 'Autonomous Perception', detail: 'OpenCV screen perception and pywinauto GUI automation for desktop orchestration, paired with CodeForge self-healing agent and ChromaDB embeddings.' },
    ],
  },
  {
    num: '02',
    title: 'BYTESENTINEL AI MARKETING',
    subtitle: 'AI Marketing & Lead-Generation Platform (Team Lead)',
    pitch: 'Led a 10-member engineering team delivering a full-stack microservices marketing platform, cutting content-generation latency by ~85% (600s to 90s) with custom circuit breaker resilience.',
    story: {
      problem: 'Content generation took ~10 minutes (600s) through sequential pipelines, microservices suffered cascading outages on API rate limits, and manual lead scoring lacked qualification precision.',
      build: 'Engineered an independent LangChain RAG microservice on locally hosted DeepSeek-R1 & Qwen2.5 via Ollama with automated model-fallback, a fault-tolerant FastAPI JWT/RBAC gateway with custom circuit breaker, and Playwright lead scraping with AI scoring.',
      result: 'Reduced generation latency by ~85% (from ~600s to ~90s) by parallelizing workflows with ThreadPoolExecutor across 5 content formats with 6-service Docker Compose deployment and zero downtime.',
    },
    metrics: [
      { value: '~85%', label: 'Latency Cut (600s→90s)' },
      { value: '10', label: 'Engineers Led' },
      { value: '6', label: 'Docker Microservices' },
    ],
    chips: ['LangChain', 'DeepSeek-R1', 'Qwen2.5', 'Ollama', 'ChromaDB', 'FastAPI', 'Playwright', 'Redis', 'SQLAlchemy', 'Docker Compose'],
    highlights: ['10 Engineers Led', '~85% Latency Reduction', 'Custom Circuit Breaker', 'ThreadPoolExecutor Parallelism', 'AI Lead Scoring', '6 Docker Services'],
    deepDive: [
      { label: 'Multi-Agent Concurrency', detail: 'ThreadPoolExecutor concurrent generation across 5 content formats (blogs, social posts, newsletters, ad copies, outreach) cutting runtime from 600s to 90s.' },
      { label: 'Circuit Breaker Gateway', detail: 'FastAPI gateway with JWT/RBAC and custom circuit-breaker pattern isolating failures between LangChain RAG, Playwright scraper, and CRM microservices.' },
      { label: 'Scraping & Lead Scoring', detail: 'Automated Playwright headless lead ingestion paired with AI-driven qualification scoring, cached in Redis and persisted via SQLAlchemy on PostgreSQL.' },
    ],
  },
  {
    num: '03',
    title: 'BYTESENTINEL AI ERP / HRMS',
    subtitle: 'Enterprise HR & Operations Platform (Team Lead)',
    pitch: 'Led 10 engineers delivering a seven-portal enterprise HRMS across 9 of 10 roadmap phases — featuring Indian statutory payroll with HR-to-Finance dual approval and Gemini & Groq AI resume screening.',
    story: {
      problem: 'Enterprise HR, payroll calculations, compliance reporting, and candidate hiring operated across fragmented tools with high compliance risk and slow manual review cycles.',
      build: 'Architected 7 role-based enterprise portals (FastAPI, React 18, TypeScript, PostgreSQL) with Indian statutory payroll (PF, ESI, TDS), Gemini & Groq resume screening, and a RAG policy assistant.',
      result: 'Automated full payroll pipeline (HR approval → Finance approval → WeasyPrint PDF payslips via Celery/MinIO) and shipped 9 of 10 roadmap phases in enterprise production.',
    },
    metrics: [
      { value: '7', label: 'Enterprise Portals' },
      { value: '9/10', label: 'Phases Shipped' },
      { value: 'Dual-Approval', label: 'Statutory Payroll' },
    ],
    chips: ['FastAPI', 'React 18', 'TypeScript', 'PostgreSQL', 'Redis', 'Celery', 'MinIO', 'Alembic', 'Google Gemini', 'Groq', 'WeasyPrint', 'Docker Compose', 'Nginx'],
    highlights: ['7 Role-Based Portals', '9/10 Phases Shipped', 'HR→Finance Dual Approval', 'Gemini & Groq Resume AI', 'WeasyPrint PDF Payslips', 'RAG Policy Assistant'],
    deepDive: [
      { label: 'Statutory Payroll Pipeline', detail: 'Automated Indian statutory payroll enforcing strict sequential approval (HR approval → Finance sign-off → PDF generation) with automated PF, ESI, and TDS calculations.' },
      { label: 'AI Resume Screening', detail: 'Multi-model candidate evaluation pipeline using Google Gemini and Groq LLMs with structured Pydantic schemas evaluating candidate fit against JD embeddings in ChromaDB.' },
      { label: 'Distributed Async Architecture', detail: 'Asynchronous Celery task queues backed by Redis broker, generating cryptographically verified PDF payslips via WeasyPrint and persisting in MinIO S3 storage.' },
    ],
  },
]

const ADDITIONAL_BUILDS = [
  {
    num: '04',
    category: 'COMPUTER VISION // HEALTHCARE',
    title: 'Diabetic Retinopathy Detection',
    subtitle: 'Stag Innovations Pvt. Ltd. (May 2025 – Jul 2025)',
    description: 'Developed an end-to-end retinal image classification pipeline using CNN, ResNet, and EfficientNet transfer learning with OpenCV preprocessing and augmentation, grading 5 severity classes at 92%+ classification accuracy and reducing manual screening effort by 40%.',
    metrics: [{ value: '92%+', label: 'Accuracy' }, { value: '-40%', label: 'Screening Effort' }, { value: '5', label: 'Severity Classes' }],
    chips: ['Python', 'TensorFlow', 'Keras', 'PyTorch', 'OpenCV', 'Scikit-learn', 'MLflow', 'Streamlit', 'Docker'],
  },
  {
    num: '05',
    category: 'NLP // AGRI-TECH & DIAGNOSTICS',
    title: 'AI Plant Disease Detection Chatbot',
    subtitle: 'Independent NLP System',
    description: 'Engineered an NLP chatbot with Hugging Face Transformers and PyTorch that analyzes plant symptoms and recommends tailored treatments at 90% prediction accuracy; deployed on Microsoft Azure with Docker, Streamlit, CI/CD, and drift monitoring.',
    metrics: [{ value: '90%', label: 'Prediction Accuracy' }, { value: 'Azure', label: 'Cloud Deployment' }, { value: 'CI/CD', label: 'Drift Monitored' }],
    chips: ['Python', 'NLP', 'PyTorch', 'Hugging Face Transformers', 'Streamlit', 'Docker', 'Microsoft Azure', 'CI/CD'],
  },
  {
    num: '06',
    category: 'NLP // SEMANTIC SEARCH & RECSYS',
    title: 'AI-Based Job Recommendation System',
    subtitle: 'Intelligent Candidate Matching Platform',
    description: 'Built an NLP job recommendation engine with automated resume parsing and semantic similarity matching (TF-IDF, Word2Vec, BERT) at 91% accuracy, featuring SQL/Pandas data pipelines, REST API interface, and A/B tested ranking algorithms.',
    metrics: [{ value: '91%', label: 'Semantic Accuracy' }, { value: 'BERT + W2V', label: 'Embeddings' }, { value: 'A/B', label: 'Ranking Tested' }],
    chips: ['Python', 'NLP', 'Scikit-learn', 'Pandas', 'NumPy', 'spaCy', 'NLTK', 'SQL', 'Streamlit', 'REST APIs', 'Docker'],
  },
  {
    num: '07',
    category: 'BIOINFORMATICS // GENOMICS & ML',
    title: 'Cancer-Related Genes Identification',
    subtitle: 'Genomic Sequence Alignment & Biomarker Pipeline',
    description: 'Developed a bioinformatics machine learning pipeline to identify cancer-related genes and potential biomarkers using genomic data analysis, BLAST/NCBI sequence alignment, gene annotation, statistical modeling, and automated NCBI retrieval.',
    metrics: [{ value: 'BLAST', label: 'NCBI Alignment' }, { value: 'Genomic', label: 'Biomarker Pipeline' }, { value: 'Statistical', label: 'Modeling' }],
    chips: ['Python', 'Biopython', 'BLAST', 'NCBI E-Utilities', 'Pandas', 'SQL', 'Matplotlib', 'Statistical Modeling'],
  },
]

export default function Work() {
  const [activeWorld, setActiveWorld] = useState<number | null>(null)
  const [visitedWorlds, setVisitedWorlds] = useState<number[]>([])
  const [step, setStep] = useState<'problem' | 'build' | 'result'>('problem')
  const [isServiceBroken, setIsServiceBroken] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [showDeepDive, setShowDeepDive] = useState(false)

  const handleSelectDoor = (index: number) => {
    setActiveWorld(index)
    setStep('problem')
    setIsServiceBroken(false)
    setShowDeepDive(false)
    if (!visitedWorlds.includes(index)) {
      setVisitedWorlds((prev) => [...prev, index])
    }
  }

  const handleNextWorld = () => {
    if (activeWorld !== null) {
      const next = (activeWorld + 1) % WORLDS_DATA.length
      handleSelectDoor(next)
      sound.playPortalWarp()
    }
  }

  const toggleMic = async () => {
    sound.playClick()
    if (micActive) {
      setMicActive(false)
      setAudioLevel(0)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioCtx = new AudioCtx()
      const analyser = audioCtx.createAnalyser()
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 64
      const data = new Uint8Array(analyser.frequencyBinCount)
      setMicActive(true)

      const tick = () => {
        if (!stream.active) return
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        setAudioLevel(avg / 128)
        requestAnimationFrame(tick)
      }
      tick()
    } catch {
      // Fallback simulated voice oscillation
      setMicActive(true)
      let t = 0
      const iv = setInterval(() => {
        t += 0.15
        setAudioLevel(0.35 + Math.sin(t * 3) * 0.3)
      }, 80)
      setTimeout(() => clearInterval(iv), 10000)
    }
  }

  return (
    <section id="work" className="relative w-full py-24 sm:py-32 bg-[#090A0E] text-[#F8FAFC] select-none scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-12 max-w-7xl">
        
        <AnimatePresence mode="wait">
          {/* ── 1. THE 3D CORRIDOR VIEW (DEFAULT) ── */}
          {activeWorld === null ? (
            <motion.div
              key="corridor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Corridor Intro Header */}
              <div className="flex flex-col items-start mb-10 sm:mb-14">
                <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  <span>03 / SELECTED WORK</span>
                </div>
                <h2
                  className="font-display font-bold text-titanium uppercase tracking-tight leading-none mb-4"
                  style={{ fontSize: 'clamp(44px, 8.5vw, 120px)' }}
                >
                  ENTER THE WORLDS
                </h2>
                <p className="font-body text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
                  Behind each arched glass portal lies a flagship project in its own full-screen 3D world. Hover to inspect, click to enter.
                </p>
              </div>

              {/* 3D Corridor of Arched Glass-and-Metal Doors */}
              <div className="mb-14">
                <Suspense fallback={<div className="h-[420px] glass-panel rounded-2xl flex items-center justify-center font-mono text-xs text-white/30">INITIALIZING 3D CORRIDOR...</div>}>
                  <WorkDoorsCorridor
                    activeDoor={activeWorld}
                    visitedDoors={visitedWorlds}
                    onSelectDoor={handleSelectDoor}
                  />
                </Suspense>
              </div>
            </motion.div>
          ) : (
            /* ── 2. ACTIVE WORLD STAGE (FULL-SCREEN CINEMATIC EXPERIENCE) ── */
            <motion.div
              key={activeWorld}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-[24px] p-6 sm:p-10 relative overflow-hidden mb-16"
            >
              {/* Top Bar with Return to Corridor & Door Counter */}
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
                <button
                  onClick={() => {
                    sound.playClick()
                    setActiveWorld(null)
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer font-medium"
                >
                  <span>←</span>
                  <span>Back to Corridor</span>
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/40 tracking-widest font-medium">
                    WORLD {WORLDS_DATA[activeWorld].num} OF 03
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* World Layout System: Left 40% Text Panel, Right 60% 3D Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* ── TEXT PANEL (LEFT 40% / lg:col-span-5) ── */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                  {/* Number & Title */}
                  <div>
                    <span className="font-mono text-xs font-semibold text-white/40 tracking-widest block mb-2">
                      {WORLDS_DATA[activeWorld].num} / PRODUCTION SYSTEM
                    </span>
                    <div className="flex items-center gap-4">
                      {activeWorld === 0 && (
                        <div className="w-12 h-12 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)] overflow-hidden flex-shrink-0 bg-black">
                          <img src="/bujji-face.jpg" alt="Bujji AI Core" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                          {WORLDS_DATA[activeWorld].title}
                        </h3>
                        <div className="font-mono text-xs text-white/50 mt-1 uppercase tracking-wider font-medium">
                          {WORLDS_DATA[activeWorld].subtitle}
                        </div>
                      </div>
                    </div>
                    <p className="font-body text-white/80 text-base sm:text-[17px] font-medium mt-3 leading-relaxed">
                      {WORLDS_DATA[activeWorld].pitch}
                    </p>
                  </div>

                  {/* Highlights Badge Bar */}
                  <div className="flex flex-wrap gap-1.5">
                    {WORLDS_DATA[activeWorld].highlights.map((badge) => (
                      <span
                        key={badge}
                        className="font-mono text-[11px] text-white/70 px-2 py-0.5 rounded-xs bg-white/[0.04] border border-white/[0.08] font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* 3-Step Story (PROBLEM -> BUILD -> RESULT) */}
                  <div className="border border-white/[0.08] rounded-xl bg-white/[0.02] p-5 space-y-4">
                    {/* Step Switcher Tabs */}
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                      {(['problem', 'build', 'result'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            sound.playClick()
                            setStep(s)
                          }}
                          onMouseEnter={() => sound.playHover()}
                          className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-xs transition-all cursor-pointer ${
                            step === s
                              ? 'bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                              : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Story Text */}
                    <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed min-h-[56px]">
                      {WORLDS_DATA[activeWorld].story[step]}
                    </p>

                    {/* Specific Interactive Controls */}
                    {activeWorld === 0 && (
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={toggleMic}
                          onMouseEnter={() => sound.playHover()}
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase px-3 py-1.5 border border-white/20 bg-white/[0.04] rounded-xs text-white hover:bg-white hover:text-black transition-all cursor-pointer font-medium"
                        >
                          <span>{micActive ? '🎙️ Mic Active (Voice Pulse)' : '🎤 Test Voice Mic'}</span>
                        </button>
                        <span className="font-mono text-[11px] text-white/40">
                          {micActive ? 'Audio reacts to live speech' : 'Waveform simulation'}
                        </span>
                      </div>
                    )}

                    {activeWorld === 1 && (
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={() => {
                            sound.playClick()
                            setIsServiceBroken(!isServiceBroken)
                          }}
                          onMouseEnter={() => sound.playHover()}
                          className={`inline-flex items-center gap-2 font-mono text-xs uppercase px-3 py-1.5 rounded-xs transition-all cursor-pointer font-medium ${
                            isServiceBroken
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                              : 'border border-white/20 bg-white/[0.04] text-white hover:bg-white hover:text-black'
                          }`}
                        >
                          <span>{isServiceBroken ? '✓ Service Tripped (Fallback Active)' : '⚡ Break a Service'}</span>
                        </button>
                        <span className="font-mono text-[11px] text-white/40">
                          {isServiceBroken ? 'Circuit breaker isolated failure' : 'Test fault containment'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Row of 3 Count-Up Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.08]">
                    {WORLDS_DATA[activeWorld].metrics.map((m) => (
                      <div key={m.label} className="flex flex-col">
                        <span className="font-display font-bold text-2xl sm:text-3xl text-white">
                          {m.value}
                        </span>
                        <span className="font-body text-xs text-white/40 mt-1 font-medium">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Row of Tech Chips (13px Mono) */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {WORLDS_DATA[activeWorld].chips.map((chip) => (
                      <span
                        key={chip}
                        className="font-mono text-[13px] text-white/70 px-2.5 py-1 rounded-xs bg-white/[0.03] border border-white/[0.08] font-medium"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Architecture Spec Drawer Toggle & Next World Button */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sound.playClick()
                        setShowDeepDive(!showDeepDive)
                      }}
                      onMouseEnter={() => sound.playHover()}
                      className="font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white underline underline-offset-4 transition-colors cursor-pointer font-medium"
                    >
                      {showDeepDive ? 'Hide Architecture Spec ↑' : 'Technical Architecture Spec ↓'}
                    </button>
                    <button
                      onClick={handleNextWorld}
                      onMouseEnter={() => sound.playHover()}
                      className="inline-flex items-center gap-2 bg-white text-black font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-xs hover:bg-[#e2e8f0] transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer font-medium"
                    >
                      <span>Next world</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Expandable Architecture Spec Drawer */}
                  <AnimatePresence>
                    {showDeepDive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-white/[0.12] rounded-xl bg-white/[0.02] p-4 space-y-3 overflow-hidden"
                      >
                        <div className="font-mono text-[11px] uppercase tracking-widest text-white/60 font-bold">
                          ENGINEERING DEEP DIVE // PRODUCTION SPECS
                        </div>
                        {WORLDS_DATA[activeWorld].deepDive.map((item) => (
                          <div key={item.label} className="text-xs font-body leading-relaxed">
                            <span className="font-mono font-bold text-white block mb-0.5">
                              {item.label}:
                            </span>
                            <span className="text-white/60">{item.detail}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── 3D STAGE (RIGHT 60% / lg:col-span-7) ── */}
                <div className="lg:col-span-7 h-[440px] sm:h-[540px] w-full rounded-2xl bg-[#06070a] border border-white/[0.08] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <div className="absolute top-4 right-5 z-10 font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>3D WORLD // REAL-TIME R3F STAGE</span>
                  </div>

                  {activeWorld === 0 && (
                    <div className="absolute top-4 left-5 z-10 font-mono text-[10px] text-white/90 uppercase tracking-widest flex items-center gap-2 pointer-events-none bg-black/70 px-2.5 py-1 rounded-xs border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>BUJJI 3D HOLOGRAPHIC CORE</span>
                    </div>
                  )}

                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-xs text-white/30">LOADING 3D WORLD...</div>}>
                    {activeWorld === 0 && <Bujji3DWorld step={step} audioLevel={audioLevel} />}
                    {activeWorld === 1 && <MarketingConstellation3D step={step} isServiceBroken={isServiceBroken} />}
                    {activeWorld === 2 && <ERPBuilding3D step={step} />}
                  </Suspense>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3. FOUR MORE BUILDS (AUTHENTIC RESUME FLAGSHIP PROJECTS) ── */}
        <div className="mt-20 pt-12 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>MORE PRODUCTION BUILDS</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight">
                Healthcare CV, Agri-Tech NLP &amp; Genomic Pipelines
              </h3>
            </div>
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest font-medium">
              4 SPECIALISED DEPLOYMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADDITIONAL_BUILDS.map((proj) => (
              <div
                key={proj.num}
                onMouseEnter={() => sound.playHover()}
                className="group border border-white/[0.08] hover:border-white/25 rounded-[18px] bg-white/[0.02] hover:bg-white/[0.04] p-6 sm:p-8 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                      {proj.category}
                    </span>
                    <span className="font-mono text-xs text-white/40 group-hover:text-white transition-colors font-medium">
                      {proj.num}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-1 group-hover:text-titanium transition-colors">
                    {proj.title}
                  </h4>
                  <div className="font-mono text-[11px] text-white/50 mb-4 font-medium">
                    {proj.subtitle}
                  </div>

                  <p className="font-body text-sm sm:text-[15px] text-white/70 leading-relaxed mb-6">
                    {proj.description}
                  </p>
                </div>

                <div>
                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.08] mb-4">
                    {proj.metrics.map((m) => (
                      <div key={m.label} className="flex flex-col">
                        <span className="font-display font-bold text-lg sm:text-xl text-white">
                          {m.value}
                        </span>
                        <span className="font-body text-[11px] text-white/40 font-medium">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.chips.map((chip) => (
                      <span
                        key={chip}
                        className="font-mono text-[12px] text-white/60 px-2 py-0.5 rounded-xs bg-white/[0.03] border border-white/[0.08] font-medium"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
