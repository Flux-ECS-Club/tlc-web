/**
 * Hero3D Component — 3D Interactive Circuit / Microchip Canvas
 *
 * Uses Three.js & React Three Fiber (@react-three/fiber, @react-three/drei).
 * Features:
 *   - Central 3D Microcontroller / Circuit Chip with metallic pins & glowing core
 *   - Orbiting electron particles & circuit nodes
 *   - Smooth mouse-following rotation
 *   - Metallic + emissive materials matching the dark/neon aesthetic
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Pseudo-random helper function to keep useMemo pure for ESLint purity rules
function pseudoRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// ─── 3D Central Circuit Chip / Core ───────────────────────────────

function CircuitChipCore({ mouse }) {
  const meshRef = useRef(null)
  const innerRef = useRef(null)

  // Floating pins data
  const pins = useMemo(() => {
    const list = []
    const count = 8
    const sideLength = 2.4
    const step = sideLength / (count / 4)

    // Top, Bottom, Right, Left pins
    for (let i = 0; i < count / 4; i++) {
      const offset = -1.2 + step / 2 + i * step
      list.push({ pos: [offset, 1.35, 0], rot: [0, 0, 0] })
      list.push({ pos: [offset, -1.35, 0], rot: [0, 0, 0] })
      list.push({ pos: [1.35, offset, 0], rot: [0, 0, Math.PI / 2] })
      list.push({ pos: [-1.35, offset, 0], rot: [0, 0, Math.PI / 2] })
    }
    return list
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Mouse-following smooth rotation
    const targetX = (mouse.current[1] * Math.PI) / 6
    const targetY = (mouse.current[0] * Math.PI) / 6

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetX + state.clock.elapsedTime * 0.15,
      delta * 2
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetY + state.clock.elapsedTime * 0.2,
      delta * 2
    )

    // Inner core pulse
    if (innerRef.current) {
      innerRef.current.rotation.z += delta * 0.5
      innerRef.current.rotation.x += delta * 0.3
    }
  })

  return (
    <group ref={meshRef}>
      {/* Outer Chip Body */}
      <mesh>
        <boxGeometry args={[2.4, 2.4, 0.4]} />
        <meshStandardMaterial
          color="#111115"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Chip Bevel Rim */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial
          color="#1a1a22"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Center Glowing Circuit Core */}
      <mesh ref={innerRef} position={[0, 0, 0.23]}>
        <octahedronGeometry args={[0.65, 2]} />
        <MeshDistortMaterial
          color="#6ee7b7"
          emissive="#6ee7b7"
          emissiveIntensity={0.6}
          roughness={0.1}
          distort={0.25}
          speed={3}
        />
      </mesh>

      {/* Inner Glowing Ring */}
      <mesh position={[0, 0, 0.22]}>
        <ringGeometry args={[0.7, 0.85, 32]} />
        <meshBasicMaterial color="#93c5fd" side={THREE.DoubleSide} />
      </mesh>

      {/* Gold/Silver Pins around the Chip */}
      {pins.map((pin, i) => (
        <mesh key={i} position={pin.pos} rotation={pin.rot}>
          <boxGeometry args={[0.12, 0.4, 0.08]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Floating Particles / Nodes Ring ──────────────────────────────

function FloatingNodes() {
  const pointsRef = useRef(null)

  const [positions, colors] = useMemo(() => {
    const count = 80
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorA = new THREE.Color('#6ee7b7')
    const colorB = new THREE.Color('#93c5fd')

    for (let i = 0; i < count; i++) {
      const radius = 2.8 + pseudoRandom(i * 1.1) * 2.2
      const theta = pseudoRandom(i * 2.2) * Math.PI * 2
      const phi = (pseudoRandom(i * 3.3) - 0.5) * Math.PI

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi)
      pos[i * 3 + 1] = radius * Math.sin(phi)
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi)

      const mixedColor = pseudoRandom(i * 4.4) > 0.5 ? colorA : colorB
      col[i * 3] = mixedColor.r
      col[i * 3 + 1] = mixedColor.g
      col[i * 3 + 2] = mixedColor.b
    }

    return [pos, col]
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.08
    pointsRef.current.rotation.x += delta * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Main Hero3D Component ───────────────────────────────────────

export default function Hero3D() {
  const mouse = useRef([0, 0])

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    mouse.current = [x, y]
  }

  return (
    <div
      className="w-full h-[360px] sm:h-[440px] md:h-[500px] relative max-w-xl mx-auto cursor-grab active:cursor-grabbing"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} color="#93c5fd" intensity={2} />
        <pointLight position={[5, 5, 5]} color="#6ee7b7" intensity={2} />

        {/* Floating 3D Microchip Core */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <CircuitChipCore mouse={mouse} />
          <FloatingNodes />
        </Float>
      </Canvas>
    </div>
  )
}
