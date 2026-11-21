import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { particleVertexShader, particleFragmentShader } from '@/shaders/particleShader'

interface ParticleProps {
  progress: number
}

function ParticleField({ progress }: ParticleProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const count = 1600

  const [positions, randomness, scales, alphas] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)
    const sc = new Float32Array(count)
    const al = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0

      if (i < count * 0.35) {
        // Head / Face ellipse
        const angle = Math.random() * Math.PI * 2
        const r = Math.sqrt(Math.random()) * 0.45
        x = Math.cos(angle) * r
        y = Math.sin(angle) * r * 1.25 + 0.9
        z = (Math.random() - 0.5) * 0.2
      } else if (i < count * 0.75) {
        // Shoulders & Chest (Arms crossed)
        x = (Math.random() - 0.5) * 1.5
        const shoulderProfile = Math.cos(x * 1.8) * 0.25 - 0.1
        y = (Math.random() - 0.5) * 0.85 + shoulderProfile + 0.1
        z = (Math.random() - 0.5) * 0.3
      } else {
        // Lower torso / legs
        x = (Math.random() - 0.5) * 1.1
        y = (Math.random() - 0.5) * 1.2 - 0.9
        z = (Math.random() - 0.5) * 0.25
      }

      pos[i * 3 + 0] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      rnd[i * 3 + 0] = (Math.random() - 0.3) * 1.8 // Drift bias to the right
      rnd[i * 3 + 1] = (Math.random() - 0.5) * 1.2
      rnd[i * 3 + 2] = (Math.random() - 0.5) * 1.5

      sc[i] = Math.random() * 0.04 + 0.02
      al[i] = Math.random() * 0.6 + 0.4
    }

    return [pos, rnd, sc, al]
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  )

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
      matRef.current.uniforms.uProgress.value = progress
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandomness" args={[randomness, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function HeroParticleTransition({ progress }: { progress: number }) {
  if (progress <= 0.02) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-25 transition-opacity duration-300"
      style={{ opacity: Math.min(progress * 2.2, 1) }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <ParticleField progress={progress} />
      </Canvas>
    </div>
  )
}
