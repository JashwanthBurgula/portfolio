import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ServiceNode {
  id: string
  name: string
  pos: [number, number, number]
  color: string
}

const SERVICES: ServiceNode[] = [
  { id: 'gateway', name: 'API Gateway (FastAPI/JWT)', pos: [0, 1.2, 0], color: '#22D3EE' },
  { id: 'rag', name: 'LangChain RAG (ChromaDB)', pos: [-1.6, 0.3, 0.4], color: '#A855F7' },
  { id: 'scraper', name: 'Playwright Scraper', pos: [1.6, 0.3, 0.4], color: '#22C55E' },
  { id: 'redis', name: 'Redis Cache Layer', pos: [-1.2, -1.0, -0.2], color: '#F59E0B' },
  { id: 'crm', name: 'SQLAlchemy CRM', pos: [1.2, -1.0, -0.2], color: '#3B82F6' },
  { id: 'ollama', name: 'Ollama (DeepSeek-R1 / Qwen2.5)', pos: [0, -1.4, 0.5], color: '#FF3B30' },
]

// Glowing data packets flowing between constellation nodes
function DataPackets({ killedService }: { killedService: string | null }) {
  const pointsRef = useRef<THREE.Points>(null)
  const packetCount = 40

  const [positions, targets, speeds] = useMemo(() => {
    const pos = new Float32Array(packetCount * 3)
    const tgt = new Float32Array(packetCount * 3)
    const spd = new Float32Array(packetCount)

    for (let i = 0; i < packetCount; i++) {
      const srcIdx = Math.floor(Math.random() * SERVICES.length)
      let dstIdx = Math.floor(Math.random() * SERVICES.length)
      if (dstIdx === srcIdx) dstIdx = (srcIdx + 1) % SERVICES.length

      pos[i * 3 + 0] = SERVICES[srcIdx].pos[0]
      pos[i * 3 + 1] = SERVICES[srcIdx].pos[1]
      pos[i * 3 + 2] = SERVICES[srcIdx].pos[2]

      tgt[i * 3 + 0] = SERVICES[dstIdx].pos[0]
      tgt[i * 3 + 1] = SERVICES[dstIdx].pos[1]
      tgt[i * 3 + 2] = SERVICES[dstIdx].pos[2]

      spd[i] = 0.015 + Math.random() * 0.025
    }
    return [pos, tgt, spd]
  }, [])

  useFrame(() => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position

      for (let i = 0; i < packetCount; i++) {
        let px = posAttr.getX(i)
        let py = posAttr.getY(i)
        let pz = posAttr.getZ(i)

        const tx = targets[i * 3 + 0]
        const ty = targets[i * 3 + 1]
        const tz = targets[i * 3 + 2]

        const dx = tx - px
        const dy = ty - py
        const dz = tz - pz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < 0.1) {
          // Re-pick random active source and target
          const activeServices = SERVICES.filter(s => s.id !== killedService)
          const s = activeServices[Math.floor(Math.random() * activeServices.length)]
          const d = activeServices[Math.floor(Math.random() * activeServices.length)]

          px = s.pos[0]
          py = s.pos[1]
          pz = s.pos[2]

          targets[i * 3 + 0] = d.pos[0]
          targets[i * 3 + 1] = d.pos[1]
          targets[i * 3 + 2] = d.pos[2]
        } else {
          px += (dx / dist) * speeds[i]
          py += (dy / dist) * speeds[i]
          pz += (dz / dist) * speeds[i]
        }

        posAttr.setXYZ(i, px, py, pz)
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={killedService ? '#FF3B30' : '#22D3EE'}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function ConstellationMesh({ killedService }: { killedService: string | null }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  // Constellation network links
  const linePoints = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < SERVICES.length; i++) {
      for (let j = i + 1; j < SERVICES.length; j++) {
        pts.push(...SERVICES[i].pos)
        pts.push(...SERVICES[j].pos)
      }
    }
    return new Float32Array(pts)
  }, [])

  return (
    <group ref={groupRef}>
      {/* Network lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePoints, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </lineSegments>

      {/* Nodes */}
      {SERVICES.map((s) => {
        const isKilled = killedService === s.id
        return (
          <group key={s.id} position={s.pos}>
            <mesh scale={isKilled ? 1.3 : 1.0}>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshStandardMaterial
                color={isKilled ? '#FF0000' : s.color}
                emissive={isKilled ? '#FF0000' : s.color}
                emissiveIntensity={isKilled ? 3.5 : 1.2}
              />
            </mesh>
            {isKilled && (
              <mesh>
                <ringGeometry args={[0.28, 0.36, 24]} />
                <meshBasicMaterial color="#FF0000" side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        )
      })}

      <DataPackets killedService={killedService} />
    </group>
  )
}

export default function MarketingConstellation3D() {
  const [killedService, setKilledService] = useState<string | null>(null)
  const [circuitTripped, setCircuitTripped] = useState(false)
  const [fallbackActive, setFallbackActive] = useState(false)

  const toggleKillService = (id: string) => {
    if (killedService === id) {
      setKilledService(null)
      setCircuitTripped(false)
      setFallbackActive(false)
    } else {
      setKilledService(id)
      setCircuitTripped(true)
      setTimeout(() => setFallbackActive(true), 600)
    }
  }

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-red-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${circuitTripped ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
          <span className="font-mono text-xs font-bold text-warm-white tracking-wider">
            6-SERVICE DOCKER CONSTELLATION
          </span>
          <span className={`font-mono text-[9px] px-1.5 py-0.5 border ${circuitTripped ? 'border-red-500 text-red-400 bg-red-950/60' : 'border-green-500 text-green-400 bg-green-950/60'}`}>
            {circuitTripped ? 'CIRCUIT BREAKER: TRIPPED (ISOLATED)' : 'CIRCUIT: CLOSED (HEALTHY)'}
          </span>
        </div>

        {fallbackActive && (
          <div className="font-mono text-[9px] text-cyan-300 bg-cyan-950/70 border border-cyan-500 px-2 py-0.5 animate-pulse">
            REROUTED → Qwen2.5 FALLBACK
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.4], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 3]} intensity={1.5} color="#22D3EE" />
          <pointLight position={[3, 2, 2]} intensity={1.5} color="#FF3B30" />
          <ConstellationMesh killedService={killedService} />
        </Canvas>
      </div>

      {/* Service list legend (Left) */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">Microservices</span>
        {SERVICES.map((s) => (
          <div
            key={s.id}
            className={`font-mono text-[9px] flex items-center gap-1.5 ${
              killedService === s.id ? 'text-red-400 font-bold line-through' : 'text-white/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: killedService === s.id ? '#FF0000' : s.color }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      {/* Latency race comparison (Right) */}
      <div className="absolute top-16 right-4 z-10 bg-black/70 border border-white/10 p-3 rounded-sm space-y-2 pointer-events-none w-56">
        <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">
          ~85% Latency Reduction Race
        </div>
        <div>
          <div className="flex justify-between font-mono text-[9px] text-white/40 mb-1">
            <span>Sequential Pipeline</span>
            <span>600s</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded overflow-hidden">
            <div className="h-full bg-red-500/70 w-full" />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-[9px] text-cyan-400 mb-1">
            <span>Parallel Microservices</span>
            <span className="font-bold">90s (-85%)</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded overflow-hidden">
            <div className="h-full bg-cyan-400 w-[15%]" />
          </div>
        </div>
      </div>

      {/* Bottom interactive controls */}
      <div className="z-10 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-white/60">
            SIMULATE FAULT TOLERANCE &amp; CIRCUIT BREAKER:
          </span>
          <span className="font-mono text-[9px] text-white/30">
            {killedService ? `Service ${killedService.toUpperCase()} is DOWN` : 'All 6 services operational'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleKillService(s.id)}
              className={`font-mono text-[10px] px-2.5 py-1 border transition-all ${
                killedService === s.id
                  ? 'border-red-500 text-red-400 bg-red-950/80 animate-pulse'
                  : 'border-white/15 text-white/60 hover:border-red-400 hover:text-red-300'
              }`}
            >
              {killedService === s.id ? `RESTART ${s.id.toUpperCase()}` : `TRIP ${s.id.toUpperCase()}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
