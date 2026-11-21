import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralLatticeProps {
  mouse: React.MutableRefObject<[number, number]>
}

export default function NeuralLattice({ mouse }: NeuralLatticeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const outerPolyRef = useRef<THREE.Mesh>(null)
  const outerEdgesRef = useRef<THREE.LineSegments>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const satellitesGroupRef = useRef<THREE.Group>(null)
  const laserLinesRef = useRef<THREE.LineSegments>(null)

  // Smooth lerp mouse coordinates
  const smoothMouse = useRef({ x: 0, y: 0 })

  // 6 Satellite Nodes coordinates (representing Neural / Vector Nodes)
  const satellitePositions = useMemo(() => {
    return [
      [1.8, 0.6, -0.4],
      [-1.9, -0.5, 0.3],
      [0.8, 1.7, 0.6],
      [-0.7, -1.6, -0.5],
      [1.4, -1.2, 0.9],
      [-1.5, 1.3, -0.8],
    ] as [number, number, number][]
  }, [])

  // Generate laser lines from center to each satellite node
  const laserGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    satellitePositions.forEach((pos) => {
      points.push(new THREE.Vector3(0, 0, 0))
      points.push(new THREE.Vector3(...pos))
    })
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [satellitePositions])

  useFrame((state, delta) => {
    // Lerp mouse coordinates smoothly
    smoothMouse.current.x += (mouse.current[0] - smoothMouse.current.x) * 0.045
    smoothMouse.current.y += (mouse.current[1] - smoothMouse.current.y) * 0.045

    if (groupRef.current) {
      // 3D tilt tracking mouse
      groupRef.current.rotation.y = smoothMouse.current.x * 0.55
      groupRef.current.rotation.x = -smoothMouse.current.y * 0.4
    }

    if (outerPolyRef.current && outerEdgesRef.current) {
      // Continuous slow multi-axis rotation of outer crystal cage
      const rotDelta = delta * 0.18
      outerPolyRef.current.rotation.x += rotDelta * 0.8
      outerPolyRef.current.rotation.y += rotDelta
      outerPolyRef.current.rotation.z += rotDelta * 0.5

      outerEdgesRef.current.rotation.copy(outerPolyRef.current.rotation)
    }

    if (innerCoreRef.current) {
      // Inner glowing core pulses and counter-rotates
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.1
      innerCoreRef.current.scale.set(pulse, pulse, pulse)
      innerCoreRef.current.rotation.x -= delta * 0.35
      innerCoreRef.current.rotation.y -= delta * 0.45
    }

    if (satellitesGroupRef.current) {
      // Orbiting satellites group
      satellitesGroupRef.current.rotation.y += delta * 0.22
      satellitesGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
    }
  })

  return (
    <>
      <Environment preset="night" />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={2.0} color="#FF3B30" />

      {/* Ambient neural sparks */}
      <Sparkles count={50} scale={9} size={2.5} speed={0.4} color="#FF3B30" opacity={0.7} />
      <Sparkles count={30} scale={7} size={1.6} speed={0.25} color="#F5F3EE" opacity={0.5} />

      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.45}>
        <group ref={groupRef} position={[0, 0, -0.3]}>
          {/* Central Red Emissive Point Light */}
          <pointLight position={[0, 0, 0]} color="#FF3B30" intensity={9} distance={7} decay={2} />

          {/* 1. INNER GLOWING RUBY OCTAHEDRON (Quantum AI Core) */}
          <mesh ref={innerCoreRef}>
            <octahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color="#FF3B30"
              emissive="#FF3B30"
              emissiveIntensity={3.6}
              roughness={0.15}
              metalness={0.2}
            />
          </mesh>

          {/* 2. INNER WIREFRAME SYNAPSE MESH */}
          <lineSegments>
            <wireframeGeometry args={[new THREE.OctahedronGeometry(0.72, 1)]} />
            <lineBasicMaterial color="#FF3B30" transparent opacity={0.8} />
          </lineSegments>

          {/* 3. OUTER FACETED GEOMETRIC CRYSTAL CAGE (Dark Smoked Glass Polyhedron) */}
          <mesh ref={outerPolyRef}>
            <icosahedronGeometry args={[1.25, 0]} />
            <meshPhysicalMaterial
              color="#0a0a0a"
              transmission={0.85}
              roughness={0.1}
              metalness={0.2}
              ior={1.55}
              thickness={0.5}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              transparent
              opacity={0.75}
            />
          </mesh>

          {/* 4. CHROME & RED BEVELED EDGES OF THE CRYSTAL */}
          <lineSegments ref={outerEdgesRef}>
            <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.26, 0)]} />
            <lineBasicMaterial color="#e0e0e0" transparent opacity={0.9} />
          </lineSegments>

          {/* 5. FLOATING SATELLITE NEURAL NODES & LASER INTERCONNECTS */}
          <group ref={satellitesGroupRef}>
            {/* Dynamic laser connecting lines */}
            <lineSegments ref={laserLinesRef} geometry={laserGeometry}>
              <lineBasicMaterial color="#FF3B30" transparent opacity={0.45} />
            </lineSegments>

            {/* Orbiting Nodes */}
            {satellitePositions.map((pos, idx) => (
              <group key={idx} position={pos}>
                {/* Node crystal */}
                <mesh>
                  <octahedronGeometry args={[0.09, 0]} />
                  <meshStandardMaterial
                    color={idx % 2 === 0 ? '#FF3B30' : '#ffffff'}
                    emissive={idx % 2 === 0 ? '#FF3B30' : '#ffffff'}
                    emissiveIntensity={idx % 2 === 0 ? 2.5 : 1.2}
                    metalness={0.9}
                    roughness={0.1}
                  />
                </mesh>
                {/* Outer mini wireframe */}
                <lineSegments>
                  <wireframeGeometry args={[new THREE.OctahedronGeometry(0.14, 0)]} />
                  <lineBasicMaterial color="#FF3B30" transparent opacity={0.5} />
                </lineSegments>
              </group>
            ))}
          </group>
        </group>
      </Float>
    </>
  )
}
