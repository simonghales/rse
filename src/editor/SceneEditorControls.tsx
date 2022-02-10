import React from "react"
import {Camera} from "./Camera";
import {Guides} from "./Guides";

export const SceneEditorControls: React.FC = () => {
    return (
        <>
            <Camera/>
            <Guides/>
        </>
    )
}
