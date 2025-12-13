'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  url: string
  startPosition?: number[]
}

export default function WanderingModel({ url, startPosition = [0, 0, 0] }: Props) {
  const ref = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(url)

  const clonedScene = useMemo(() => scene.clone(true), [scene])

  const direction = useRef(new THREE.Vector3(
    Math.random() - 0.5,
    0,
    Math.random() - 0.5
  ).normalize())

  const position = useRef(new THREE.Vector3(
    startPosition[0],
    startPosition[1],
    startPosition[2]
  ))

  // 시작 위치 설정
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(startPosition[0], startPosition[1], startPosition[2])
    }
  }, [startPosition])

  useFrame((_, delta) => {
    if (!ref.current) return

    position.current.x += direction.current.x * delta * 2
    position.current.z += direction.current.z * delta * 2

    if (position.current.x > 8 || position.current.x < -8) direction.current.x *= -1
    if (position.current.z > 8 || position.current.z < -8) direction.current.z *= -1

    ref.current.position.set(position.current.x, position.current.y, position.current.z)
    ref.current.rotation.y = Math.atan2(direction.current.x, direction.current.z)
  })

  return (
    <primitive
      ref={ref}
      object={clonedScene}
      scale={1}
    />
  )
}