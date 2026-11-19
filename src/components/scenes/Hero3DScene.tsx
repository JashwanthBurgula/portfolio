import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { depthDisplacementVertexShader, depthDisplacementFragmentShader } from '@/shaders/depthDisplacementShader'
import { particleVertexShader, particleFragmentShader } from '@/shaders/particleShader'

// 3D Orbiting Neural Network Nodes
function NeuralNetworkMesh() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 14; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 0.55 + Math.random() * 0.15
      pts.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ])
    }
    return pts
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
      groupRef.current.rotation.x += delta * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[-1.7, 1.2, 0.5]}>
      {/* Node points */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2.5} />
        </mesh>
      ))}
      {/* Interconnecting lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(nodes.flatMap((p, i) => i > 0 ? [...nodes[i - 1], ...p] : [...p, ...p])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22D3EE" transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

// 3D Glassy AI Chip
function AIChipMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[1.8, 1.1, 0.4]} scale={0.7}>
      <boxGeometry args={[0.8, 0.8, 0.12]} />
      <meshStandardMaterial
        color="#111827"
        metalness={0.9}
        roughness={0.2}
        emissive="#22D3EE"
        emissiveIntensity={0.2}
      />
      {/* Chip golden pins */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.82, 0.82, 0.13)]} />
        <lineBasicMaterial color="#FF3B30" />
      </lineSegments>
      {/* Core die */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
    </mesh>
  )
}

// 3D Vector Database Cylinder
function VectorDBCylinder() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6
      groupRef.current.rotation.z += delta * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[-1.8, -1.1, 0.3]} scale={0.65}>
      {[0, 0.3, 0.6].map((y, i) => (
        <group key={i} position={[0, y - 0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.55, 0.18, 24]} />
            <meshStandardMaterial
              color="#0d2030"
              metalness={0.8}
              roughness={0.3}
              emissive="#22D3EE"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.45, 0.52, 24]} />
            <meshBasicMaterial color="#FF3B30" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// 3D Code Brackets { }
function CodeBracketsMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.12
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[1.7, -1.2, 0.5]} scale={0.8}>
      <mesh position={[-0.25, 0, 0]}>
        <torusGeometry args={[0.25, 0.035, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.25, 0.035, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

// Depth Displaced Portrait Plane
function DepthPortraitPlane({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      '/portrait.jpg',
      (tex) => {
        tex.minFilter = THREE.LinearFilter
        setTexture(tex)
      },
      undefined,
      () => {
        // Fallback gracefully if portrait.jpg not yet provided
        setTexture(null)
      }
    )
  }, [])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uHasTexture: { value: false },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uProgress: { value: 0 },
      uDisplacement: { value: 0.35 },
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#22D3EE') },
      uColorB: { value: new THREE.Color('#FF3B30') },
      uOpacity: { value: 1.0 },
    }),
    []
  )

  useEffect(() => {
    if (texture) {
      uniforms.uTexture.value = texture
      uniforms.uHasTexture.value = true
    }
  }, [texture, uniforms])

  useFrame((state) => {
    if (meshRef.current) {
      const targetX = mouse.current[0]
      const targetY = mouse.current[1]
      uniforms.uMouse.value.x += (targetX - uniforms.uMouse.value.x) * 0.06
      uniforms.uMouse.value.y += (targetY - uniforms.uMouse.value.y) * 0.06
      uniforms.uTime.value = state.clock.elapsedTime

      // Subtle tilt
      meshRef.current.rotation.y = uniforms.uMouse.value.x * 0.15
      meshRef.current.rotation.x = -uniforms.uMouse.value.y * 0.15
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -0.05, 0]}>
      <planeGeometry args={[2.5, 3.4, 64, 64]} />
      <shaderMaterial
        vertexShader={depthDisplacementVertexShader}
        fragmentShader={depthDisplacementFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Floating Interactive Ambient Particles
function AmbientParticles({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 350

  const [positions, randomness, scales, alphas] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)
    const scl = new Float32Array(count)
    const alp = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3

      rnd[i * 3 + 0] = (Math.random() - 0.5) * 2
      rnd[i * 3 + 1] = (Math.random() - 0.5) * 2
      rnd[i * 3 + 2] = (Math.random() - 0.5) * 2

      scl[i] = Math.random() * 1.5 + 0.5
      alp[i] = Math.random() * 0.7 + 0.3
    }
    return [pos, rnd, scl, alp]
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
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uMouse.value.x += (mouse.current[0] * 2.5 - uniforms.uMouse.value.x) * 0.05
    uniforms.uMouse.value.y += (mouse.current[1] * 2.5 - uniforms.uMouse.value.y) * 0.05
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

export default function Hero3DScene() {
  const mouse = useRef<[number, number]>([0, 0])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    mouse.current = [x, y]
  }

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={2.0} color="#22D3EE" />
        <pointLight position={[3, -2, 2]} intensity={2.0} color="#FF3B30" />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <DepthPortraitPlane mouse={mouse} />
        </Float>

        <NeuralNetworkMesh />
        <AIChipMesh />
        <VectorDBCylinder />
        <CodeBracketsMesh />
        <AmbientParticles mouse={mouse} />
      </Canvas>
    </div>
  )
}
