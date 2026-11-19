import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function MonochromeParticlePortrait() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 1200

  const [positions, originalPositions, randomOffsets] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const orig = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)

    let idx = 0
    // Generate silhouette distribution: head oval + shoulders + torso
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0

      if (i < count * 0.45) {
        // Head / Face ellipse
        const angle = Math.random() * Math.PI * 2
        const r = Math.sqrt(Math.random()) * 0.75
        x = Math.cos(angle) * r * 0.75
        y = Math.sin(angle) * r * 0.95 + 0.65
        z = (Math.random() - 0.5) * 0.4
      } else {
        // Shoulders & upper torso
        x = (Math.random() - 0.5) * 2.2
        const shoulderProfile = Math.cos(x * 1.3) * 0.35 - 0.15
        y = (Math.random() - 0.5) * 1.1 + shoulderProfile - 0.3
        z = (Math.random() - 0.5) * 0.5
      }

      pos[idx * 3 + 0] = x
      pos[idx * 3 + 1] = y
      pos[idx * 3 + 2] = z

      orig[idx * 3 + 0] = x
      orig[idx * 3 + 1] = y
      orig[idx * 3 + 2] = z

      rnd[idx * 3 + 0] = (Math.random() - 0.5) * 2
      rnd[idx * 3 + 1] = (Math.random() - 0.5) * 2
      rnd[idx * 3 + 2] = (Math.random() - 0.5) * 2

      idx++
    }
    return [pos, orig, rnd]
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime
      const geom = pointsRef.current.geometry
      const posAttr = geom.attributes.position

      for (let i = 0; i < count; i++) {
        const ox = originalPositions[i * 3 + 0]
        const oy = originalPositions[i * 3 + 1]
        const oz = originalPositions[i * 3 + 2]

        // Subtle breathing turbulence
        const wave = Math.sin(time * 1.2 + oy * 3.0) * 0.04
        posAttr.setXYZ(
          i,
          ox + Math.cos(time * 0.8 + ox * 2.0) * 0.02,
          oy + wave,
          oz + Math.sin(time + oz * 4.0) * 0.03
        )
      }
      posAttr.needsUpdate = true
      pointsRef.current.rotation.y = Math.sin(time * 0.3) * 0.15
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#E5E7EB"
        transparent
        opacity={0.8}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}

export default function About3DScene() {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <MonochromeParticlePortrait />
      </Canvas>
    </div>
  )
}
