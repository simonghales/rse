import React from "react"
import {PlacementPlane} from "./PlacementPlane";

export const Guides: React.FC = () => {
    return (
        <>
            <gridHelper args={[256, 256, 'white', 'lightgrey']}/>
            <PlacementPlane/>
            {/*<SelectionBox/>*/}
        </>
    )
}
