import React, {createContext, useContext, useEffect, useState} from "react"
import {subscribe} from "valtio";
import {getManagerSceneProxy, managerProxy, storeSnapshot} from "./data";
import {storeEditorStorage} from "./storage";

export type ManagerContextValue = {
    currentSceneProxy: any,
}

export const ManagerContext = createContext<ManagerContextValue>(null!)

export const useCurrentSceneProxy = () => {
    return useContext(ManagerContext).currentSceneProxy
}

export const Manager: React.FC<{
    isParent?: boolean,
}> = ({children, isParent = false}) => {

    const [currentSceneProxy, setCurrentSceneProxy] = useState<any>(getManagerSceneProxy())

    useEffect(() => {

        const update = () => {
            setCurrentSceneProxy(managerProxy.scenes[managerProxy.currentScene])
            storeEditorStorage(managerProxy.currentScene)
        }

        update()

        return subscribe(managerProxy, update)

    }, [])

    useEffect(() => {

        if (!isParent) return

        if (!currentSceneProxy) return

        subscribe(currentSceneProxy.value, storeSnapshot)

    }, [currentSceneProxy, isParent])

    return (
        <ManagerContext.Provider value={{
            currentSceneProxy,
        }}>
            {children}
        </ManagerContext.Provider>
    )
}
