import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'

interface ERPBuildingProps {
  step: 'problem' | 'build' | 'result'
}

const PORTALS = [
  { name: 'HR', desc: 'Payroll & Leave', pos: [-0.95, 0.7, 1.12] },
  { name: 'Finance', desc: 'Dual-Approval', pos: [0, 0.7, 1.12] },
  { name: 'Employee', desc: 'Self-Service', pos: [0.95, 0.7, 1.12] },
  { name: 'Manager', desc: 'Team Oversight', pos: [-0.95, -0.3, 1.12] },
  { name: 'Recruitment', desc: 'AI Resume Screen', pos: [0, -0.3, 1.12] },
  { name: 'Admin', desc: 'RBAC Security', pos: [0.95, -0.3, 1.12] },
  { name: 'Policy AI', desc: 'RAG Assistant', pos: [0, -0.9, 1.12] },
] as const

const glassProps = {
  color: '#0d0d0d',
  transmission: 0.9,
  roughness: 0.08,
  metalness: 0.15,
  ior: 1.52,
  thickness: 0.6,
  clearcoat: 1.0,
  clearcoatRoughness: 0.06,
  transparent: true,
  opacity: 0.9,
}

function ERPBuildingMesh({ step }: ERPBuildingProps) {
  const [hoveredPortal, setHoveredPortal] = useState<number | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  const approvalFlowRef = useRef<THREE.Group>(null)

  const isProblem = step === 'problem'
  const isBuild = step === 'build'
  const isResult = step === 'result'

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow isometric rotation
      groupRef.current.rotation.y += delta * (isProblem ? 0.05 : 0.15)
    }

    if (approvalFlowRef.current) {
      // Flow animation: HR (left) -> Finance (center) -> PDF
      const t = (state.clock.elapsedTime * 1.5) % 3
      approvalFlowRef.current.position.x = -0.95 + t * 0.95
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, -4, -4]} intensity={1.5} color="#FF3B30" />

      {/* ── 1. ISOMETRIC GLASS TOWER ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 2.6, 2.2]} />
        <meshPhysicalMaterial
          {...glassProps}
          color={isProblem ? '#111111' : '#141414'}
        />
      </mesh>

      {/* Outer Metallic Floor Beams */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.52, 2.62, 2.22)]} />
        <lineBasicMaterial
          color={isProblem ? '#333333' : '#FF3B30'}
          transparent
          opacity={0.7}
        />
      </lineSegments>

      {/* ── 2. SEVEN GLOWING DOORS (THE PORTALS) ── */}
      {PORTALS.map((portal, idx) => {
        const isHovered = hoveredPortal === idx
        const isLit = !isProblem

        return (
          <group
            key={portal.name}
            position={portal.pos as unknown as [number, number, number]}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredPortal(idx)
            }}
            onPointerOut={() => setHoveredPortal(null)}
          >
            {/* Door Panel */}
            <mesh>
              <boxGeometry args={[0.7, 0.45, 0.04]} />
              <meshStandardMaterial
                color={isHovered ? '#FF3B30' : isLit ? '#1c1c1c' : '#0d0d0d'}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>

            {/* Glowing Edge Outline */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.71, 0.46, 0.04)]} />
              <lineBasicMaterial
                color={isHovered ? '#ffffff' : isLit ? '#FF3B30' : '#444444'}
                transparent
                opacity={isHovered ? 1.0 : isLit ? 0.75 : 0.25}
              />
            </lineSegments>

            {/* Door Portal Name */}
            <Text
              position={[0, 0.05, 0.03]}
              fontSize={0.07}
              color={isHovered ? '#ffffff' : isLit ? '#FF3B30' : '#777777'}
              anchorX="center"
              anchorY="middle"
            >
              {portal.name}
            </Text>

            <Text
              position={[0, -0.09, 0.03]}
              fontSize={0.04}
              color="#F5F3EE"
              fillOpacity={isHovered ? 1 : 0.6}
              anchorX="center"
              anchorY="middle"
            >
              {portal.desc}
            </Text>

            {/* Floating Mini Dashboard on Hover */}
            {isHovered && (
              <group position={[0, 0.42, 0.2]}>
                <mesh>
                  <planeGeometry args={[1.1, 0.35]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 0.35)]} />
                  <lineBasicMaterial color="#FF3B30" />
                </lineSegments>
                <Text position={[0, 0.05, 0.02]} fontSize={0.055} color="#FF3B30">
                  {`${portal.name.toUpperCase()} ACTIVE`}
                </Text>
                <Text position={[0, -0.05, 0.02]} fontSize={0.042} color="#F5F3EE">
                  RBAC JWT SECURED
                </Text>
              </group>
            )}
          </group>
        )
      })}

      {/* ── 3. RESULT: DUAL-APPROVAL PAYROLL FLOW ANIMATION ── */}
      {isResult && (
        <group position={[0, 1.6, 0]}>
          <Text position={[0, 0.25, 0]} fontSize={0.08} color="#FF3B30">
            PAYROLL PIPELINE: HR APPROVAL → FINANCE APPROVAL → WEASYPRINT PDF
          </Text>

          {/* Animated data packet traveling between HR & Finance */}
          <group ref={approvalFlowRef} position={[-0.95, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#FF3B30" />
            </mesh>
          </group>

          {/* Flow Line */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-1.0, 0, 0),
                new THREE.Vector3(1.0, 0, 0),
              ])}
            />
            <lineBasicMaterial color="#FF3B30" transparent opacity={0.6} />
          </line>
        </group>
      )}
    </group>
  )
}

export default function ERPBuilding3D({ step }: ERPBuildingProps) {
  return (
    <div className="w-full h-full min-h-[420px] relative select-none">
      <Canvas
        camera={{ position: [3.4, 3.0, 3.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Environment preset="night" />
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
          <ERPBuildingMesh step={step} />
        </Float>
      </Canvas>
    </div>
  )
}
