'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const TARGET_SIZE = 4

interface Props {
    url: string
    isSelected: boolean
    isOtherSelected: boolean
    onHover: (hovering: boolean) => void
    onClick: () => void
}

export default function DynamicModel({
    url,
    isSelected,
    isOtherSelected,
    onHover,
    onClick
}: Props) {
    const ref = useRef<THREE.Group>(null!)
    const { scene } = useGLTF(url)
    const [hovered, setHovered] = useState(false)
    const time = useRef(Math.random() * 100)
    const [ready, setReady] = useState(false)

    const targetRotation = useRef({ x: 0, y: 0, z: 0 })
    const baseY = useRef(0)

    // 랜덤 모션 파라미터 (각 모델마다 다름)
    // 랜덤 모션 파라미터 (각 모델마다 다름)
    const motionParams = useMemo(() => ({
        yawSpeed: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.3 + 0.2),  // 왼쪽 or 오른쪽 확실하게
        pitchAmp: Math.random() * 0.15 + 0.05,
        pitchFreq: Math.random() * 0.8 + 0.8,
        rollAmp: Math.random() * 0.12 + 0.04,
        rollFreq: Math.random() * 0.6 + 0.5,
        phaseOffset: Math.random() * Math.PI * 2,
    }), [])

    const normalizedScale = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        return TARGET_SIZE / maxDim
    }, [scene])

    const baseScale = useRef(normalizedScale)

    useEffect(() => {
        baseScale.current = normalizedScale
        setReady(true)
    }, [normalizedScale])

    useFrame((_, delta) => {
        if (!ref.current || !ready) return
        time.current += delta

        if (hovered || isSelected) {
            // Yaw 회전 (랜덤 방향, 랜덤 속도)
            baseY.current += delta * motionParams.yawSpeed
            targetRotation.current.y = baseY.current

            // Pitch/Roll pulsating (랜덤 amplitude, frequency, phase)
            targetRotation.current.x = Math.sin(time.current * motionParams.pitchFreq + motionParams.phaseOffset) * motionParams.pitchAmp
            targetRotation.current.z = Math.sin(time.current * motionParams.rollFreq) * motionParams.rollAmp
        } else {
            targetRotation.current.x = 0
            targetRotation.current.z = 0
            baseY.current = ref.current.rotation.y
            targetRotation.current.y = baseY.current
        }

        ref.current.rotation.x += (targetRotation.current.x - ref.current.rotation.x) * 0.1
        ref.current.rotation.y += (targetRotation.current.y - ref.current.rotation.y) * 0.1
        ref.current.rotation.z += (targetRotation.current.z - ref.current.rotation.z) * 0.1

        const targetScale = isSelected ? baseScale.current * 1.3 : baseScale.current
        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const mat = child.material as THREE.MeshStandardMaterial
                if (!mat.transparent) mat.transparent = true
                const targetOpacity = isOtherSelected ? 0.3 : 1
                mat.opacity += (targetOpacity - mat.opacity) * 0.1
            }
        })
    })

    return (
        <primitive
            ref={ref}
            object={scene}
            scale={normalizedScale}
            onPointerOver={() => { setHovered(true); onHover(true) }}
            onPointerOut={() => { setHovered(false); onHover(false) }}
            onClick={onClick}
        />
    )
}