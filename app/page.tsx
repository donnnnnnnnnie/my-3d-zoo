'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import DynamicModel from '@/components/DynamicModel'
import LowPolySky from '@/components/LowPolySky'

interface AnimalInfo {
  id: string
  name: string
  url: string
  emotion: string
  story: string
}

function CameraController({ totalRows, spacing }: { totalRows: number, spacing: number }) {
  const { camera } = useThree()
  const targetY = useRef(0)
  const minY = -((totalRows - 1) * spacing) + 2  // 제일 아래
  const maxY = 2  // 제일 위

  useEffect(() => {
    // 시작은 제일 아래
    targetY.current = minY + 3
    camera.position.y = minY + 3
  }, [minY])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetY.current += e.deltaY * 0.01
      targetY.current = Math.max(minY, Math.min(maxY, targetY.current))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [minY, maxY])

  useFrame(() => {
    camera.position.y += (targetY.current - camera.position.y) * 0.1
  })

  return null
}

export default function Home() {
  const [models, setModels] = useState<AnimalInfo[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [popup, setPopup] = useState<AnimalInfo | null>(null)

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
  }, [])

  const cols = 3
  const spacing = 4
  const totalRows = Math.ceil(models.length / cols)

  return (
    <>
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <LowPolySky />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <CameraController totalRows={totalRows} spacing={spacing} />

        <Suspense fallback={null}>
          {models.map((model, i) => {
            const col = i % cols
            const row = Math.floor(i / cols)
            const x = (col - (Math.min(models.length, cols) - 1) / 2) * spacing
            const y = -row * spacing + 2

            return (
              <group key={model.id} position={[x, y, 0]}>
                <DynamicModel
                  url={model.url}
                  isSelected={selected === model.id}
                  isOtherSelected={selected !== null && selected !== model.id}
                  onHover={() => { }}
                  onClick={() => {
                    if (selected === model.id) {
                      setSelected(null)
                      setPopup(null)
                    } else {
                      setSelected(model.id)
                      setPopup(model)
                    }
                  }}
                />
              </group>
            )
          })}
        </Suspense>

        <Environment preset="sunset" />
      </Canvas>

      {popup && (
        <div style={{
          position: 'fixed',
          top: '80%',
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
            onClick={() => { setPopup(null); setSelected(null) }}
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