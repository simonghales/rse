import React from "react"
import {Sphere} from "@react-three/drei";
import {defaultInputs, registerAsset} from "../../state/assets";

export const Primitive: React.FC = () => {
    return (
        <Sphere args={[0.5]}>
            <meshBasicMaterial color={'grey'}/>
        </Sphere>
    )
}

registerAsset({
    id: '_primitive',
    name: 'Primitive',
    component: Primitive,
    inputs: {
        ...defaultInputs,
    }
})
