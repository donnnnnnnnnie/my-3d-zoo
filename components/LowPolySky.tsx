'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function LowPolySky() {
    const geometry = useMemo(() => {
        const geo = new THREE.SphereGeometry(50, 8, 6)  // 로우폴리 구

        // 위에서 아래로 그라데이션 색상
        const colors = []
        const position = geo.attributes.position

        for (let i = 0; i < position.count; i++) {
            const y = position.getY(i)
            const t = (y + 50) / 100  // 0 (아래) ~ 1 (위)

            // 하늘색 그라데이션: 위는 진한 파랑, 아래는 연한 하늘색
            const topColor = new THREE.Color('#4A90D9')    // 진한 하늘
            const bottomColor = new THREE.Color('#B8E0F7') // 연한 하늘

            const color = new THREE.Color()
            color.lerpColors(bottomColor, topColor, t)

            colors.push(color.r, color.g, color.b)
        }

        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        return geo
    }, [])

    return (
        <mesh geometry={geometry} scale={[-1, 1, 1]}>
            <meshBasicMaterial vertexColors side={THREE.BackSide} />
        </mesh>
    )
}