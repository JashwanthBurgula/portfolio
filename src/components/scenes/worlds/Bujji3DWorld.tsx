import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'

interface BujjiWorldProps {
  step: 'problem' | 'build' | 'result'
  audioLevel?: number
}

const AGENTS = [
  { name: 'Wake', role: 'Vosk <3% CPU' },
  { name: 'Speech', role: 'Whisper STT' },
  { name: 'Router', role: '3-Tier LLM' },
  { name: 'Vision', role: 'UI Perception' },
  { name: 'Automation', role: 'PyAutoGUI' },
  { name: 'CodeForge', role: 'Self-Healing' },
  { name: 'Memory', role: 'ChromaDB' },
]

function BujjiVisual({ step, audioLevel = 0 }: BujjiWorldProps) {
  const orbRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const faceRef = useRef<THREE.Mesh>(null)
  const mandalaRef = useRef<THREE.Group>(null)
  const groupRef = useRef<THREE.Group>(null)
  const nodesGroupRef = useRef<THREE.Group>(null)

  // Load the authentic Bujji face holographic texture safely without blocking Suspense
  const bujjiTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load('/bujji-face.jpg')
  }, [])

  // Physical Glass Material Props
  const glassMaterial = useMemo(
    () => ({
      color: '#0d0d0d',
      transmission: 0.9,
      roughness: 0.08,
      metalness: 0.15,
      ior: 1.5,
      thickness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.9,
    }),
    []
  )

  useFrame((state, delta) => {
    const isProblem = step === 'problem'
    const isBuild = step === 'build'
    const isResult = step === 'result'

    // Rotation speeds
    const rotSpeed = isProblem ? 0.05 : isBuild ? 0.25 : 0.6
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotSpeed
    }

    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y -= delta * (isProblem ? 0.03 : 0.4)
    }

    if (mandalaRef.current) {
      mandalaRef.current.rotation.z += delta * (isProblem ? 0.1 : 0.5)
    }

    // Bujji Face Disc Pulse
    if (faceRef.current) {
      const baseScale = isProblem ? 0.85 : isBuild ? 1.0 : 1.05 + audioLevel * 0.45
      faceRef.current.scale.set(baseScale, baseScale, baseScale)
    }

    // Orb Pulse
    if (coreRef.current) {
      if (isProblem) {
        coreRef.current.scale.set(0.8, 0.8, 0.8)
      } else if (isBuild) {
        const p = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08
        coreRef.current.scale.set(p, p, p)
      } else {
        const pulse = 1.0 + audioLevel * 0.5 + Math.sin(state.clock.elapsedTime * 4.5) * 0.1
        coreRef.current.scale.set(pulse, pulse, pulse)
      }
    }
  })

  const isProblem = step === 'problem'
  const isBuild = step === 'build'
  const isResult = step === 'result'

  return (
    <group ref={groupRef}>
      {/* Central Red Point Light */}
      <pointLight
        position={[0, 0, 0]}
        color="#FF3B30"
        intensity={isProblem ? 0.8 : isBuild ? 6 : 9 + audioLevel * 8}
        distance={7}
      />

      {/* ── 1. BUJJI HOLOGRAPHIC 3D FACE & NEURAL CORE ── */}
      <group position={[0, 0, 0]}>
        {/* Forward-facing Bujji Holographic Face Disc */}
        <mesh ref={faceRef} position={[0, 0, 1.18]}>
          <circleGeometry args={[1.15, 64]} />
          <meshBasicMaterial
            map={bujjiTexture}
            transparent
            opacity={isProblem ? 0.6 : isBuild ? 0.95 : 1.0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Front Glowing Crimson Rim Ring */}
        <mesh position={[0, 0, 1.19]}>
          <torusGeometry args={[1.16, 0.022, 16, 64]} />
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF3B30"
            emissiveIntensity={isProblem ? 0.5 : 3.2 + audioLevel * 3.5}
          />
        </mesh>

        {/* Backward-facing Bujji Holographic Face Disc (for 360 rotation visibility) */}
        <mesh position={[0, 0, -1.18]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[1.15, 64]} />
          <meshBasicMaterial
            map={bujjiTexture}
            transparent
            opacity={isProblem ? 0.6 : isBuild ? 0.95 : 1.0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Back Glowing Crimson Rim Ring */}
        <mesh position={[0, 0, -1.19]}>
          <torusGeometry args={[1.16, 0.022, 16, 64]} />
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF3B30"
            emissiveIntensity={isProblem ? 0.5 : 3.2 + audioLevel * 3.5}
          />
        </mesh>

        {/* Rotating Sacred Mandala Rings around Face */}
        <group ref={mandalaRef}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[1.22, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#FF3B30"
              emissive="#FF3B30"
              emissiveIntensity={isProblem ? 0.4 : 2.5 + audioLevel * 3}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[1.28, 0.012, 16, 64]} />
            <meshStandardMaterial
              color="#F5F3EE"
              emissive="#F5F3EE"
              emissiveIntensity={isProblem ? 0.2 : 1.6}
            />
          </mesh>
        </group>

        {/* Inner Glowing Red Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#FF3B30"
            emissive="#FF3B30"
            emissiveIntensity={isProblem ? 0.3 : isBuild ? 2.5 : 4.0 + audioLevel * 3}
            roughness={0.2}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Outer Smoked Glass Sphere Enclosure */}
        <mesh ref={orbRef}>
          <sphereGeometry args={[1.15, 48, 48]} />
          <meshPhysicalMaterial {...glassMaterial} />
        </mesh>

        {/* Chrome Gimbal Rings */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.45, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.06}
            envMapIntensity={2.0}
          />
        </mesh>
      </group>

      {/* 2. THREE-TIER ROUTING FUNNEL (Visible during Step 2: BUILD and Step 3) */}
      {(isBuild || isResult) && (
        <group position={[0, -1.3, 0]}>
          {/* Tier 1: Rules */}
          <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.015, 16, 48]} />
            <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={2} />
          </mesh>
          <Text position={[1.2, 0.4, 0]} fontSize={0.08} color="#FF3B30">
            TIER 1: RULES ENGINE
          </Text>

          {/* Tier 2: Qwen2.5 */}
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.65, 0.015, 16, 48]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
          </mesh>
          <Text position={[1.0, 0.15, 0]} fontSize={0.08} color="#ffffff">
            TIER 2: QWEN 2.5 (LOCAL)
          </Text>

          {/* Tier 3: Gemini Cloud */}
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.4, 0.015, 16, 48]} />
            <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={2.5} />
          </mesh>
          <Text position={[0.75, -0.1, 0]} fontSize={0.08} color="#FF3B30">
            TIER 3: GEMINI (FALLBACK)
          </Text>
        </group>
      )}

      {/* 3. SEVEN ORBITING GLASS AGENT NODES */}
      <group ref={nodesGroupRef}>
        {AGENTS.map((agent, i) => {
          const angle = (i / AGENTS.length) * Math.PI * 2
          const radius = 2.1
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const y = Math.sin(angle * 2) * 0.25

          return (
            <group key={agent.name} position={[x, y, z]}>
              {/* Node Glass Sphere */}
              <mesh>
                <sphereGeometry args={[0.16, 20, 20]} />
                <meshPhysicalMaterial
                  {...glassMaterial}
                  color={isProblem ? '#333333' : '#ffffff'}
                />
              </mesh>

              {/* Glowing Inner Center */}
              <mesh>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshStandardMaterial
                  color="#FF3B30"
                  emissive="#FF3B30"
                  emissiveIntensity={isProblem ? 0.1 : 3.0}
                />
              </mesh>

              {/* Connecting Laser Line to Core */}
              {(isBuild || isResult) && (
                <line>
                  <bufferGeometry
                    attach="geometry"
                    {...new THREE.BufferGeometry().setFromPoints([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(-x * 0.55, -y * 0.55, -z * 0.55),
                    ])}
                  />
                  <lineBasicMaterial color="#FF3B30" transparent opacity={0.4} />
                </line>
              )}

              {/* Node Label */}
              <Text
                position={[0, 0.26, 0]}
                fontSize={0.08}
                color={isProblem ? '#777777' : '#F5F3EE'}
                anchorX="center"
                anchorY="middle"
              >
                {agent.name}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}

export default function Bujji3DWorld({ step, audioLevel = 0 }: BujjiWorldProps) {
  return (
    <div className="w-full h-full min-h-[420px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.2, 4.4], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={1.5} color="#FF3B30" />

        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.3}>
          <BujjiVisual step={step} audioLevel={audioLevel} />
        </Float>
      </Canvas>
    </div>
  )
}
