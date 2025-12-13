'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface AnimalInfo {
  name: string
  emotion: string
  story: string
}

function Capybara({ onClick }: { onClick: () => void }) {
  const ref = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/Capybara.glb')
  const direction = useRef(new THREE.Vector3(0.5, 0, 0.3).normalize())
  const position = useRef(new THREE.Vector3(-2, 0, 0))

  useFrame((_, delta) => {
    position.current.x += direction.current.x * delta * 2
    position.current.z += direction.current.z * delta * 2

    if (position.current.x > 8 || position.current.x < -8) direction.current.x *= -1
    if (position.current.z > 8 || position.current.z < -8) direction.current.z *= -1

    ref.current.position.copy(position.current)
    ref.current.rotation.y = Math.atan2(direction.current.x, direction.current.z)
  })

  return <primitive ref={ref} object={scene} scale={1} onClick={onClick} />
}

function Alpaca({ onClick }: { onClick: () => void }) {
  const ref = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/Alpaca.glb')
  const direction = useRef(new THREE.Vector3(-0.4, 0, 0.6).normalize())
  const position = useRef(new THREE.Vector3(2, 0, 2))

  useFrame((_, delta) => {
    position.current.x += direction.current.x * delta * 2
    position.current.z += direction.current.z * delta * 2

    if (position.current.x > 8 || position.current.x < -8) direction.current.x *= -1
    if (position.current.z > 8 || position.current.z < -8) direction.current.z *= -1

    ref.current.position.copy(position.current)
    ref.current.rotation.y = Math.atan2(direction.current.x, direction.current.z)
  })

  return <primitive ref={ref} object={scene} scale={1} onClick={onClick} />
}

export default function Scene() {
  const [popup, setPopup] = useState<AnimalInfo | null>(null)

  const animals: Record<string, AnimalInfo> = {
    capybara: {
      name: '카피바라',
      emotion: '평온함',
      story: '항상 여유롭게 살고 싶어하는 카피바라입니다.',
    },
    alpaca: {
      name: '알파카',
      emotion: '호기심',
      story: '새로운 것을 보면 다가가고 싶어하는 알파카입니다.',
    },
  }

  return (
    <>
      <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>

        <Capybara onClick={() => setPopup(animals.capybara)} />
        <Alpaca onClick={() => setPopup(animals.alpaca)} />

        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>

      {popup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
        }}>
          <button
            onClick={() => setPopup(null)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
          <h2 style={{ margin: '0 0 8px' }}>{popup.name}</h2>
          <p style={{ margin: '0 0 12px', color: '#666' }}>감정: {popup.emotion}</p>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{popup.story}</p>
        </div>
      )}
    </>
  )
}