'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Snow({ count = 500 }) {
    const ref = useRef<THREE.Points>(null!)

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40      // x
            positions[i * 3 + 1] = Math.random() * 200 - 100   // y (-100 ~ 100)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40  // z
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        return geo
    }, [count])

    useFrame((_, delta) => {
        if (!ref.current) return

        const positions = ref.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] -= delta * 3

            // 아래 끝까지 가면 위로 리셋
            if (positions[i * 3 + 1] < -100) {
                positions[i * 3 + 1] = 100
            }
        }

        ref.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial
                color="#ffffff"
                size={0.3}
                transparent
                opacity={0.8}
                sizeAttenuation={false}
            />
        </points>
    )
}