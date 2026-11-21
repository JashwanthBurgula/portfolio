import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralCoreOrbProps {
  mouse: React.MutableRefObject<[number, number]>
}

export default function NeuralCoreOrb({ mouse }: NeuralCoreOrbProps) {
  const outerOrbRef = useRef<THREE.Mesh>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const innerCageRef = useRef<THREE.LineSegments>(null)
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const mainGroupRef = useRef<THREE.Group>(null)

  // Smooth lerped mouse rotation
  const smoothMouse = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    // Smooth lerp mouse coordinates
    smoothMouse.current.x += (mouse.current[0] - smoothMouse.current.x) * 0.05
    smoothMouse.current.y += (mouse.current[1] - smoothMouse.current.y) * 0.05

    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y = smoothMouse.current.x * 0.5
      mainGroupRef.current.rotation.x = -smoothMouse.current.y * 0.35
    }

    if (outerOrbRef.current) {
      outerOrbRef.current.rotation.y += delta * 0.15
    }

    if (innerCoreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.4) * 0.08
      innerCoreRef.current.scale.set(pulse, pulse, pulse)
      innerCoreRef.current.rotation.y -= delta * 0.4
      innerCoreRef.current.rotation.z += delta * 0.2
    }

    if (innerCageRef.current) {
      innerCageRef.current.rotation.y += delta * 0.25
      innerCageRef.current.rotation.x -= delta * 0.15
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.3
      ring1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.25
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.2
      ring2Ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.6) * 0.25
    }
  })

  return (
    <>
      {/* Studio lighting environment for crisp specular chrome and glass highlights */}
      <Environment preset="night" />

      {/* Atmospheric lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, -4, -3]} intensity={1.5} color="#FF3B30" />

      {/* Ambient floating tech sparks */}
      <Sparkles count={45} scale={8} size={2.2} speed={0.3} color="#FF3B30" opacity={0.65} />
      <Sparkles count={25} scale={6} size={1.5} speed={0.2} color="#F5F3EE" opacity={0.4} />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={mainGroupRef} position={[0, 0.15, -0.2]}>
          {/* Central Red Emissive Point Light */}
          <pointLight position={[0, 0, 0]} color="#FF3B30" intensity={8} distance={6} decay={2} />

          {/* 1. INNER GLOWING RED CORE */}
          <mesh ref={innerCoreRef}>
            <sphereGeometry args={[0.42, 32, 32]} />
            <meshStandardMaterial
              color="#FF3B30"
              emissive="#FF3B30"
              emissiveIntensity={3.2}
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>

          {/* 2. INNER WIREFRAME NEURAL CAGE */}
          <lineSegments ref={innerCageRef}>
            <wireframeGeometry args={[new THREE.IcosahedronGeometry(0.58, 1)]} />
            <lineBasicMaterial color="#FF3B30" transparent opacity={0.65} />
          </lineSegments>

          {/* 3. SMOKED OPTICAL GLASS CASING */}
          <mesh ref={outerOrbRef}>
            <sphereGeometry args={[0.92, 48, 48]} />
            <meshPhysicalMaterial
              color="#0d0d0d"
              transmission={0.88}
              roughness={0.08}
              metalness={0.15}
              ior={1.48}
              thickness={0.65}
              clearcoat={1.0}
              clearcoatRoughness={0.08}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* 4. CHROME GIMBAL RING 1 */}
          <group ref={ring1Ref}>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[1.45, 0.024, 24, 96]} />
              <meshStandardMaterial
                color="#f0f0f0"
                metalness={0.98}
                roughness={0.05}
                envMapIntensity={2.8}
              />
            </mesh>
            {/* Glowing ruby node orbiting on Ring 1 */}
            <mesh position={[1.45, 0, 0]}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshStandardMaterial
                color="#FF3B30"
                emissive="#FF3B30"
                emissiveIntensity={3.5}
                roughness={0.1}
              />
            </mesh>
          </group>

          {/* 5. CHROME GIMBAL RING 2 (perpendicular tilt) */}
          <group ref={ring2Ref}>
            <mesh rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
              <torusGeometry args={[1.68, 0.02, 24, 96]} />
              <meshStandardMaterial
                color="#e5e5e5"
                metalness={0.96}
                roughness={0.07}
                envMapIntensity={2.5}
              />
            </mesh>
            {/* Small chrome node on Ring 2 */}
            <mesh position={[-1.68, 0, 0]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
            </mesh>
          </group>
        </group>
      </Float>
    </>
  )
}
