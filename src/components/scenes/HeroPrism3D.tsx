import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface HeroPrismProps {
  mouseParallax: { x: number; y: number }
}

function GlassPrism({ mouseParallax }: HeroPrismProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth interpolation toward mouse position
      groupRef.current.rotation.y += delta * 0.25
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseParallax.y * 0.02 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1,
        0.05
      )
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mouseParallax.x * 0.03,
        0.05
      )
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.4
      innerRef.current.rotation.z += delta * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Large Frosted Glass Prism (Double-ended Pyramid / Octahedron) */}
      <mesh ref={meshRef} scale={[2.4, 3.2, 2.4]}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          transmission={0.96}
          roughness={0.07}
          metalness={0.05}
          ior={1.62}
          thickness={1.4}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.92}
          reflectivity={0.9}
        />
      </mesh>

      {/* Thin Polished Platinum Edge Outlines */}
      <lineSegments scale={[2.405, 3.205, 2.405]}>
        <edgesGeometry args={[new THREE.OctahedronGeometry(1, 0)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </lineSegments>

      {/* Inner Floating Gyroscope Core */}
      <mesh ref={innerRef} scale={[0.85, 0.85, 0.85]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#1e2230"
          metalness={0.95}
          roughness={0.12}
          wireframe
        />
      </mesh>

      {/* Subtle Studio Lighting inside and around the prism */}
      <pointLight position={[1, 2, 2]} intensity={2.5} color="#ffffff" distance={8} />
      <pointLight position={[-2, -1, -1]} intensity={1.5} color="#94a3b8" distance={6} />
    </group>
  )
}

export default function HeroPrism3D({ mouseParallax }: HeroPrismProps) {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={2.0} color="#ffffff" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <GlassPrism mouseParallax={mouseParallax} />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
