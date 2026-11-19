import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Portal {
  id: string
  name: string
  color: string
  pos: [number, number, number]
  preview: string
}

const PORTALS: Portal[] = [
  { id: 'hr', name: 'HR Admin Portal', color: '#A855F7', pos: [-1.4, 0.4, 0.6], preview: 'Employee directory & attendance telemetry' },
  { id: 'payroll', name: 'Statutory Payroll', color: '#22D3EE', pos: [-0.9, 0.4, 0.6], preview: 'Indian statutory PF, ESI, TDS calculation engine' },
  { id: 'finance', name: 'Finance Approval', color: '#10B981', pos: [-0.4, 0.4, 0.6], preview: 'Dual-gate approval matrix & audit trail' },
  { id: 'crm', name: 'Enterprise CRM', color: '#F59E0B', pos: [0.1, 0.4, 0.6], preview: 'Client pipeline with Redis caching' },
  { id: 'inventory', name: 'Asset & Inventory', color: '#EC4899', pos: [0.6, 0.4, 0.6], preview: 'Hardware lifecycle & procurement' },
  { id: 'projects', name: 'Agile Sprint Manager', color: '#3B82F6', pos: [1.1, 0.4, 0.6], preview: 'Sprint boards & team velocity analytics' },
  { id: 'ai', name: 'Gemini/Groq Policy AI', color: '#FF3B30', pos: [1.6, 0.4, 0.6], preview: 'RAG policy chatbot & AI resume screening' },
]

// 3D Isometric Office Building
function IsometricOfficeBuilding({ hoveredPortal, setHoveredPortal }: {
  hoveredPortal: string | null
  setHoveredPortal: (id: string | null) => void
}) {
  const buildingRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (buildingRef.current) {
      // Gentle floating isometric perspective
      buildingRef.current.rotation.y = -Math.PI / 6 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05
    }
  })

  return (
    <group ref={buildingRef} position={[0, -0.6, 0]} rotation={[0.35, -Math.PI / 6, 0]}>
      {/* Foundation & floors */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.25, 2.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main glass office structure */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[3.8, 1.5, 1.8]} />
        <meshStandardMaterial
          color="#0c4a6e"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Building wireframe outlines */}
      <lineSegments position={[0, 0.9, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.8, 1.5, 1.8)]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </lineSegments>

      {/* 7 Glowing Portal Doors */}
      {PORTALS.map((portal) => {
        const isHovered = hoveredPortal === portal.id
        return (
          <group
            key={portal.id}
            position={portal.pos}
            onPointerOver={() => setHoveredPortal(portal.id)}
            onPointerOut={() => setHoveredPortal(null)}
          >
            {/* Door mesh */}
            <mesh position={[0, 0, 0.35]} scale={isHovered ? 1.15 : 1.0}>
              <boxGeometry args={[0.35, 0.7, 0.05]} />
              <meshStandardMaterial
                color={portal.color}
                emissive={portal.color}
                emissiveIntensity={isHovered ? 2.5 : 0.8}
              />
            </mesh>
            {/* Holographic vertical beacon */}
            {isHovered && (
              <mesh position={[0, 0.8, 0.35]}>
                <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
                <meshBasicMaterial color={portal.color} transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function ERPBuilding3D() {
  const [hoveredPortal, setHoveredPortal] = useState<string | null>('payroll')
  const [payrollStep, setPayrollStep] = useState<number>(0) // 0: Idle, 1: HR Approval, 2: Finance Dual Gate, 3: PDF Generated

  const runPayrollFlow = () => {
    setPayrollStep(1)
    setTimeout(() => {
      setPayrollStep(2)
      setTimeout(() => {
        setPayrollStep(3)
        setTimeout(() => setPayrollStep(0), 4000)
      }, 1500)
    }, 1500)
  }

  const activePortalData = PORTALS.find((p) => p.id === hoveredPortal)

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-purple-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-purple-300 tracking-wider">
            ENTERPRISE ERP/HRMS — 7 PORTALS
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-purple-400 text-purple-300 bg-purple-950/60">
            9 OF 10 PHASES SHIPPED
          </span>
        </div>
        <div className="font-mono text-[9px] text-white/40">
          TEAM LEAD: 10 ENGINEERS
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.2, 4.2], fov: 42 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 3]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-2, 1, 2]} intensity={2.0} color="#A855F7" />
          <pointLight position={[2, -1, 2]} intensity={1.5} color="#22D3EE" />
          <IsometricOfficeBuilding
            hoveredPortal={hoveredPortal}
            setHoveredPortal={setHoveredPortal}
          />
        </Canvas>
      </div>

      {/* Hover Floating Screen Dashboard Preview */}
      {activePortalData && (
        <div className="absolute top-16 right-4 z-10 bg-black/80 border border-purple-400/50 p-3 rounded-sm w-64 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: activePortalData.color }} />
            <span className="font-mono text-xs font-bold text-warm-white">{activePortalData.name}</span>
          </div>
          <p className="font-mono text-[10px] text-white/60 mb-2">{activePortalData.preview}</p>
          <div className="font-mono text-[8px] text-purple-300 bg-purple-950/50 p-1.5 border border-purple-800">
            FastAPI + PostgreSQL + React 18 + JWT/RBAC
          </div>
        </div>
      )}

      {/* 7 Portals Legend (Left) */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">Portal Architecture</span>
        {PORTALS.map((p) => (
          <div
            key={p.id}
            className={`font-mono text-[9px] flex items-center gap-1.5 transition-all ${
              hoveredPortal === p.id ? 'text-purple-300 font-bold translate-x-1' : 'text-white/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      {/* Payroll Flow Live Stepper */}
      <div className="z-10 bg-black/85 backdrop-blur-md border border-white/10 p-3 rounded-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-purple-300 font-bold">
            INDIAN STATUTORY PAYROLL ENGINE FLOW:
          </span>
          <button
            onClick={runPayrollFlow}
            disabled={payrollStep !== 0}
            className="px-3 py-1 font-mono text-[10px] border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-colors disabled:opacity-40"
          >
            {payrollStep === 0 ? '▶ TRIGGER PAYROLL PIPELINE' : 'RUNNING DISBURSEMENT...'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className={`p-2 border font-mono text-[9px] ${payrollStep >= 1 ? 'border-purple-400 bg-purple-950/50 text-purple-200' : 'border-white/10 text-white/30'}`}>
            1. HR Attendance &amp; TDS Approval
          </div>
          <div className={`p-2 border font-mono text-[9px] ${payrollStep >= 2 ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200' : 'border-white/10 text-white/30'}`}>
            2. Finance Dual-Gate Approval
          </div>
          <div className={`p-2 border font-mono text-[9px] ${payrollStep >= 3 ? 'border-green-400 bg-green-950/50 text-green-200' : 'border-white/10 text-white/30'}`}>
            3. WeasyPrint PDF Payslip Generated
          </div>
        </div>
      </div>
    </div>
  )
}
