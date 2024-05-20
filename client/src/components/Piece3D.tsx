import { Environment, Float, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect } from "react"
import { ImSpinner } from "react-icons/im";
import * as THREE from 'three'

const Pieces3D = () => {
    const rook = useGLTF('/rook/scene.gltf');
    const knight = useGLTF('/knight/scene.gltf');
    const board = useGLTF('/board/board.gltf');
    useEffect(() => {
        const color = new THREE.Color("#6380e4")
        rook.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.isMesh) obj.material.color = color
        })
        knight.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.isMesh) obj.material.color = color
        })
    }, [rook, knight])

    return (
        <div className="w-full h-64 mt-6 flex relative z-50 max-w-3xl">
            <Suspense fallback={
                <div className="w-full flex justify-center">
                    <ImSpinner className="text-secondary animate-spin" size={30} />
                </div>
            }>
                <Canvas
                    camera={{ fov: 45, position: [0, 0, 10], near: 0.1, far: 30 }}
                    gl={{
                        preserveDrawingBuffer: true
                    }}
                >
                    <Environment preset="city" />
                    <pointLight intensity={50} position={[2, 5, 5]} />
                    <ambientLight intensity={0.5} />
                    <Float rotationIntensity={0.2}>
                        <Suspense fallback={<ImSpinner className="bg-secondary animate-spin" size={30} />}>
                            <primitive object={board.scene} position={[0, -0.125, -4]} rotation-x={Math.PI * 0.5} rotation-z={0.1} />
                        </Suspense>
                    </Float>
                    <Float rotationIntensity={-2.3}>
                        <Suspense fallback={<ImSpinner className="bg-secondary animate-spin" size={30} />}>
                            <primitive object={rook.scene} position={[-1.90, -2, 0]} scale={0.8} rotation-z={0.2} />
                        </Suspense>
                        <Suspense fallback={<ImSpinner className="bg-secondary animate-spin" size={30} />}>
                            <primitive object={knight.scene} position={[1.90, -2, 0]} scale={0.8} rotation-z={-0.15} />
                        </Suspense>
                    </Float>
                </Canvas>
            </Suspense>
        </div>
    )
}

export default Pieces3D
