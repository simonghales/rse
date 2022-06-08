import {useMemo} from "react"
import {getInitialState} from "../editor/state/storage";

export const getSceneData = (data?: any) => {
    if (!data) {
        return getInitialState()
    }
    const currentState = getInitialState()
    const newTimestamp = data?.timestamp ?? 0
    const currentTimestamp = currentState?.timestamp ?? 0
    if (newTimestamp > currentTimestamp) {
        return data
    }
    return currentState
}

export const useSceneData = (data?: any) => {
    return useMemo(() => {
       return getSceneData(data)
    }, [data])
}
