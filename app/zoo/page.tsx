'use client'

import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface AnimalInfo {
    id: string
    name: string
    url: string
    emotion: string
    story: string
}

const TARGET_SIZE = 2

function WanderingModel({
    url,
    startX,
    startZ,
    onClick
}: {
    url: string
    startX: number
    startZ: number
    onClick: () => void
}) {
    const ref = useRef<THREE.Group>(null!)
    const { scene } = useGLTF(url)
    const [ready, setReady] = useState(false)

    const direction = useRef(new THREE.Vector3(
        Math.random() - 0.5,
        0,
        Math.random() - 0.5
    ).normalize())

    const position = useRef(new THREE.Vector3(startX, 0, startZ))

    const normalizedScale = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        return TARGET_SIZE / maxDim
    }, [scene])

    useEffect(() => {
        if (ref.current) {
            ref.current.position.copy(position.current)
            setReady(true)
        }
    }, [])

    useFrame((_, delta) => {
        if (!ref.current || !ready) return

        position.current.x += direction.current.x * delta * 2
        position.current.z += direction.current.z * delta * 2

        if (position.current.x > 8 || position.current.x < -8) direction.current.x *= -1
        if (position.current.z > 8 || position.current.z < -8) direction.current.z *= -1

        ref.current.position.copy(position.current)
        ref.current.rotation.y = Math.atan2(direction.current.x, direction.current.z)
    })

    return (
        <primitive
            ref={ref}
            object={scene}
            scale={normalizedScale}
            onClick={onClick}
        />
    )
}

export default function ZooPage() {
    const [models, setModels] = useState<AnimalInfo[]>([])
    const [popup, setPopup] = useState<AnimalInfo | null>(null)
    const [positions, setPositions] = useState<{ x: number, z: number }[]>([])

    useEffect(() => {
        fetch('/api/models')
            .then(res => res.json())
            .then(data => {
                setModels(data)
                setPositions(data.map(() => ({
                    x: (Math.random() - 0.5) * 10,
                    z: (Math.random() - 0.5) * 10
                })))
            })
    }, [])

    return (
        <>
            <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#90EE90" />
                </mesh>

                <Suspense fallback={null}>
                    {models.map((model, i) => (
                        positions[i] && (
                            <WanderingModel
                                key={model.id}
                                url={model.url}
                                startX={positions[i].x}
                                startZ={positions[i].z}
                                onClick={() => setPopup(model)}
                            />
                        )
                    ))}
                </Suspense>

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