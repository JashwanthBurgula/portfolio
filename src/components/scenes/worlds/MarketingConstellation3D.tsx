import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'

interface MarketingConstellationProps {
  step: 'problem' | 'build' | 'result'
  isServiceBroken?: boolean
}

const SERVICES = [
  { id: 'gateway', name: 'API Gateway', pos: [0, 1.25, 0] },
  { id: 'rag', name: 'LangChain + RAG', pos: [-1.4, 0.1, 0.3] },
  { id: 'scraper', name: 'Playwright Scraper', pos: [1.4, 0.2, -0.3] },
  { id: 'redis', name: 'Redis Cache', pos: [-0.9, -1.15, -0.2] },
  { id: 'crm', name: 'CRM Pipeline', pos: [0.9, -1.1, 0.2] },
] as const

// Glass Material
const glassProps = {
  color: '#0d0d0d',
  transmission: 0.9,
  roughness: 0.08,
  metalness: 0.12,
  ior: 1.5,
  thickness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.06,
  transparent: true,
  opacity: 0.9,
}

function ConstellationMesh({ step, isServiceBroken = false }: MarketingConstellationProps) {
  const groupRef = useRef<THREE.Group>(null)
  const packetsRef = useRef<THREE.Group>(null)
  const monolithRef = useRef<THREE.Mesh>(null)

  const isProblem = step === 'problem'

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isProblem ? 0.08 : 0.22)
    }

    if (monolithRef.current) {
      monolithRef.current.rotation.x += delta * 0.1
      monolithRef.current.rotation.y += delta * 0.15
    }

    if (packetsRef.current) {
      // Data packets moving between nodes
      const t = state.clock.elapsedTime * 1.5
      packetsRef.current.children.forEach((p, idx) => {
        const offset = idx * 0.4
        const progress = (t + offset) % 1
        p.position.y = -0.8 + progress * 1.6
      })
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, -3, -3]} intensity={1.5} color="#FF3B30" />

      {/* ── STEP 1: SINGLE MONOLITH CUBE (600s LAG) ── */}
      {isProblem && (
        <group>
          <mesh ref={monolithRef}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.52, 1.52, 1.52)]} />
            <lineBasicMaterial color="#FF3B30" transparent opacity={0.6} />
          </lineSegments>

          <Text position={[0, 1.25, 0]} fontSize={0.11} color="#FF3B30">
            MONOLITH // 600s LATENCY
          </Text>
          <Text position={[0, -1.25, 0]} fontSize={0.08} color="#F5F3EE" fillOpacity={0.6}>
            SINGLE POINT OF FAILURE
          </Text>
        </group>
      )}

      {/* ── STEP 2 & 3: FIVE GLASS CUBES + OLLAMA ORB + MOVING DATA PACKETS ── */}
      {!isProblem && (
        <group>
          {/* Connecting Red Laser Lines between microservices */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 1.25, 0), // Gateway to RAG
                new THREE.Vector3(-1.4, 0.1, 0.3),
                new THREE.Vector3(0, 1.25, 0), // Gateway to Scraper
                new THREE.Vector3(1.4, 0.2, -0.3),
                new THREE.Vector3(-1.4, 0.1, 0.3), // RAG to Redis
                new THREE.Vector3(-0.9, -1.15, -0.2),
                new THREE.Vector3(1.4, 0.2, -0.3), // Scraper to CRM
                new THREE.Vector3(0.9, -1.1, 0.2),
              ])}
            />
            <lineBasicMaterial color="#FF3B30" transparent opacity={0.6} />
          </line>

          {/* 5 Glass Microservice Cubes */}
          {SERVICES.map((srv) => {
            const isTargetBroken = isServiceBroken && srv.id === 'scraper'

            return (
              <group key={srv.id} position={srv.pos as unknown as [number, number, number]}>
                {/* Glass Cube */}
                <mesh>
                  <boxGeometry args={[0.55, 0.55, 0.55]} />
                  <meshPhysicalMaterial
                    {...glassProps}
                    color={isTargetBroken ? '#FF3B30' : '#ffffff'}
                  />
                </mesh>

                {/* Inner Glowing Core */}
                <mesh>
                  <boxGeometry args={[0.26, 0.26, 0.26]} />
                  <meshStandardMaterial
                    color="#FF3B30"
                    emissive="#FF3B30"
                    emissiveIntensity={isTargetBroken ? 4.5 : 2.5}
                  />
                </mesh>

                {/* Edge Wireframe Outline */}
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(0.56, 0.56, 0.56)]} />
                  <lineBasicMaterial
                    color={isTargetBroken ? '#FF3B30' : '#F5F3EE'}
                    transparent
                    opacity={0.7}
                  />
                </lineSegments>

                {/* Service Label */}
                <Text
                  position={[0, 0.42, 0]}
                  fontSize={0.08}
                  color={isTargetBroken ? '#FF3B30' : '#F5F3EE'}
                  anchorX="center"
                  anchorY="middle"
                >
                  {isTargetBroken ? `${srv.name} (TRIPPED)` : srv.name}
                </Text>
              </group>
            )
          })}

          {/* Ollama LLM Cluster as a small glowing glass orb beside LangChain */}
          <group position={[-2.1, 0.3, 0.4]}>
            <mesh>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshPhysicalMaterial {...glassProps} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={3} />
            </mesh>
            <Text position={[0, 0.32, 0]} fontSize={0.075} color="#FF3B30">
              Ollama Cluster
            </Text>
          </group>

          {/* Moving Data Packets */}
          <group ref={packetsRef}>
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[(i % 2 === 0 ? -0.7 : 0.7), 0, 0]}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshBasicMaterial color="#FF3B30" />
              </mesh>
            ))}
          </group>

          {/* Circuit breaker status notification */}
          {isServiceBroken && (
            <group position={[0, -1.75, 0]}>
              <Text fontSize={0.09} color="#FF3B30">
                CIRCUIT BREAKER: TRIPPED · TRAFFIC RE-ROUTED TO REDIS/OLLAMA
              </Text>
            </group>
          )}
        </group>
      )}
    </group>
  )
}

export default function MarketingConstellation3D({
  step,
  isServiceBroken = false,
}: MarketingConstellationProps) {
  return (
    <div className="w-full h-full min-h-[420px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.2, 4.4], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Environment preset="night" />
        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.3}>
          <ConstellationMesh step={step} isServiceBroken={isServiceBroken} />
        </Float>
      </Canvas>
    </div>
  )
}
