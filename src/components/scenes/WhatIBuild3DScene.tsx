import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface WhatIBuild3DSceneProps {
  activeIndex: number
}

// ── SHARED GLASS PHYSICAL MATERIAL ──
const glassProps = {
  color: '#ffffff',
  transmission: 0.92,
  roughness: 0.06,
  metalness: 0.08,
  ior: 1.52,
  thickness: 0.7,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  transparent: true,
  opacity: 0.95,
}

// ── 01: AGENTIC AI (3 glass nodes orbiting a red glowing core) ──
function AgenticIcon() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.2
    }
    if (coreRef.current) {
      const p = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      coreRef.current.scale.set(p, p, p)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Red Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial
          color="#FF3B30"
          emissive="#FF3B30"
          emissiveIntensity={3.5}
          roughness={0.2}
        />
      </mesh>
      <pointLight color="#FF3B30" intensity={6} distance={4} />

      {/* 3 Orbiting Glass Nodes */}
      {[0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3
        const r = 1.05
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh>
              <sphereGeometry args={[0.24, 24, 24]} />
              <meshPhysicalMaterial {...glassProps} />
            </mesh>
            {/* Small red internal node spark */}
            <mesh>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={2.5} />
            </mesh>
          </group>
        )
      })}

      {/* Outer subtle orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.012, 16, 64]} />
        <meshStandardMaterial color="#FF3B30" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

// ── 02: RAG & KNOWLEDGE (Glass database cylinder with floating document cards) ──
function RAGIcon() {
  const groupRef = useRef<THREE.Group>(null)
  const cardsRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
    if (cardsRef.current) {
      cardsRef.current.rotation.y -= delta * 0.9
    }
  })

  return (
    <group ref={groupRef}>
      {/* Stack of 3 glass database cylinders */}
      {[-0.38, 0, 0.38].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.65, 0.65, 0.28, 32]} />
            <meshPhysicalMaterial {...glassProps} />
          </mesh>
          {/* Internal red data ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.015, 16, 32]} />
            <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}
      <pointLight color="#FF3B30" intensity={5} distance={4} />

      {/* Floating document cards orbiting */}
      <group ref={cardsRef}>
        {[0, 1, 2].map((i) => {
          const angle = (i * Math.PI * 2) / 3
          const r = 1.15
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * r, Math.sin(angle) * 0.3, Math.sin(angle) * r]}
              rotation={[0.2, angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.34, 0.46, 0.03]} />
              <meshPhysicalMaterial {...glassProps} roughness={0.15} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// ── 03: VOICE AI (Glass microphone with ring waveforms) ──
function VoiceIcon() {
  const groupRef = useRef<THREE.Group>(null)
  const wave1Ref = useRef<THREE.Mesh>(null)
  const wave2Ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6
    }
    const t = state.clock.elapsedTime
    if (wave1Ref.current) {
      const s1 = 1.0 + (t % 1.5) * 0.6
      wave1Ref.current.scale.set(s1, s1, s1)
      ;(wave1Ref.current.material as THREE.Material).opacity = Math.max(0, 1 - (t % 1.5) / 1.5)
    }
    if (wave2Ref.current) {
      const s2 = 1.0 + ((t + 0.75) % 1.5) * 0.6
      wave2Ref.current.scale.set(s2, s2, s2)
      ;(wave2Ref.current.material as THREE.Material).opacity = Math.max(0, 1 - ((t + 0.75) % 1.5) / 1.5)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Microphone Glass Capsule */}
      <mesh position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 16, 32]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>

      {/* Inner Red Acoustic Core */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.45, 16]} />
        <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 0.25, 0]} color="#FF3B30" intensity={5} distance={3} />

      {/* Stand Base */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.08} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.06, 24]} />
        <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Expanding Ring Waveforms */}
      <mesh ref={wave1Ref} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.015, 16, 64]} />
        <meshBasicMaterial color="#FF3B30" transparent opacity={0.8} />
      </mesh>
      <mesh ref={wave2Ref} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.015, 16, 64]} />
        <meshBasicMaterial color="#FF3B30" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// ── 04: COMPUTER VISION (Glass eye with scanning red line) ──
function ComputerVisionIcon() {
  const groupRef = useRef<THREE.Group>(null)
  const scannerRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.35
    }
    if (scannerRef.current) {
      // Smooth vertical scanning oscillation
      scannerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.2) * 0.55
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer Glass Eyeball / Lens */}
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>

      {/* Red Glowing Pupil / Iris */}
      <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.1, 32]} />
        <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={3.5} />
      </mesh>
      <pointLight position={[0, 0, 0.5]} color="#FF3B30" intensity={6} distance={4} />

      {/* Horizontal Scanning Red Laser Line */}
      <mesh ref={scannerRef} position={[0, 0, 0.6]}>
        <boxGeometry args={[1.7, 0.025, 0.02]} />
        <meshBasicMaterial color="#FF3B30" />
      </mesh>

      {/* Subtle outer tech bracket ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.95, 0.012, 16, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// ── SHARED R3F CANVAS WITH MODEL SWAPPING ──
export default function WhatIBuild3DScene({ activeIndex }: WhatIBuild3DSceneProps) {
  return (
    <div className="w-[280px] h-[280px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={1.5} color="#FF3B30" />

        <Float speed={2.0} rotationIntensity={0.25} floatIntensity={0.35}>
          {activeIndex === 0 && <AgenticIcon />}
          {activeIndex === 1 && <RAGIcon />}
          {activeIndex === 2 && <VoiceIcon />}
          {activeIndex === 3 && <ComputerVisionIcon />}
        </Float>
      </Canvas>
    </div>
  )
}
