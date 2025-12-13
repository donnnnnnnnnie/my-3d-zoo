'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import WanderingModel from './WanderingModel'

interface ModelData {
  url: string
  emotion: string
  story: string
}

// 임시 테스트 데이터 (나중에 Vercel Blob에서 가져옴)
const testModels: ModelData[] = []

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* 모델들 */}
      {testModels.map((model, i) => (
        <WanderingModel key={i} url={model.url} />
      ))}

      <OrbitControls />
      <Environment preset="sunset" />
    </Canvas>
  )
}
