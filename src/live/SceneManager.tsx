import {useMemo} from "react"
import {getInitialState} from "../editor/state/storage";

export const getSceneData = (sceneId: string, data?: any) => {
    if (!data) {
        return getInitialState(sceneId)
    }
    const currentState = getInitialState(sceneId)
    const newTimestamp = data?.timestamp ?? 0
    const currentTimestamp = currentState?.timestamp ?? 0
    if (newTimestamp > currentTimestamp) {
        return data
    }
    return currentState
}

export const useSceneData = (sceneId: string, data?: any) => {
    return useMemo(() => {
       return getSceneData(sceneId, data)
    }, [sceneId, data])
}
