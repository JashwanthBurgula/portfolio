import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import { sound } from '@/utils/sound'

interface CorridorProps {
  activeDoor: number | null
  visitedDoors: number[]
  onSelectDoor: (index: number) => void
}

const DOORS = [
  { id: 'bujji', num: '01', title: 'BUJJI AI', sub: 'Voice-First 7-Agent Swarm · Vosk + Whisper' },
  { id: 'marketing', num: '02', title: 'AI MARKETING PLATFORM', sub: '10-Engineer Lead · ~85% Latency Cut' },
  { id: 'erp', num: '03', title: 'AI ERP / HRMS', sub: '7 Enterprise Portals · Dual-Approval Payroll' },
]

function CorridorScene({
  activeDoor,
  visitedDoors,
  onSelectDoor,
}: CorridorProps) {
  const [hoveredDoor, setHoveredDoor] = useState<number | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {/* Perspective Floor Grid */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial color="#08090C" roughness={0.92} />
      </mesh>
      <gridHelper position={[0, -1.79, 0]} args={[18, 22, '#334155', 'rgba(255,255,255,0.05)']} />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 6, 4]} intensity={2.4} color="#ffffff" />
      <pointLight position={[0, 2, -2]} color="#ffffff" intensity={3.5} distance={10} />

      {/* 3 Arched Glass-and-Metal Portal Doors */}
      {DOORS.map((door, idx) => {
        const xPos = (idx - 1) * 2.8 // -2.8, 0, 2.8
        const zPos = -Math.abs(idx - 1) * 0.4
        const isHovered = hoveredDoor === idx
        const isSelected = activeDoor === idx
        const isVisited = visitedDoors.includes(idx)

        return (
          <DoorMesh
            key={door.id}
            index={idx}
            door={door}
            x={xPos}
            z={zPos}
            isHovered={isHovered}
            isSelected={isSelected}
            isVisited={isVisited}
            onHover={(h) => {
              setHoveredDoor(h ? idx : null)
              if (h) sound.playHover()
            }}
            onClick={() => {
              sound.playPortalWarp()
              onSelectDoor(idx)
            }}
          />
        )
      })}
    </group>
  )
}

function DoorMesh({
  index,
  door,
  x,
  z,
  isHovered,
  isSelected,
  isVisited,
  onHover,
  onClick,
}: {
  index: number
  door: typeof DOORS[0]
  x: number
  z: number
  isHovered: boolean
  isSelected: boolean
  isVisited: boolean
  onHover: (h: boolean) => void
  onClick: () => void
}) {
  const pivotRef = useRef<THREE.Group>(null)

  // Roman Arched Door & Portal Frame Geometries
  const { doorGeometry, frameGeometry } = useMemo(() => {
    // 1. Arched Door Leaf (width = 1.3, straight height = 1.8, arch radius = 0.65)
    const dShape = new THREE.Shape()
    const dw = 1.3
    const dh = 1.8
    const dr = dw / 2
    dShape.moveTo(-dr, -dh / 2)
    dShape.lineTo(dr, -dh / 2)
    dShape.lineTo(dr, dh / 2)
    dShape.absarc(0, dh / 2, dr, 0, Math.PI, false)
    dShape.lineTo(-dr, -dh / 2)
    dShape.closePath()

    // 2. Outer Arch Portal Frame with hollow doorway cutout
    const fShape = new THREE.Shape()
    const fw = 1.56
    const fh = 1.8
    const fr = fw / 2
    fShape.moveTo(-fr, -fh / 2)
    fShape.lineTo(fr, -fh / 2)
    fShape.lineTo(fr, fh / 2)
    fShape.absarc(0, fh / 2, fr, 0, Math.PI, false)
    fShape.lineTo(-fr, -fh / 2)
    fShape.closePath()

    // Cutout hole for doorway
    const hole = new THREE.Path()
    hole.moveTo(-dr, -dh / 2)
    hole.lineTo(dr, -dh / 2)
    hole.lineTo(dr, dh / 2)
    hole.absarc(0, dh / 2, dr, 0, Math.PI, false)
    hole.lineTo(-dr, -dh / 2)
    hole.closePath()
    fShape.holes.push(hole)

    const dGeom = new THREE.ExtrudeGeometry(dShape, { depth: 0.06, bevelEnabled: false })
    dGeom.translate(0, 0, -0.03)

    const fGeom = new THREE.ExtrudeGeometry(fShape, { depth: 0.16, bevelEnabled: false })
    fGeom.translate(0, 0, -0.08)

    return { doorGeometry: dGeom, frameGeometry: fGeom }
  }, [])

  useFrame((_, delta) => {
    if (pivotRef.current) {
      const targetRotation = isSelected ? -1.3 : isHovered ? -0.2 : 0
      pivotRef.current.rotation.y += (targetRotation - pivotRef.current.rotation.y) * delta * 8
    }
  })

  return (
    <group
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={() => onHover(false)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* 1. OUTER METALLIC ARCHED PORTAL CASING */}
      <mesh geometry={frameGeometry}>
        <meshStandardMaterial
          color="#0d0e14"
          metalness={0.92}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Frame Outline Specular Highlight */}
      <lineSegments>
        <edgesGeometry args={[frameGeometry]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={isHovered || isSelected ? 0.75 : 0.25}
        />
      </lineSegments>

      {/* 2. SWINGING ARCHED DOOR PIVOT (Hinged at left edge x = -0.65) */}
      <group position={[-0.65, 0, 0]} ref={pivotRef}>
        <group position={[0.65, 0, 0]}>
          {/* Arched Glass Door Leaf */}
          <mesh geometry={doorGeometry}>
            <meshPhysicalMaterial
              color="#0d0f17"
              transmission={0.88}
              roughness={0.08}
              metalness={0.2}
              ior={1.52}
              thickness={0.6}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* Door Rim Outline */}
          <lineSegments>
            <edgesGeometry args={[doorGeometry]} />
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={isHovered || isSelected ? 0.8 : 0.2}
            />
          </lineSegments>

          {/* Fluted Glass Vertical Striations (7 Optical Specular Ridges) */}
          {[-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((fx) => (
            <mesh key={fx} position={[fx, 0, 0.035]}>
              <cylinderGeometry args={[0.005, 0.005, 2.3, 8]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isHovered ? 0.3 : 0.08}
              />
            </mesh>
          ))}

          {/* Frosted Backlight Interior Glow */}
          <pointLight
            position={[0, 0.2, -0.3]}
            color={index === 0 ? '#38bdf8' : index === 1 ? '#f59e0b' : '#a78bfa'}
            intensity={isSelected ? 8.0 : isHovered ? 5.5 : 1.8}
            distance={4.5}
          />

          {/* Polished Titanium Handle */}
          <mesh position={[0.48, 0, 0.06]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.08}
            />
          </mesh>
          <mesh position={[0.48, 0, -0.06]}>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.08}
            />
          </mesh>

          {/* Illuminated Brushed Metallic Door Plaque */}
          <mesh position={[0, 0.35, 0.038]}>
            <planeGeometry args={[1.05, 0.35]} />
            <meshStandardMaterial
              color="#161822"
              metalness={0.85}
              roughness={0.15}
            />
          </mesh>
          <lineSegments position={[0, 0.35, 0.039]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.05, 0.35)]} />
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={isHovered || isSelected ? 0.9 : 0.35}
            />
          </lineSegments>

          {/* Door Number & Title */}
          <Text
            position={[0, 0.42, 0.045]}
            fontSize={0.085}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {`${door.num} · ${door.title}`}
          </Text>

          {/* Visited Check Indicator */}
          {isVisited && (
            <Text
              position={[0.4, 0.42, 0.046]}
              fontSize={0.08}
              color="#34d399"
              anchorX="center"
              anchorY="middle"
            >
              ✓
            </Text>
          )}

          {/* Subtitle / Key info */}
          <Text
            position={[0, 0.3, 0.045]}
            fontSize={0.045}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.8}
          >
            {door.sub}
          </Text>

          {/* Light Spill when selected */}
          {isSelected && (
            <pointLight position={[0, 0, 0.8]} color="#ffffff" intensity={9} distance={5} />
          )}
        </group>
      </group>

      {/* Floating Status / Hover Indicator */}
      {isHovered && (
        <group position={[0, 1.6, 0]}>
          <Text fontSize={0.085} color="#ffffff" anchorX="center" anchorY="middle">
            CLICK TO ENTER WORLD →
          </Text>
        </group>
      )}
    </group>
  )
}

export default function WorkDoorsCorridor({
  activeDoor,
  visitedDoors,
  onSelectDoor,
}: CorridorProps) {
  return (
    <div className="w-full h-[360px] sm:h-[440px] relative select-none cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090A0E] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      {/* Micro HUD overlay */}
      <div className="absolute top-4 left-5 z-20 font-mono text-xs text-white/50 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>3D CORRIDOR // HOVER TO PEEK · CLICK TO ENTER WORLD</span>
      </div>

      <Canvas
        camera={{ position: [0, 0.3, 4.2], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Environment preset="night" />
        <CorridorScene
          activeDoor={activeDoor}
          visitedDoors={visitedDoors}
          onSelectDoor={onSelectDoor}
        />
      </Canvas>
    </div>
  )
}
