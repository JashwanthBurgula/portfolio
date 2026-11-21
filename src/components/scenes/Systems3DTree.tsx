import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Float } from '@react-three/drei'
import * as THREE from 'three'
import { sound } from '@/utils/sound'
import { useStore } from '@/store'

export interface Systems3DTreeProps {
  activeId: string
  onSelectSystem: (id: string) => void
}

// 4 Flagship Tree Branches
const TREE_BRANCHES = [
  {
    id: 'bujji',
    num: '01',
    title: 'BUJJI AI',
    sub: '7-Agent Swarm',
    metric: '<3% CPU · Offline Vosk',
    color: '#34d399', // Emerald
    glowColor: 'rgba(52, 211, 153, 0.4)',
    angle: 0.25 * Math.PI,
    radius: 2.2,
    height: 1.8,
    subNodes: [
      { name: 'Wake Agent', dx: 0.4, dy: 0.3, dz: 0.2 },
      { name: 'Whisper STT', dx: -0.3, dy: 0.4, dz: 0.3 },
      { name: '3-Tier Router', dx: 0.2, dy: 0.6, dz: -0.3 },
      { name: 'CodeForge', dx: -0.4, dy: 0.2, dz: -0.2 },
      { name: 'ChromaDB RAG', dx: 0.5, dy: -0.2, dz: 0.3 },
    ],
  },
  {
    id: 'marketing',
    num: '02',
    title: 'AI MARKETING',
    sub: 'Concurrency Pipeline',
    metric: '85% Latency Cut (600s→89s)',
    color: '#38bdf8', // Sky Cyan
    glowColor: 'rgba(56, 189, 248, 0.4)',
    angle: 0.75 * Math.PI,
    radius: 2.3,
    height: 2.0,
    subNodes: [
      { name: 'ThreadPool Pool', dx: 0.3, dy: 0.4, dz: 0.3 },
      { name: 'DeepSeek-R1', dx: -0.4, dy: 0.5, dz: 0.1 },
      { name: 'LangChain RAG', dx: 0.2, dy: 0.6, dz: -0.3 },
      { name: 'Circuit Breaker', dx: -0.3, dy: 0.2, dz: -0.4 },
      { name: 'Redis Cache', dx: 0.4, dy: -0.2, dz: 0.2 },
    ],
  },
  {
    id: 'erp',
    num: '03',
    title: 'AI ERP / HRMS',
    sub: 'Enterprise Matrix',
    metric: '7 Portals · Dual Sign-off',
    color: '#fbbf24', // Amber
    glowColor: 'rgba(251, 191, 36, 0.4)',
    angle: 1.35 * Math.PI,
    radius: 2.4,
    height: 1.7,
    subNodes: [
      { name: 'Dual Approval', dx: 0.4, dy: 0.4, dz: 0.2 },
      { name: 'Statutory PF/ESI', dx: -0.3, dy: 0.5, dz: 0.3 },
      { name: 'Celery Queues', dx: 0.2, dy: 0.6, dz: -0.3 },
      { name: 'MinIO Vault', dx: -0.4, dy: 0.3, dz: -0.2 },
      { name: 'AI Resume Screener', dx: 0.5, dy: -0.2, dz: 0.4 },
    ],
  },
  {
    id: 'retina',
    num: '04',
    title: 'HEALTHCARE CV',
    sub: 'Clinical Classifier',
    metric: '92%+ Clinical Accuracy',
    color: '#c084fc', // Violet
    glowColor: 'rgba(192, 132, 252, 0.4)',
    angle: 1.85 * Math.PI,
    radius: 2.2,
    height: 1.9,
    subNodes: [
      { name: 'CLAHE Normalizer', dx: 0.3, dy: 0.4, dz: 0.2 },
      { name: 'ResNet-50', dx: -0.3, dy: 0.5, dz: 0.3 },
      { name: 'EfficientNet-B4', dx: 0.2, dy: 0.6, dz: -0.3 },
      { name: '5-Stage Head', dx: -0.4, dy: 0.3, dz: -0.2 },
      { name: 'MLflow Pipeline', dx: 0.4, dy: -0.2, dz: 0.3 },
    ],
  },
]

// Glowing Data Pulses traveling along branches
function EnergyPulse({ curve, color, speed = 1, offset = 0 }: { curve: THREE.CatmullRomCurve3; color: string; speed?: number; offset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = ((clock.getElapsedTime() * speed * 0.35 + offset) % 1)
    const pt = curve.getPointAt(t)
    meshRef.current.position.copy(pt)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// Single Branch Model
function TreeBranchItem({
  branch,
  isActive,
  onSelect,
}: {
  branch: (typeof TREE_BRANCHES)[0]
  isActive: boolean
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  const bx = Math.cos(branch.angle) * branch.radius
  const bz = Math.sin(branch.angle) * branch.radius
  const by = branch.height

  // Main branch curved spline from trunk (0, 0.4, 0) to branch tip (bx, by, bz)
  const { curve, tubeGeom } = useMemo(() => {
    const p0 = new THREE.Vector3(0, 0.4, 0)
    const p1 = new THREE.Vector3(bx * 0.35, by * 0.45, bz * 0.35)
    const p2 = new THREE.Vector3(bx * 0.75, by * 0.85, bz * 0.75)
    const p3 = new THREE.Vector3(bx, by, bz)
    const c = new THREE.CatmullRomCurve3([p0, p1, p2, p3])
    const geom = new THREE.TubeGeometry(c, 24, isActive || hovered ? 0.055 : 0.038, 8, false)
    return { curve: c, tubeGeom: geom }
  }, [bx, by, bz, isActive, hovered])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // Gentle breathing pulsation
    const t = clock.getElapsedTime() + branch.angle
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* Branch Tube */}
      <mesh
        geometry={tubeGeom}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
          sound.playHover()
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
          sound.playClick()
        }}
      >
        <meshStandardMaterial
          color={isActive ? branch.color : hovered ? '#f8fafc' : '#334155'}
          emissive={isActive ? branch.color : hovered ? branch.color : '#0f172a'}
          emissiveIntensity={isActive ? 1.4 : hovered ? 0.9 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Energy Pulses climbing the branch */}
      <EnergyPulse curve={curve} color={branch.color} speed={1.2} offset={0} />
      <EnergyPulse curve={curve} color="#ffffff" speed={1.2} offset={0.5} />

      {/* Branch Node Core Cluster */}
      <group position={[bx, by, bz]}>
        {/* Central Multifaceted Core Diamond */}
        <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.5}>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
              sound.playHover()
            }}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
              sound.playClick()
            }}
          >
            <octahedronGeometry args={[isActive ? 0.22 : 0.17, 0]} />
            <meshStandardMaterial
              color={isActive ? '#ffffff' : branch.color}
              emissive={branch.color}
              emissiveIntensity={isActive ? 1.8 : hovered ? 1.2 : 0.6}
              roughness={0.1}
              metalness={0.9}
              wireframe={!isActive && !hovered}
            />
          </mesh>
        </Float>

        {/* Outer Glowing Energy Shell */}
        <mesh>
          <sphereGeometry args={[isActive ? 0.32 : 0.24, 16, 16]} />
          <meshBasicMaterial
            color={branch.color}
            transparent
            opacity={isActive ? 0.35 : hovered ? 0.25 : 0.12}
            wireframe
          />
        </mesh>

        {/* Sub-branches / Microservice Leaves */}
        {branch.subNodes.map((sub, idx) => {
          const subX = sub.dx * 1.3
          const subY = sub.dy * 1.3
          const subZ = sub.dz * 1.3

          return (
            <group key={sub.name}>
              {/* Connector line */}
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...(() => {
                    const geom = new THREE.BufferGeometry().setFromPoints([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(subX, subY, subZ),
                    ])
                    return geom
                  })()}
                />
                <lineBasicMaterial
                  color={isActive ? branch.color : '#475569'}
                  transparent
                  opacity={isActive ? 0.6 : 0.25}
                />
              </line>

              {/* Sub-node leaf */}
              <mesh position={[subX, subY, subZ]}>
                <sphereGeometry args={[isActive ? 0.05 : 0.038, 12, 12]} />
                <meshStandardMaterial
                  color={isActive ? branch.color : '#94a3b8'}
                  emissive={branch.color}
                  emissiveIntensity={isActive ? 1.2 : 0.3}
                />
              </mesh>
            </group>
          )
        })}

        {/* 3D Floating HTML Label */}
        <Html
          position={[0, 0.42, 0]}
          center
          distanceFactor={6.5}
          className="pointer-events-none select-none transition-all duration-300"
        >
          <div
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
              sound.playClick()
            }}
            className={`pointer-events-auto cursor-pointer px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 whitespace-nowrap shadow-xl flex items-center gap-2 ${
              isActive
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
                : hovered
                ? 'bg-[#0f172a]/95 text-white border-white/40 scale-100'
                : 'bg-[#090A0E]/80 text-white/70 border-white/15 scale-95 hover:border-white/40'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: branch.color,
                boxShadow: isActive ? `0 0 10px ${branch.color}` : 'none',
              }}
            />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {branch.num} {branch.title}
            </span>
            <span className="text-[10px] opacity-60 font-mono hidden sm:inline">
              [{branch.metric}]
            </span>
          </div>
        </Html>
      </group>
    </group>
  )
}

// Tree Root Trunk & Cyber Ground Grid
function TreeRootTrunk() {
  const ringsRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ringsRef.current) return
    const t = clock.getElapsedTime()
    ringsRef.current.rotation.y = t * 0.15
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Root Base Plate / Runtime Platform */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.4, 1.8, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Outer Cyber Circuit Ring */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.75, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} wireframe />
      </mesh>

      {/* Main Central Trunk Conduit */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.18, 0.32, 1.0, 16]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Rotating Conduit Core Rings */}
      <group ref={ringsRef} position={[0, 0.45, 0]}>
        {[0.15, 0.4, 0.65, 0.9].map((y, i) => (
          <mesh key={i} position={[0, y - 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22 - i * 0.02, 0.015, 8, 24]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Core Root HTML Label */}
      <Html position={[0, -0.25, 0]} center distanceFactor={7} className="pointer-events-none select-none">
        <div className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm bg-black/80 border border-white/10 text-white/50 backdrop-blur-sm whitespace-nowrap">
          RUNTIME ROOT // JASHWANTH PRODUCTION PLATFORM
        </div>
      </Html>
    </group>
  )
}

// Floating Cyber Stardust Leaves
function CanopyFloatingParticles({ count = 180 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const rad = 0.6 + Math.random() * 2.6
      const x = Math.cos(theta) * rad
      const z = Math.sin(theta) * rad
      const y = 0.5 + Math.random() * 2.2

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      // Titanium ice & emerald stardust
      col[i * 3] = 0.8 + Math.random() * 0.2
      col[i * 3 + 1] = 0.9 + Math.random() * 0.1
      col[i * 3 + 2] = 1.0
    }

    return { positions: pos, colors: col }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime() * 0.12
    pointsRef.current.rotation.y = t
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function Systems3DTree({
  activeId,
  onSelectSystem,
}: Systems3DTreeProps) {
  const { theme } = useStore()

  return (
    <div
      className={`relative w-full h-[460px] sm:h-[540px] lg:h-[580px] rounded-2xl border overflow-hidden select-none group transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-[#090A0E]/60 border-white/[0.08]'
          : 'bg-white/80 border-black/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 2.6, 5.2], fov: 44 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={theme === 'dark' ? 0.4 : 0.8} />
        <pointLight position={[0, 4, 2]} intensity={1.5} color="#ffffff" />
        <pointLight position={[3, 2, 3]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[-3, 2, -3]} intensity={0.8} color="#34d399" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={Math.PI / 4.5}
          dampingFactor={0.05}
        />

        {/* Central Architecture Trunk & Platform */}
        <TreeRootTrunk />

        {/* 4 Flagship Architecture Branches */}
        {TREE_BRANCHES.map((branch) => (
          <TreeBranchItem
            key={branch.id}
            branch={branch}
            isActive={activeId === branch.id}
            onSelect={() => onSelectSystem(branch.id)}
          />
        ))}

        {/* Floating Ambient Stardust Canopy */}
        <CanopyFloatingParticles count={220} />
      </Canvas>

      {/* Top Overlay HUD Navigation & Telemetry */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-black/70 border-white/10 text-white/80'
              : 'bg-white/90 border-black/10 text-slate-800 shadow-sm'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase font-medium">
            INTERACTIVE 3D SYSTEM ARCHITECTURE TREE
          </span>
        </div>

        <div
          className={`font-mono text-[9px] uppercase tracking-widest hidden sm:block ${
            theme === 'dark' ? 'text-white/40' : 'text-slate-500'
          }`}
        >
          DRAG TO ORBIT · CLICK BRANCH TO INSPECT
        </div>
      </div>

      {/* Bottom Branch Quick-Selector Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-2 z-10 pointer-events-none">
        {TREE_BRANCHES.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectSystem(b.id)}
            className={`pointer-events-auto font-mono text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-2 ${
              activeId === b.id
                ? theme === 'dark'
                  ? 'bg-white text-black font-semibold border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-slate-900 text-white font-semibold border-slate-900 shadow-md'
                : theme === 'dark'
                ? 'bg-black/80 text-white/60 border-white/15 hover:border-white/40 hover:text-white'
                : 'bg-white/90 text-slate-700 border-black/10 hover:border-black/30 hover:text-black shadow-xs'
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: b.color }}
            />
            <span>{b.num} {b.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
