import React from "react"
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";

export const Camera: React.FC = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, -5]} />
            <OrbitControls makeDefault />
        </>
    )
}
