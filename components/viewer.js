import React from 'react'
import * as THREE from 'three'
import { Suspense, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'

export const Stage = React.forwardRef(function Center({ children, object, ...props }, ref) {
  const camera = useThree((state) => state.camera)
  const outer = React.useRef()
  const inner = React.useRef()
  const [radius, setRadius] = useState([0, 0, 0])

  React.useLayoutEffect(() => {
    object.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = obj.receiveShadow = true
        obj.material.envMapIntensity = 0.2
      }
    })

    outer.current.position.set(0, 0, 0)
    outer.current.updateWorldMatrix(true, true)
    const box3 = new THREE.Box3().setFromObject(inner.current)
    const center = new THREE.Vector3()
    const sphere = new THREE.Sphere()
    box3.getCenter(center)
    box3.getBoundingSphere(sphere)
    setRadius(sphere.radius)
    outer.current.position.set(-center.x, -center.y * 2, -center.z)
  }, [])

  React.useLayoutEffect(() => {
    camera.position.set(0, radius * 1.5, radius * 2)
    camera.lookAt(0, 0, 0)
  }, [radius])

  return (
    <group ref={ref} {...props}>
      <group ref={outer}>
        <group ref={inner}>
          <primitive object={object} />
        </group>
      </group>
      <ContactShadows
        rotation-x={Math.PI / 2}
        position={[0, 0, 0]}
        opacity={1}
        width={radius * 2}
        height={radius * 2}
        blur={2}
        far={radius / 2}
      />
      <spotLight position={[radius, radius * 2, radius]} intensity={2} castShadow />
      <pointLight position={[-radius * 2, -radius * 2, -radius * 2]} intensity={0.5} />
    </group>
  )
})

const Viewer = ({ scene }) => {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 150], fov: 50 }}>
      <Suspense fallback={null}>
        <Stage object={scene} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls autoRotate />
    </Canvas>
  )
}

export default Viewer
