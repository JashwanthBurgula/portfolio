import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { retinaVertexShader, retinaFragmentShader } from '@/shaders/retinaShader'

// 3D Eyeball with custom procedural retina shader
function EyeballMesh({ severity, heatmap }: { severity: number; heatmap: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uSeverity: { value: severity },
      uScanLine: { value: 0.5 },
      uTime: { value: 0 },
      uHeatmap: { value: heatmap },
    }),
    []
  )

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      uniforms.uTime.value = state.clock.elapsedTime
      uniforms.uSeverity.value = severity
      uniforms.uHeatmap.value = heatmap
      // Oscillating laser scan line
      uniforms.uScanLine.value = (Math.sin(state.clock.elapsedTime * 2.0) + 1.0) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1.3}>
      <sphereGeometry args={[1.0, 64, 64]} />
      <shaderMaterial
        vertexShader={retinaVertexShader}
        fragmentShader={retinaFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// 3D Stacked Convolutional Pipeline (CNN -> ResNet -> EfficientNet)
function PipelineLayersMesh({ activeModel }: { activeModel: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  const models = ['CNN Baseline (78%)', 'ResNet-50 (86%)', 'EfficientNet-B4 (92.4%)']

  return (
    <group ref={groupRef} position={[1.8, 0, 0]} scale={0.75}>
      {[-0.6, 0, 0.6].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.2, 1.2, 1.2]} />
            <meshStandardMaterial
              color={idx === activeModel ? '#22D3EE' : '#334155'}
              emissive={idx === activeModel ? '#22D3EE' : '#000000'}
              emissiveIntensity={idx === activeModel ? 1.5 : 0}
              wireframe
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const SEVERITY_GRADES = [
  { level: 0, title: 'No DR (Normal)', desc: 'Clear retinal fundus, crisp optic disc, intact macula.', color: '#22C55E' },
  { level: 1, title: 'Mild NPDR', desc: 'Microaneurysms present in isolated quadrants.', color: '#84CC16' },
  { level: 2, title: 'Moderate NPDR', desc: 'Hard lipid exudates and blot hemorrhages visible.', color: '#F59E0B' },
  { level: 3, title: 'Severe NPDR', desc: 'Cotton-wool ischemic spots & venous beading in 4 quadrants.', color: '#EF4444' },
  { level: 4, title: 'Proliferative DR (PDR)', desc: 'Neovascularization fronds, vitreous hemorrhage risk.', color: '#DC2626' },
]

export default function RetinaEye3D() {
  const [severity, setSeverity] = useState<number>(2)
  const [heatmap, setHeatmap] = useState<boolean>(true)
  const [activeModel, setActiveModel] = useState<number>(2) // EfficientNet

  const currentGrade = SEVERITY_GRADES[severity]

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-amber-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
            RETINAL COMPUTER VISION GRADER
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-amber-400 text-amber-300 bg-amber-950/60">
            92%+ ACCURACY · 40% TIME SAVED
          </span>
        </div>
        <button
          onClick={() => setHeatmap(!heatmap)}
          className={`font-mono text-[10px] px-2 py-0.5 border transition-colors ${
            heatmap ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60' : 'border-white/10 text-white/30'
          }`}
        >
          {heatmap ? '🔥 GRAD-CAM HEATMAP: ON' : 'HEATMAP: OFF'}
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 3, 3]} intensity={1.2} />
          <EyeballMesh severity={severity} heatmap={heatmap} />
          <PipelineLayersMesh activeModel={activeModel} />
        </Canvas>
      </div>

      {/* Stacked Transfer Learning Pipeline Legend (Right) */}
      <div className="absolute top-16 right-4 z-10 bg-black/70 border border-white/10 p-3 rounded-sm space-y-2 pointer-events-none w-56">
        <div className="font-mono text-[9px] text-white/50 uppercase tracking-wider">
          Stacked ML Architecture
        </div>
        {[
          { idx: 0, name: 'CNN Baseline', acc: '78.2%' },
          { idx: 1, name: 'ResNet-50', acc: '86.4%' },
          { idx: 2, name: 'EfficientNet-B4', acc: '92.6% (Deployed)' },
        ].map((m) => (
          <div
            key={m.idx}
            className={`font-mono text-[9px] p-1.5 border rounded flex justify-between ${
              activeModel === m.idx
                ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 font-bold'
                : 'border-white/10 text-white/30'
            }`}
          >
            <span>{m.name}</span>
            <span>{m.acc}</span>
          </div>
        ))}
      </div>

      {/* Bottom Severity Scrubbing Slider */}
      <div className="z-10 bg-black/85 backdrop-blur-md border border-white/10 p-3 rounded-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: currentGrade.color }} />
            <span className="font-mono text-xs font-bold" style={{ color: currentGrade.color }}>
              GRADE {severity}: {currentGrade.title}
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/40">
            {currentGrade.desc}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-white/30">0 (NORMAL)</span>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="flex-1 accent-amber-400 cursor-pointer"
          />
          <span className="font-mono text-[9px] text-red-500 font-bold">4 (PROLIFERATIVE)</span>
        </div>
      </div>
    </div>
  )
}
