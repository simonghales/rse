import React from "react"
import {Camera} from "./3d/Camera";
import {Guides} from "./3d/Guides";
import {Instances} from "./3d/Instances";
import {SceneEditorControlsContext} from "./SceneEditorControlsContext";
import {Manager} from "./state/Manager";

export type SceneEditorControlsBaseProps = {
    zAxisVertical?: boolean,
}

export const SceneEditorControls: React.FC<SceneEditorControlsBaseProps & {}> = ({zAxisVertical = false}) => {
    return (
        <Manager isParent={false}>
            <SceneEditorControlsContext.Provider value={{
                zAxisVertical,
            }}>
                <Camera/>
                <Guides/>
                <Instances/>
            </SceneEditorControlsContext.Provider>
        </Manager>
    )
}
