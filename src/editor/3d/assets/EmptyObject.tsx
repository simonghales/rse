import React from "react"
import {Sphere} from "@react-three/drei";
import {registerAsset} from "../../state/assets";

export const EmptyObject: React.FC = () => {
    return (
        <Sphere args={[0.5]}>
            <meshBasicMaterial color={'red'} transparent opacity={0.5}/>
        </Sphere>
    )
}

registerAsset({
    id: '_emptyObject',
    name: 'Empty Object',
    component: EmptyObject,
})
