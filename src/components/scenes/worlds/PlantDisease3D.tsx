import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useState } from 'react'

// 3D Procedural Plant that wilts or perks up
function ProceduralPlantMesh({ isHealed }: { isHealed: boolean }) {
  const plantGroupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (plantGroupRef.current) {
      plantGroupRef.current.rotation.y += delta * 0.3
      // When wilted, droop down and shake slightly
      const targetDroop = isHealed ? 0 : 0.35
      plantGroupRef.current.rotation.z += (targetDroop - plantGroupRef.current.rotation.z) * 0.08
    }
  })

  // 6 leaves arranged around central stem
  const leaves = [0, 1, 2, 3, 4, 5]

  return (
    <group ref={plantGroupRef} position={[0, -0.9, 0]}>
      {/* Soil pot */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#2d2013" roughness={0.9} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.9, 8]} />
        <meshStandardMaterial color={isHealed ? '#15803d' : '#854d0e'} />
      </mesh>

      {/* Leaves */}
      {leaves.map((idx) => {
        const angle = (idx / leaves.length) * Math.PI * 2
        const y = 0.5 + (idx * 0.12)
        const droopAngle = isHealed ? 0.3 : 1.1

        return (
          <group
            key={idx}
            position={[0, y, 0]}
            rotation={[droopAngle, angle, 0]}
          >
            <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.22, 0.7, 4]} />
              <meshStandardMaterial
                color={isHealed ? '#22c55e' : '#a16207'}
                emissive={isHealed ? '#15803d' : '#713f12'}
                emissiveIntensity={0.5}
                wireframe={false}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

const CHAT_SEQUENCE = [
  { sender: 'Farmer', text: 'Brown circular spots appearing on lower tomato leaves with yellow halos.' },
  { sender: 'AI Bot', text: 'Vision inference: Detected Early Blight (Alternaria solani) at 90.4% confidence.' },
  { sender: 'Farmer', text: 'What is the immediate remedial treatment?' },
  { sender: 'AI Bot', text: 'Recommended: Copper-based fungicide spray every 7 days. Improve soil drainage and remove diseased foliage.' },
]

export default function PlantDisease3D() {
  const [chatStep, setChatStep] = useState<number>(0)
  const isHealed = chatStep >= 3

  const advanceChat = () => {
    setChatStep((prev) => (prev + 1) % (CHAT_SEQUENCE.length + 1))
  }

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-green-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-green-300 tracking-wider">
            AI AGRO-PATHOLOGY CHATBOT
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-green-400 text-green-300 bg-green-950/60">
            90% ACCURACY · AZURE DEPLOYED
          </span>
        </div>
        <div className="font-mono text-[9px] text-cyan-300">
          DRIFT MONITORING: ACTIVE
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0.4, 3.2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 4, 3]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-2, 1, 2]} intensity={1.2} color={isHealed ? '#22c55e' : '#eab308'} />
          <ProceduralPlantMesh isHealed={isHealed} />
        </Canvas>
      </div>

      {/* Plant status indicator (Right) */}
      <div className="absolute top-16 right-4 z-10 bg-black/75 border border-white/10 p-3 rounded-sm w-56 pointer-events-none">
        <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">
          Phenotype State
        </div>
        <div className={`font-mono text-sm font-bold ${isHealed ? 'text-green-400' : 'text-amber-400'}`}>
          {isHealed ? '🌿 HEALED / VIBRANT' : '🍂 WILTING / INFECTED'}
        </div>
        <div className="font-mono text-[9px] text-white/50 mt-1">
          {isHealed ? 'Treatment regimen effective. Foliage turgor restored.' : 'Alternaria solani necrosis spreading.'}
        </div>
      </div>

      {/* Interactive Chat Stream & Step Button (Bottom) */}
      <div className="z-10 bg-black/85 backdrop-blur-md border border-white/10 p-3 rounded-sm space-y-2">
        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
          <span className="font-mono text-xs text-green-300 font-bold">
            INTERACTIVE CLINICAL CHAT:
          </span>
          <button
            onClick={advanceChat}
            className="font-mono text-[10px] px-3 py-1 border border-green-400 text-green-300 hover:bg-green-400 hover:text-black transition-colors"
          >
            {chatStep < CHAT_SEQUENCE.length ? 'NEXT CHAT MESSAGE ▶' : 'RESTART DIAGNOSIS ↺'}
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-1.5 max-h-24 overflow-y-auto">
          {CHAT_SEQUENCE.slice(0, Math.min(chatStep + 1, CHAT_SEQUENCE.length)).map((msg, i) => (
            <div
              key={i}
              className={`font-mono text-[10px] p-1.5 rounded ${
                msg.sender === 'Farmer'
                  ? 'bg-white/5 text-warm-white/80'
                  : 'bg-green-950/60 text-green-300 border border-green-800/60'
              }`}
            >
              <span className="font-bold mr-1.5">[{msg.sender}]:</span>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
