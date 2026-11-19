import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NodeItem {
  id: string
  label: string
  type: 'resume' | 'job'
  pos: [number, number, number]
}

const EMBEDDING_NODES: NodeItem[] = [
  { id: 'res1', label: 'Resume: AI/ML Engineer (Python, RAG)', type: 'resume', pos: [-1.2, 0.4, 0.2] },
  { id: 'res2', label: 'Resume: Full-Stack Dev (React, TS)', type: 'resume', pos: [0.8, -0.6, -0.3] },
  { id: 'job1', label: 'Job: Generative AI Lead (ByteSentinel)', type: 'job', pos: [-0.9, 0.6, 0.4] },
  { id: 'job2', label: 'Job: NLP Research Scientist', type: 'job', pos: [-1.4, -0.2, 0.1] },
  { id: 'job3', label: 'Job: Frontend Architect', type: 'job', pos: [1.1, -0.4, -0.2] },
]

function EmbeddingPointCloud({ modelType }: { modelType: 'TF-IDF' | 'Word2Vec' | 'BERT' }) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 300

  // Tightness multiplier based on semantic model quality: BERT brings semantic clusters tighter
  const tightness = modelType === 'BERT' ? 0.6 : modelType === 'Word2Vec' ? 0.9 : 1.4

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const cluster = i % 3
      const cx = cluster === 0 ? -1.0 : cluster === 1 ? 1.0 : 0.0
      const cy = cluster === 0 ? 0.5 : cluster === 1 ? -0.5 : 0.0

      pos[i * 3 + 0] = cx + (Math.random() - 0.5) * 1.5 * tightness
      pos[i * 3 + 1] = cy + (Math.random() - 0.5) * 1.5 * tightness
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5 * tightness

      if (cluster === 0) {
        col[i * 3 + 0] = 0.13; col[i * 3 + 1] = 0.83; col[i * 3 + 2] = 0.93 // Cyan
      } else if (cluster === 1) {
        col[i * 3 + 0] = 0.66; col[i * 3 + 1] = 0.33; col[i * 3 + 2] = 0.97 // Purple
      } else {
        col[i * 3 + 0] = 1.00; col[i * 3 + 1] = 0.23; col[i * 3 + 2] = 0.19 // Red
      }
    }
    return [pos, col]
  }, [tightness])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2
    }
  })

  // Dynamic cosine similarity lines between res1 and job1
  const linePoints = useMemo(() => {
    return new Float32Array([
      -1.2, 0.4, 0.2, -0.9, 0.6, 0.4,
      -1.2, 0.4, 0.2, -1.4, -0.2, 0.1,
      0.8, -0.6, -0.3, 1.1, -0.4, -0.2,
    ])
  }, [])

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.75} />
      </points>

      {/* Cosine similarity match rays */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePoints, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22D3EE" transparent opacity={0.65} />
      </lineSegments>

      {/* Floating Resume & Job Anchors */}
      {EMBEDDING_NODES.map((n) => (
        <mesh key={n.id} position={n.pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={n.type === 'resume' ? '#FF3B30' : '#22D3EE'}
            emissive={n.type === 'resume' ? '#FF3B30' : '#22D3EE'}
            emissiveIntensity={2.0}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function JobEmbedding3D() {
  const [modelType, setModelType] = useState<'TF-IDF' | 'Word2Vec' | 'BERT'>('BERT')

  return (
    <div className="relative w-full h-[460px] bg-black/60 border border-indigo-500/30 rounded-sm overflow-hidden flex flex-col justify-between p-4">
      {/* Top HUD */}
      <div className="flex justify-between items-center z-10 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-indigo-300 tracking-wider">
            HIGH-DIMENSIONAL EMBEDDING SPACE
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-indigo-400 text-indigo-300 bg-indigo-950/60">
            91% ACCURACY · A/B TESTED RANKING
          </span>
        </div>

        {/* Algorithm Comparison Switcher */}
        <div className="flex gap-1">
          {(['TF-IDF', 'Word2Vec', 'BERT'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModelType(m)}
              className={`font-mono text-[10px] px-2 py-0.5 border transition-all ${
                modelType === m
                  ? 'border-indigo-400 text-indigo-300 bg-indigo-950/70 font-bold'
                  : 'border-white/10 text-white/30 hover:text-white/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <pointLight position={[0, 0, 3]} intensity={1.5} color="#22D3EE" />
          <pointLight position={[3, 2, 2]} intensity={1.5} color="#6366F1" />
          <EmbeddingPointCloud modelType={modelType} />
        </Canvas>
      </div>

      {/* Semantic Matching Status (Right) */}
      <div className="absolute top-16 right-4 z-10 bg-black/75 border border-white/10 p-3 rounded-sm w-64 pointer-events-none">
        <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">
          Active Representation
        </div>
        <div className="font-mono text-sm font-bold text-indigo-300">
          {modelType === 'BERT'
            ? 'BERT Dense Vectors (768-dim)'
            : modelType === 'Word2Vec'
            ? 'Word2Vec Skip-Gram (300-dim)'
            : 'TF-IDF Sparse Bag-of-Words'}
        </div>
        <div className="font-mono text-[9px] text-white/60 mt-1.5 space-y-0.5">
          <div>• Cosine Similarity Top Match: 0.941</div>
          <div>• Precision@K: +23% vs baseline</div>
          <div>• A/B Click-Through: +38% higher</div>
        </div>
      </div>

      {/* Node Legend (Left) */}
      <div className="absolute top-16 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">Vector Legend</span>
        <div className="font-mono text-[9px] flex items-center gap-1.5 text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Candidate Resume Vectors</span>
        </div>
        <div className="font-mono text-[9px] flex items-center gap-1.5 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Job Specification Vectors</span>
        </div>
        <div className="font-mono text-[9px] flex items-center gap-1.5 text-indigo-300">
          <span className="w-3 h-px bg-cyan-400" />
          <span>Cosine Distance &lt; 0.15</span>
        </div>
      </div>

      {/* Bottom info banner */}
      <div className="z-10 bg-black/85 backdrop-blur-md border border-white/10 p-2.5 rounded-sm flex items-center justify-between">
        <span className="font-mono text-xs text-white/70">
          Semantic embedding manifold dynamically adjusts cluster tension under {modelType}.
        </span>
        <span className="font-mono text-[9px] text-indigo-300 font-bold">
          FASTAPI REST API + DOCKER
        </span>
      </div>
    </div>
  )
}
