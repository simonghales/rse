import React from "react"
import {Camera} from "./3d/Camera";
import {Guides} from "./3d/Guides";
import {Instances} from "./3d/Instances";

export const SceneEditorControls: React.FC = () => {
    return (
        <>
            <Camera/>
            <Guides/>
            <Instances/>
        </>
    )
}
