'use client'

import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Color, Vector3 } from 'three'

function useGravitySpring(target: Vector3, position: Vector3, velocity: Vector3) {
  const stiffness = 4.5
  const damping = 0.88
  const force = new Vector3().subVectors(target, position).multiplyScalar(stiffness)
  velocity.add(force.multiplyScalar(0.02))
  velocity.multiplyScalar(damping)
  position.add(velocity)
}

function FloatingBody({ geometry, color, initial, pointer }: any) {
  const ref = useRef<any>(null)
  const velocity = useRef(new Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02)).current

  useFrame(() => {
    if (!ref.current) return
    const position = ref.current.position as Vector3
    const attraction = position.clone().sub(pointer).multiplyScalar(0.06)
    const repel = attraction.length() < 1.8 ? attraction.multiplyScalar(-0.8) : new Vector3(0, 0, 0)
    const target = pointer.clone().multiplyScalar(0.2)
    useGravitySpring(target.add(repel), position, velocity)
    ref.current.rotation.x += 0.012
    ref.current.rotation.y += 0.018
  })

  return (
    <group ref={ref} position={initial}>
      {geometry}
    </group>
  )
}

function ParticleField() {
  const particles = useMemo(() => {
    const positions = new Float32Array(250 * 3)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 6
      positions[i + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.18} depthWrite={false} />
    </points>
  )
}

export default function AntiGravityScene() {
  const [pointer, setPointer] = useState(new Vector3(0, 0, 0))

  return (
    <div
      className="auth-scene"
      onPointerMove={(event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1
        const y = -(event.clientY / window.innerHeight) * 2 + 1
        setPointer(new Vector3(x * 2, y * 1.5, 0))
      }}
      onPointerLeave={() => setPointer(new Vector3(0, 0, 0))}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 2]} intensity={1.1} color={new Color('#ffffff')} />
        <directionalLight position={[-6, -1, -2]} intensity={0.6} color={new Color('#7c3aed')} />
        <pointLight position={[0, 4, 4]} intensity={1.8} color={new Color('#64ffda')} />

        <ParticleField />

        <FloatingBody
          geometry={
            <mesh>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial color="#64ffda" roughness={0.2} metalness={0.65} transparent opacity={0.85} />
            </mesh>
          }
          color="#64ffda"
          initial={[-2.1, 1.2, -1]}
          pointer={pointer}
        />

        <FloatingBody
          geometry={
            <mesh>
              <torusKnotGeometry args={[0.65, 0.22, 128, 24]} />
              <meshStandardMaterial color="#ff4d6d" roughness={0.18} metalness={0.9} transparent opacity={0.82} />
            </mesh>
          }
          color="#ff4d6d"
          initial={[1.6, 0.9, -1.4]}
          pointer={pointer}
        />

        <FloatingBody
          geometry={
            <mesh>
              <icosahedronGeometry args={[0.9, 0]} />
              <meshStandardMaterial color="#7c3aed" roughness={0.22} metalness={0.78} transparent opacity={0.88} />
            </mesh>
          }
          color="#7c3aed"
          initial={[0.8, -1.1, -0.5]}
          pointer={pointer}
        />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  )
}
