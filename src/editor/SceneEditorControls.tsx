import React from "react"
import {Camera} from "./3d/Camera";
import {Guides} from "./3d/Guides";
import {Instances} from "./3d/Instances";
import {SceneEditorControlsContext} from "./SceneEditorControlsContext";

export const SceneEditorControls: React.FC<{
    zAxisVertical?: boolean,
}> = ({zAxisVertical = false}) => {
    return (
        <SceneEditorControlsContext.Provider value={{
            zAxisVertical,
        }}>
            <Camera/>
            <Guides/>
            <Instances/>
        </SceneEditorControlsContext.Provider>
    )
}
