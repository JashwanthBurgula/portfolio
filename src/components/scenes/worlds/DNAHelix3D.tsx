import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function DNAHelixMesh({ unwindProgress }: { unwindProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const basePairsCount = 28

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  const basePairs = useMemo(() => {
    return Array.from({ length: basePairsCount }, (_, i) => {
      const t = (i / basePairsCount) * Math.PI * 4
      const y = (i - basePairsCount / 2) * 0.18
      const radius = 1.0 * (1 - unwindProgress * 0.5)

      // When unwindProgress is high, straighten out into parallel lines
      const x1 = Math.cos(t) * radius * (1 - unwindProgress) + (unwindProgress * -0.6)
      const z1 = Math.sin(t) * radius * (1 - unwindProgress)

      const x2 = -Math.cos(t) * radius * (1 - unwindProgress) + (unwindProgress * 0.6)
      const z2 = -Math.sin(t) * radius * (1 - unwindProgress)

      const bases = ['A', 'T', 'C', 'G']
      const b1 = bases[i % 4]
      const b2 = b1 === 'A' ? 'T' : b1 === 'T' ? 'A' : b1 === 'C' ? 'G' : 'C'

      // Check if candidate biomarker locus (e.g. BRCA1, TP53, EGFR mutations)
      const isBiomarker = i === 8 || i === 16 || i === 22

      return { y, p1: [x1, y, z1] as [number, number, number], p2: [x2, y, z2] as [number, number, number], b1, b2, isBiomarker }
    })
  }, [unwindProgress])

  return (
    <group ref={groupRef}>
      {basePairs.map((bp, idx) => (
        <group key={idx}>
          {/* Strand 1 nucleotide sphere */}
          <mesh position={bp.p1}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={bp.isBiomarker ? '#FF3B30' : '#EC4899'}
              emissive={bp.isBiomarker ? '#FF3B30' : '#EC4899'}
              emissiveIntensity={bp.isBiomarker ? 3.0 : 1.2}
            />
          </mesh>

          {/* Strand 2 nucleotide sphere */}
          <mesh position={bp.p2}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={bp.isBiomarker ? '#FF3B30' : '#22D3EE'}
              emissive={bp.isBiomarker ? '#FF3B30' : '#22D3EE'}
              emissiveIntensity={bp.isBiomarker ? 3.0 : 1.2}
            />
          </mesh>

          {/* Hydrogen bond rung connecting base pairs */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([...bp.p1, ...bp.p2]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={bp.isBiomarker ? '#FF3B30' : '#ffffff'}
              transparent
              opacity={bp.isBiomarker ? 0.9 : 0.3}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

const BIOMARKERS = [
  { gene: 'TP53', pos: 'Locus 17p13.1', role: 'Tumor Suppressor Mutation', pValue: 'p < 0.0001' },
  { gene: 'BRCA1', pos: 'Locus 17q21.31', role: 'DNA Repair Deficiency Marker', pValue: 'p < 0.0004' },
  { gene: 'EGFR', pos: 'Locus 7p11.2', role: 'Receptor Tyrosine Kinase Oncogene', pValue: 'p < 0.0012' },
]

export default function DNAHelix3D() {
  const [unwind, setUnwind] = useState<number>(0.35)

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-pink-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-pink-300 tracking-wider">
            GENOMIC SEQUENCE ANALYSIS PIPELINE
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-pink-400 text-pink-300 bg-pink-950/60">
            BLAST · BIOPYTHON · NCBI
          </span>
        </div>
        <div className="font-mono text-[9px] text-white/40">
          STATISTICAL HOMOLOGY: SIGNIFICANT
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <pointLight position={[0, 0, 3]} intensity={2.0} color="#EC4899" />
          <pointLight position={[3, 2, 2]} intensity={1.5} color="#22D3EE" />
          <DNAHelixMesh unwindProgress={unwind} />
        </Canvas>
      </div>

      {/* Identified Biomarker Genes (Right) */}
      <div className="absolute top-16 right-4 z-10 bg-black/75 border border-white/10 p-3 rounded-sm w-64 pointer-events-none space-y-2">
        <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
          Candidate Biomarker Hits
        </div>
        {BIOMARKERS.map((b) => (
          <div key={b.gene} className="font-mono text-[9px] border-b border-white/5 pb-1">
            <div className="flex justify-between font-bold text-pink-300">
              <span>{b.gene}</span>
              <span className="text-red-400">{b.pValue}</span>
            </div>
            <div className="text-white/50">{b.pos} — {b.role}</div>
          </div>
        ))}
      </div>

      {/* BLAST Sequence Alignment Ribbon (Left) */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">BLAST Pairwise Homology</span>
        <div className="font-mono text-[9px] text-white/40 space-y-0.5 bg-black/60 p-2 border border-white/10">
          <div>Ref:  ATCGGCTAAGCTTA<span className="text-pink-400 font-bold">CGT</span>AGCC</div>
          <div>Aln:  ||||||||||||||<span className="text-red-400 font-bold">***</span>||||</div>
          <div>Seq:  ATCGGCTAAGCTTA<span className="text-cyan-400 font-bold">TGA</span>AGCC</div>
        </div>
      </div>

      {/* Bottom Unwind Slider */}
      <div className="z-10 bg-black/85 backdrop-blur-md border border-white/10 p-3 rounded-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-pink-300 font-bold">
            UNWIND DOUBLE HELIX INTO HOMOLOGY ALIGNMENT:
          </span>
          <span className="font-mono text-[10px] text-white/40">
            {unwind > 0.7 ? 'LINEAR SEQUENCE VIEW' : unwind > 0.3 ? 'PARTIAL UNWINDING' : 'SUPERCOILED DOUBLE HELIX'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-white/30">HELIX</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={unwind}
            onChange={(e) => setUnwind(Number(e.target.value))}
            className="flex-1 accent-pink-400 cursor-pointer"
          />
          <span className="font-mono text-[9px] text-pink-400 font-bold">ALIGNED SEQUENCE</span>
        </div>
      </div>
    </div>
  )
}
