import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 01: Multi-Agent Network Loop
function MultiAgentLoop() {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.8
      ref.current.rotation.x += delta * 0.4
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#22D3EE"
          wireframe
          emissive="#22D3EE"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Central coordinator core */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={2} />
      </mesh>
      {/* Orbiting agent satellites */}
      {[0, 1, 2, 3, 4, 5].map((idx) => {
        const angle = (idx / 6) * Math.PI * 2
        return (
          <mesh key={idx} position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#22D3EE" />
          </mesh>
        )
      })}
    </group>
  )
}

// 02: Vector RAG Lattice
function VectorRAGLoop() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
      ref.current.rotation.z += delta * 0.3
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.3, 1.3, 1.3]} />
        <meshStandardMaterial
          color="#A855F7"
          wireframe
          emissive="#A855F7"
          emissiveIntensity={1.0}
        />
      </mesh>
      {/* Latent space cluster points */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.sin(i * 1.3) * 0.5),
            (Math.cos(i * 1.7) * 0.5),
            (Math.sin(i * 2.1) * 0.5),
          ]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#22D3EE' : '#FF3B30'} />
        </mesh>
      ))}
    </group>
  )
}

// 03: Sonic Waveform Sphere
function VoiceWaveLoop() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime
      ref.current.rotation.y = t * 0.6
      const s = 1.0 + Math.sin(t * 4.0) * 0.12
      ref.current.scale.set(s, s, s)
    }
  })

  return (
    <group>
      <mesh ref={ref}>
        <torusGeometry args={[0.8, 0.22, 16, 50]} />
        <meshStandardMaterial
          color="#22D3EE"
          wireframe
          emissive="#22D3EE"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Outer audio pulse ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.25, 32]} />
        <meshBasicMaterial color="#FF3B30" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// 04: Stacked Vision Layers (CNN/ViT)
function VisionLayersLoop() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={ref} position={[0, -0.2, 0]}>
      {[-0.6, -0.2, 0.2, 0.6].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          <mesh>
            <planeGeometry args={[1.2 - idx * 0.15, 1.2 - idx * 0.15]} />
            <meshStandardMaterial
              color={idx === 3 ? '#FF3B30' : '#22D3EE'}
              wireframe
              emissive={idx === 3 ? '#FF3B30' : '#22D3EE'}
              emissiveIntensity={1.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function WhatIBuild3DScene({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 select-none">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-2, -2, 2]} intensity={1.8} color="#22D3EE" />

        {activeIndex === 0 && <MultiAgentLoop />}
        {activeIndex === 1 && <VectorRAGLoop />}
        {activeIndex === 2 && <VoiceWaveLoop />}
        {activeIndex === 3 && <VisionLayersLoop />}
      </Canvas>
    </div>
  )
}
