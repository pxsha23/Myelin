// import { useRef, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// import * as THREE from 'three'

// function SphereNetwork({ color = '#76abf1' }) {
//   const groupRef = useRef()
//   const pointsRef = useRef()

//   const { positions, linePositions } = useMemo(() => {
//     const pts = []
//     const count = 80
//     const radius = 2.2

//     // fibonacci sphere — evenly distributed points
//     for (let i = 0; i < count; i++) {
//       const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
//       const theta = Math.PI * (1 + Math.sqrt(5)) * i
//       pts.push(new THREE.Vector3(
//         radius * Math.sin(phi) * Math.cos(theta),
//         radius * Math.sin(phi) * Math.sin(theta),
//         radius * Math.cos(phi)
//       ))
//     }

//     // connect nearby points
//     const linePts = []
//     for (let i = 0; i < pts.length; i++) {
//       for (let j = i + 1; j < pts.length; j++) {
//         const dist = pts[i].distanceTo(pts[j])
//         if (dist < 1.4) {
//           linePts.push(pts[i].x, pts[i].y, pts[i].z)
//           linePts.push(pts[j].x, pts[j].y, pts[j].z)
//         }
//       }
//     }

//     const posArr = []
//     pts.forEach(p => posArr.push(p.x, p.y, p.z))

//     return {
//       positions: new Float32Array(posArr),
//       linePositions: new Float32Array(linePts)
//     }
//   }, [])

//   useFrame((state) => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
//       groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.15
//     }
//   })

//   const c = new THREE.Color(color)

//   return (
//     <group ref={groupRef}>
//       {/* edges */}
//       <lineSegments>
//         <bufferGeometry>
//           <bufferAttribute
//             attach="attributes-position"
//             array={linePositions}
//             count={linePositions.length / 3}
//             itemSize={3}
//           />
//         </bufferGeometry>
//         <lineBasicMaterial color={c} transparent opacity={0.30} />
//       </lineSegments>

//       {/* nodes */}
//       <points>
//         <bufferGeometry>
//           <bufferAttribute
//             attach="attributes-position"
//             array={positions}
//             count={positions.length / 2}
//             itemSize={3}
//           />
//         </bufferGeometry>
//         <pointsMaterial
//           color={c}
//           size={0.045}
//           transparent
//           opacity={0.9}
//           sizeAttenuation
//         />
//       </points>

//       {/* outer glow sphere */}
//       <mesh>
//         <sphereGeometry args={[2.28, 32, 32]} />
//         <meshBasicMaterial
//           color={c}
//           transparent
//           opacity={0.03}
//           side={THREE.BackSide}
//         />
//       </mesh>
//     </group>
//   )
// }

// export default function NeuralSphere({ color, interactive = true }) {
//   return (
//     <Canvas
//       camera={{ position: [0, 0, 5.5], fov: 45 }}
//       style={{ background: 'transparent' }}
//       gl={{ antialias: true, alpha: true }}
//     >
//       <ambientLight intensity={0.5} />
//       <SphereNetwork color={color} />
//       {interactive && (
//         <OrbitControls
//           enableZoom={true}
//           enablePan={false}
//           minDistance={3}
//           maxDistance={9}
//           autoRotate={false}
//           enableDamping
//           dampingFactor={0.05}
//         />
//       )}
//     </Canvas>
//   )
// }



import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function SphereNetwork({ color = '#00c8ff' }) {
  const groupRef = useRef()

  const { positions, linePositions } = useMemo(() => {
    const pts = []
    const count = 90
    const radius = 2.2

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      pts.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ))
    }

    const linePts = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dist = pts[i].distanceTo(pts[j])
        if (dist < 1.35) {
          linePts.push(pts[i].x, pts[i].y, pts[i].z)
          linePts.push(pts[j].x, pts[j].y, pts[j].z)
        }
      }
    }

    const posArr = []
    pts.forEach(p => posArr.push(p.x, p.y, p.z))

    return {
      positions: new Float32Array(posArr),
      linePositions: new Float32Array(linePts)
    }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.14
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.07) * 0.18
    }
  })

  const c = new THREE.Color(color)

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={c} transparent opacity={0.28} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={c}
          size={0.048}
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export default function NeuralSphere({ color = '#00c8ff', interactive = true }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 44 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <SphereNetwork color={color} />
      {interactive && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={10}
          enableDamping
          dampingFactor={0.06}
        />
      )}
    </Canvas>
  )
}