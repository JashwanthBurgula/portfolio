import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BujjiWorldProps {
  onRoute?: (agent: string) => void
}

const AGENTS = [
  { id: 'vosk', name: 'Vosk (<3% CPU)', icon: '🎙️', tier: 'Wake Word' },
  { id: 'whisper', name: 'Whisper STT', icon: '📝', tier: 'Speech' },
  { id: 'codeforge', name: 'CodeForge', icon: '⚡', tier: 'Self-Healing' },
  { id: 'vision', name: 'Vision UI Auto', icon: '👁️', tier: 'Desktop' },
  { id: 'chroma', name: 'ChromaDB Memory', icon: '🧠', tier: 'RAG' },
  { id: 'desktop', name: 'Desktop OS', icon: '💻', tier: 'Actions' },
  { id: 'tts', name: 'Bilingual TTS', icon: '🔊', tier: 'Audio' },
]

// Holographic audio-reactive orb in 3D
function HolographicAudioOrb({ audioLevel }: { audioLevel: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.x += delta * 0.3
      const scale = 1.0 + audioLevel * 0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.05
      meshRef.current.scale.set(scale, scale, scale)
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.6
      outerRingRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group>
      {/* Central pulsating core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshStandardMaterial
          color="#22D3EE"
          wireframe
          emissive="#22D3EE"
          emissiveIntensity={1.5 + audioLevel * 2.0}
        />
      </mesh>

      {/* Outer audio waveform rings */}
      <group ref={outerRingRef}>
        <mesh>
          <ringGeometry args={[1.2, 1.25, 32]} />
          <meshBasicMaterial color="#FF3B30" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.35, 1.4, 32]} />
          <meshBasicMaterial color="#22D3EE" side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// 7 Orbiting Agent Nodes in 3D
function OrbitingAgentsGroup({ activeAgentId }: { activeAgentId: string | null }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      {AGENTS.map((agent, i) => {
        const angle = (i / AGENTS.length) * Math.PI * 2
        const r = 2.1
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        const isActive = activeAgentId === agent.id

        return (
          <group key={agent.id} position={[x, Math.sin(angle * 2) * 0.35, z]}>
            <mesh scale={isActive ? 1.4 : 1.0}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial
                color={isActive ? '#FF3B30' : '#22D3EE'}
                emissive={isActive ? '#FF3B30' : '#22D3EE'}
                emissiveIntensity={isActive ? 3.0 : 1.2}
              />
            </mesh>
            {/* Pulsing halo */}
            {isActive && (
              <mesh>
                <ringGeometry args={[0.22, 0.28, 16]} />
                <meshBasicMaterial color="#FF3B30" side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function Bujji3DWorld() {
  const [audioLevel, setAudioLevel] = useState(0.2)
  const [activeAgent, setActiveAgent] = useState<string | null>('codeforge')
  const [currentTier, setCurrentTier] = useState<number>(2) // 0: Rules, 1: Qwen2.5, 2: Gemini
  const [language, setLanguage] = useState<'EN' | 'TE'>('EN')
  const [caption, setCaption] = useState<string>('Say "Hey Bujji" or test a command below')
  const [listening, setListening] = useState(false)

  // Real or synthetic Web Audio API handler
  const startMic = async () => {
    try {
      setListening(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
        const avg = sum / dataArray.length
        setAudioLevel(avg / 128)
        requestAnimationFrame(checkAudio)
      }
      checkAudio()
      setCaption(language === 'EN' ? 'Listening via real microphone... "Hey Bujji!"' : 'మైక్రోఫోన్ ద్వారా వింటున్నాను... "హే బుజ్జి!"')
    } catch {
      // Synthetic fallback
      setListening(true)
      const interval = setInterval(() => {
        setAudioLevel(0.3 + Math.random() * 0.6)
      }, 100)
      setCaption(language === 'EN' ? 'Simulating speech input... "Hey Bujji, fix bug in agent.py"' : 'వాయిస్ ఇన్పుట్ పరీక్షిస్తున్నాం... "బుజ్జి, కోడ్ సరిచేయి"')
      setTimeout(() => {
        clearInterval(interval)
        setAudioLevel(0.2)
        setListening(false)
      }, 4000)
    }
  }

  const triggerCommand = (cmd: string, targetAgent: string, tier: number, teText: string) => {
    setActiveAgent(targetAgent)
    setCurrentTier(tier)
    setAudioLevel(0.8)
    setCaption(language === 'EN' ? `Routing: "${cmd}"` : `రూట్ చేస్తోంది: "${teText}"`)
    setTimeout(() => setAudioLevel(0.2), 1500)
  }

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-cyan-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD Bar */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">BUJJI AI HOLOGRAPHIC CORE</span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700/50">
            VOSK &lt;3% CPU
          </span>
        </div>

        {/* Language switch */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setLanguage('EN')
              setCaption('Switched to English captions')
            }}
            className={`font-mono text-[10px] px-2 py-0.5 border ${
              language === 'EN' ? 'border-cyan-400 text-cyan-300 bg-cyan-900/40' : 'border-white/10 text-white/30'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => {
              setLanguage('TE')
              setCaption('తెలుగు సంభాషణ ఆన్ చేయబడింది')
            }}
            className={`font-mono text-[10px] px-2 py-0.5 border ${
              language === 'TE' ? 'border-cyan-400 text-cyan-300 bg-cyan-900/40' : 'border-white/10 text-white/30'
            }`}
          >
            తెలుగు (TE)
          </button>
        </div>
      </div>

      {/* 3D Canvas Center */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 3]} intensity={2.0} color="#22D3EE" />
          <pointLight position={[3, 2, 2]} intensity={1.5} color="#FF3B30" />
          <HolographicAudioOrb audioLevel={audioLevel} />
          <OrbitingAgentsGroup activeAgentId={activeAgent} />
        </Canvas>
      </div>

      {/* 3-Tier LLM Funnel Overlay (Right edge) */}
      <div className="absolute top-16 right-4 z-10 flex flex-col gap-1.5 text-right pointer-events-none">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">3-Tier Routing Funnel</span>
        {[
          { tier: 0, label: 'Tier 1: Rules & Regex (<10ms)' },
          { tier: 1, label: 'Tier 2: Qwen2.5 7B (Local RAG)' },
          { tier: 2, label: 'Tier 3: Gemini Pro (Complex Code)' },
        ].map((t) => (
          <div
            key={t.tier}
            className={`font-mono text-[9px] px-2 py-1 rounded transition-all ${
              currentTier === t.tier
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_#22D3EE50]'
                : 'text-white/30'
            }`}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Orbiting Agent Labels Legend (Left edge) */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1 text-left pointer-events-none">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">7-Agent Swarm</span>
        {AGENTS.map((a) => (
          <div
            key={a.id}
            className={`font-mono text-[9px] transition-all flex items-center gap-1 ${
              activeAgent === a.id ? 'text-cyan-300 font-bold translate-x-1' : 'text-white/20'
            }`}
          >
            <span>{a.icon}</span>
            <span>{a.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom Controls & Dynamic Captions */}
      <div className="z-10 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-cyan-300 truncate max-w-[70%]">
            &gt; {caption}
          </div>
          <button
            onClick={startMic}
            className={`px-3 py-1 font-mono text-xs font-bold border transition-all ${
              listening
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
            }`}
          >
            {listening ? '● LISTENING' : '🎙️ SAY "HEY BUJJI"'}
          </button>
        </div>

        {/* Demo command triggers */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
          <span className="font-mono text-[8px] text-white/30 flex items-center pr-1">TRY PROMPT:</span>
          <button
            onClick={() => triggerCommand('CodeForge: Auto-heal syntax error in agent.py', 'codeforge', 2, 'కోడ్‌ఫోర్జ్: agent.py లో సింటాక్స్ ఎర్రర్ రిపేర్ చేయి')}
            className="font-mono text-[9px] px-2 py-0.5 border border-white/10 text-white/60 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ⚡ CodeForge Self-Heal
          </button>
          <button
            onClick={() => triggerCommand('Vosk wake word: CPU load check', 'vosk', 0, 'వాస్క్ వేక్ వర్డ్: CPU వినియోగం తనిఖీ')}
            className="font-mono text-[9px] px-2 py-0.5 border border-white/10 text-white/60 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
          >
            📉 &lt;3% CPU Vosk Test
          </button>
          <button
            onClick={() => triggerCommand('UI Vision: Extract table from active window', 'vision', 1, 'UI విజన్: యాక్టివ్ విండో నుండి డేటా తీయి')}
            className="font-mono text-[9px] px-2 py-0.5 border border-white/10 text-white/60 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
          >
            👁️ Vision UI Automation
          </button>
        </div>
      </div>
    </div>
  )
}
