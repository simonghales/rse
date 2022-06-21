import {ScenesData, storeScenes} from "./data";
import {editorStateProxy} from "./editor";

export const DEFAULT_SCENE_ID = '__defaultScene'

export const addScenes = (scenesData: ScenesData) => {
    Object.entries(scenesData).forEach(([id, data]) => {
        editorStateProxy.scenes[id] = {
            name: data.name,
        }
    })
    storeScenes()
}
