import React from 'react'
import { main } from './three/webgl_marchingcubes'
import { Paper } from 'react-three-paper'
import './three/main.css'
export default function MetaBalls() {
    return (
        <Paper
            script={main} // 👈 Pass it in here
        />
    )
}
