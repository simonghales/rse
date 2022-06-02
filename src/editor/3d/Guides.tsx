import React from "react"
import {PlacementPlane} from "./PlacementPlane";
import {useSceneEditorControlsContext} from "../SceneEditorControlsContext";
import {degToRad} from "three/src/math/MathUtils";

export const Guides: React.FC = () => {

    const {
        zAxisVertical,
    } = useSceneEditorControlsContext()

    return (
        <>
            <gridHelper args={[256, 256, 'white', 'lightgrey']} rotation={[zAxisVertical ? degToRad(90) : 0, 0, 0]}/>
            <PlacementPlane/>
            {/*<SelectionBox/>*/}
        </>
    )
}
