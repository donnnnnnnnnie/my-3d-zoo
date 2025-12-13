'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  url: string
}

export default function WanderingModel({ url }: Props) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)
  
  // 랜덤 방향
  const direction = useRef(new THREE.Vector3(
    Math.random() - 0.5,
    0,
    Math.random() - 0.5
  ).normalize())

  useFrame((state, delta) => {
    if (!ref.current) return
    
    // 이동
    ref.current.position.add(direction.current.clone().multiplyScalar(delta * 0.5))
    
    // 경계 체크 (바닥 범위 내에서만)
    if (Math.abs(ref.current.position.x) > 8) direction.current.x *= -1
    if (Math.abs(ref.current.position.z) > 8) direction.current.z *= -1
    
    // 이동 방향 바라보기
    ref.current.lookAt(
      ref.current.position.x + direction.current.x,
      ref.current.position.y,
      ref.current.position.z + direction.current.z
    )
  })

  return <primitive ref={ref} object={scene.clone()} scale={1} />
}
