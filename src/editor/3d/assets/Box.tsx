import React from "react"
import {defaultInputs, PlacementType, registerAsset} from "../../state/assets";
import {Box} from "@react-three/drei";

export const BoxComponent: React.FC = ({
    _width = 1,
    _depth = 1,
                                       }: any) => {
    return (
        <Box args={[_width, _depth, 1]} position={[0, 0, 0.5]}>
            <meshBasicMaterial color={"red"}/>
        </Box>
    )
    // return (
    //     <Box args={[_width, 1, _depth]} position={[0, 0.5, 0]}>
    //         <meshBasicMaterial color={"red"}/>
    //     </Box>
    // )
}

registerAsset({
    id: '_box',
    name: 'Box',
    component: BoxComponent,
    inputs: {
        ...defaultInputs,
        _width: {
            key: '_width',
            label: 'Width',
            defaultValue: 1,
        },
        _depth: {
            key: '_depth',
            label: 'Depth',
            defaultValue: 1,
        },
    },
    placementType: PlacementType.box,
})
