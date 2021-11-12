import React, { Suspense }
    // , { useRef, Suspense } 
    from 'react'
// import * as THREE from "three";
// import { Canvas, useThree, MeshProps, useLoader, useFrame } from '@react-three/fiber'
// import { OrbitControls, Stars, Stats, useAnimations, } from '@react-three/drei'
// import { Physics, useBox, usePlane } from '@react-three/cannon'
// import {
//     MarchingCubes
// } from 'three-stdlib'
// import { } from '@react-three/postprocessing'
// import { Clock } from 'three'
// import { MeshPhongMaterial, Mesh, TextureLoader, sRGBEncoding } from 'three'
// import './three.css'
// import { BACK, IS_MOBILE } from "./utils";


import { Paper } from "react-three-paper";
import { main } from "./main.js"; // 👈 Your ThreeJS script




// function Box(props) {
//     const [ref, api] = useBox(() => ({ mass: 1 }))

//     return (
//         <mesh onClick={() => {
//             api.velocity.set(0, 2, 1)
//         }} ref={ref} position={[0, 2, 0]}>
//             <boxBufferGeometry attach='geometry' />
//             <meshLambertMaterial attach='material' color='hotpink' />

//         </mesh>
//     )
// }
// function Ball(props) {
//     // const [ref] = usePlane(() => ({
//     //     rotation: [-Math.PI / 2, 0, 0],
//     // }))
//     return (
//         <mesh
//             // ref={ref} 
//             position={[0, 0, 0]} >
//             {/* <planeBufferGeometry attach='geometry' args={[100, 100]} /> */}
//             {/* <meshLambertMaterial attach='material' color='lightblue' /> */}
//             <MeshPhongMaterial specular={0x111111} shininess={1} />
//         </mesh>
//     )
// }


// function Plane(props) {
//     const [ref] = usePlane(() => ({
//         rotation: [-Math.PI / 2, 0, 0],
//     }))
//     return (
//         <mesh ref={ref} position={[0, 0, 0]} >
//             <planeBufferGeometry attach='geometry' args={[100, 100]} />
//             <meshLambertMaterial attach='material' color='lightblue' />
//         </mesh>
//     )
// }

export default function Threetutorial() {

    // const set = useThree((state) => state.set)
    // set({ frameloop: 'demand' })

    return (
        <>
            <Suspense fallback={null}>


                <Paper
                    script={main} // 👈 Pass it in here
                />

                {/* <Canvas
            camera={{ fov: 45, near: 1, far: 10000, position: [-500, 500, 1500] }}
            pixelRatio={Math.min(2, IS_MOBILE ? window.devicePixelRatio : 1)}
        >
            <OrbitControls />
            <Stars />
            <directionalLight position={[0.5, 0.5, 1]} />
            <pointLight position={[0, 0, 100]} />
            <ambientLight color={'0x080808'} />
            <MarchingCubes
                material='matte'
                resolution={100}
            /> */}
                {/* <Ball /> */}
                {/* <spotLight position={[10, 15, 10]} angle={0.3} /> */}
                {/* <Physics> */}
                {/* <Box /> */}
                {/* <Plane /> */}
                {/* </Physics> */}


                {/* <Blob position={[0, 0, -20]} scale={[1, 1, 1]} /> */}
                {/* <ClippedBlob position={[0, 0, -20]} scale={[20, 20, 20]} /> */}
            </Suspense>

            {/* </Canvas> */}
        </>
    )
}
