import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SKILLS } from '@/data'

interface SkillItem {
  name: string
  category: string
  color: string
  pos: [number, number, number]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Generative AI & LLMs': '#22D3EE',
  'ML & Deep Learning': '#FF3B30',
  'Backend & APIs': '#A855F7',
  'Databases': '#F59E0B',
  'Frontend & Automation': '#22C55E',
  'DevOps & Cloud': '#6366F1',
  'Voice & Vision': '#EC4899',
}

function TechSphereMesh({
  activeCategory,
  hoveredSkill,
  setHoveredSkill,
}: {
  activeCategory: string | null
  hoveredSkill: string | null
  setHoveredSkill: (s: string | null) => void
}) {
  const groupRef = useRef<THREE.Group>(null)

  // Calculate Fibonacci sphere points
  const skillNodes = useMemo(() => {
    const list: SkillItem[] = []
    const categories = Object.keys(SKILLS) as (keyof typeof SKILLS)[]

    let allSkills: { name: string; category: string }[] = []
    categories.forEach((cat) => {
      SKILLS[cat].forEach((skill) => {
        allSkills.push({ name: skill, category: cat })
      })
    })

    const n = allSkills.length
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle

    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2 // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y) // radius at y
      const theta = phi * i

      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius
      const r = 2.0 // Sphere radius

      list.push({
        name: allSkills[i].name,
        category: allSkills[i].category,
        color: CATEGORY_COLORS[allSkills[i].category] || '#22D3EE',
        pos: [x * r, y * r, z * r],
      })
    }
    return list
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate sphere continuously unless hovered
      if (!hoveredSkill) {
        groupRef.current.rotation.y += delta * 0.25
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Concentric orbital rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <ringGeometry args={[2.3, 2.32, 64]} />
        <meshBasicMaterial color="#FF3B30" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Skill Nodes */}
      {skillNodes.map((node) => {
        const isCatMatch = !activeCategory || node.category === activeCategory
        const isHovered = hoveredSkill === node.name

        return (
          <group
            key={`${node.category}-${node.name}`}
            position={node.pos}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHoveredSkill(node.name)
            }}
            onPointerOut={() => setHoveredSkill(null)}
          >
            <mesh scale={isHovered ? 1.6 : isCatMatch ? 1.0 : 0.4}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isHovered ? 3.5 : isCatMatch ? 1.5 : 0.2}
                transparent
                opacity={isCatMatch ? 1.0 : 0.25}
              />
            </mesh>

            {/* Pulsing ring for active or hovered node */}
            {isHovered && (
              <mesh>
                <ringGeometry args={[0.12, 0.16, 16]} />
                <meshBasicMaterial color={node.color} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function SkillsSphere3D({
  activeCategory,
  onSelectSkill,
}: {
  activeCategory: string | null
  onSelectSkill?: (s: string) => void
}) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="relative w-full h-[400px] md:h-[480px] bg-black/40 border border-white/10 rounded-sm overflow-hidden select-none">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 4.4], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#22D3EE" />
        <pointLight position={[-3, -3, 3]} intensity={1.5} color="#FF3B30" />
        <TechSphereMesh
          activeCategory={activeCategory}
          hoveredSkill={hoveredSkill}
          setHoveredSkill={(skill) => {
            setHoveredSkill(skill)
            if (skill && onSelectSkill) onSelectSkill(skill)
          }}
        />
      </Canvas>

      {/* Hover Tooltip Overlay */}
      {hoveredSkill && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 border border-electric-cyan px-4 py-2 rounded-sm text-center shadow-lg pointer-events-none z-20">
          <div className="font-display font-bold text-sm text-electric-cyan">{hoveredSkill}</div>
          <div className="font-mono text-[9px] text-white/50">3D SKILL NODE ACTIVE</div>
        </div>
      )}

      {/* Orbit info */}
      <div className="absolute top-3 left-3 font-mono text-[9px] text-white/30 tracking-wider">
        3D KNOWLEDGE TOPOLOGY SPHERE — ROTATES IN SPACE
      </div>
    </div>
  )
}
