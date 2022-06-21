import {get, set} from "local-storage";
import {StoredData} from "./types";

export const storageKey = '_instancesData'
export const scenesStorageKey = '_scenesData'
export const editorStorageKey = '_editorStorage'

export type EditorStorageData = {
    selectedSceneId: string,
}

export const getEditorStorage = (): EditorStorageData | null => {
    return get(editorStorageKey)
}

export const storeEditorStorage = (selectedSceneId: string) => {
    return set(editorStorageKey, {
        selectedSceneId,
    })
}

export const getScenesStorageKey = () => {
    return `${scenesStorageKey}`
}

export const getStoredScenes = () => {
    return get(getScenesStorageKey()) ?? {}
}

export const getSceneStorageKey = (sceneId: string) => {
    return `${storageKey}--${sceneId}`
}

export const getInitialState = (sceneId: string): StoredData => {
    return get(getSceneStorageKey(sceneId)) ?? {
        instances: {},
    }
}
