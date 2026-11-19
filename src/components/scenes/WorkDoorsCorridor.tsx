import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PROJECTS } from '@/data'

interface WorkDoorsCorridorProps {
  activeProjectIndex: number | null
  onSelectProject: (index: number) => void
}

function CorridorDoorsMesh({
  activeProjectIndex,
  onSelectProject,
}: {
  activeProjectIndex: number | null
  onSelectProject: (index: number) => void
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle breathing camera movement along corridor
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Perspective floor grid rails */}
      <lineSegments position={[0, -1.2, 0]}>
        <gridHelper args={[16, 16, '#22D3EE', '#222222']} />
      </lineSegments>

      {/* 7 Glowing Portal Doors placed sequentially in corridor */}
      {PROJECTS.map((proj, idx) => {
        // Position doors along an arc / corridor in 3D
        const x = (idx - 3) * 1.5
        const z = -Math.abs(idx - 3) * 0.4
        const isSelected = activeProjectIndex === idx

        return (
          <group
            key={proj.id}
            position={[x, 0, z]}
            onClick={(e) => {
              e.stopPropagation()
              onSelectProject(idx)
            }}
          >
            {/* Outer glowing door frame */}
            <mesh scale={isSelected ? 1.15 : 1.0}>
              <boxGeometry args={[1.1, 2.0, 0.08]} />
              <meshStandardMaterial
                color={isSelected ? proj.color : '#111827'}
                emissive={isSelected ? proj.color : '#0f172a'}
                emissiveIntensity={isSelected ? 2.5 : 0.4}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Glowing neon border outline */}
            <lineSegments scale={isSelected ? 1.17 : 1.02}>
              <edgesGeometry args={[new THREE.BoxGeometry(1.1, 2.0, 0.08)]} />
              <lineBasicMaterial color={proj.color} linewidth={2} />
            </lineSegments>

            {/* Interior glowing portal aperture */}
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[0.9, 1.8]} />
              <meshBasicMaterial
                color={proj.color}
                transparent
                opacity={isSelected ? 0.8 : 0.25}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Vertical portal beacon ray */}
            {isSelected && (
              <mesh position={[0, 2.0, 0]}>
                <cylinderGeometry args={[0.02, 0.04, 2.2, 8]} />
                <meshBasicMaterial color={proj.color} transparent opacity={0.7} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function WorkDoorsCorridor({
  activeProjectIndex,
  onSelectProject,
}: WorkDoorsCorridorProps) {
  return (
    <div className="w-full h-48 md:h-64 relative border border-white/10 bg-black/40 rounded-sm overflow-hidden select-none cursor-pointer">
      <div className="absolute top-2 left-3 z-10 font-mono text-[9px] text-white/40 tracking-wider">
        3D PORTAL CORRIDOR — CLICK A DOOR TO ENTER ITS WORLD
      </div>

      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 2, 3]} intensity={1.5} color="#22D3EE" />
        <pointLight position={[0, -2, 3]} intensity={1.5} color="#FF3B30" />
        <CorridorDoorsMesh
          activeProjectIndex={activeProjectIndex}
          onSelectProject={onSelectProject}
        />
      </Canvas>
    </div>
  )
}
