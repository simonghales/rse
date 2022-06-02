import {createContext, useContext} from "react";

export const SceneEditorControlsContext = createContext(null! as {
    zAxisVertical: boolean,
})

export const useSceneEditorControlsContext = () => {
    return useContext(SceneEditorControlsContext)
}
