import {proxyWithHistory} from 'valtio/utils'
import {set} from "local-storage"
import {uniqueId} from "../../utils/ids";
import {useEffect, useState} from "react";
import {proxy, ref, snapshot, subscribe, useSnapshot} from "valtio";
import {editorStateProxy, getSceneName} from "./editor";
import {assetsProxy} from "./assets";
import {getSceneStorageKey, getStoredScenes, storeScenesInStorage} from "./storage";
import {InstanceData, InstanceDataKeys, StoredData} from "./types";
import {addScenes, DEFAULT_SCENE_ID} from "./misc";
import {getSceneData} from "../../live/SceneManager";

export const DEFAULT_POSITION: [number, number, number] = [0, 0, 0]

export const getInstancePosition = (instance: InstanceData) => {
    return instance?._position ?? DEFAULT_POSITION
}

export const managerProxy = proxy({
    count: 0,
    currentScene: DEFAULT_SCENE_ID,
    scenes: ref({}) as unknown as Record<string, typeof proxyWithHistory>,
})

export const initManagerSceneProxy = (sceneId: string, initialData?: any) => {
    if (managerProxy.scenes[sceneId]) {
        return
    }
    console.log('initManagerSceneProxy', sceneId)
    const initialState = getSceneData(sceneId, initialData)
    console.log('initialState', initialState)
    managerProxy.scenes[sceneId] = proxyWithHistory(initialState) as any
    const sceneProxy = managerProxy.scenes[sceneId] as any

    const savedSaveHistory = sceneProxy.saveHistory
    sceneProxy.saveHistory = () => {
        savedSaveHistory()
        if (sceneProxy.history.snapshots.length > 10) {
            sceneProxy.history.snapshots.shift()
            --sceneProxy.history.index
        }
    }

}

export const initStoredScenes = () => {
    const storedScenes = getStoredScenes() as Record<string, string>
    const scenes: ScenesData = {}
    Object.entries(storedScenes).forEach(([id, name]) => {
        scenes[id] = {
            name,
        }
        initManagerSceneProxy(id)
    })
    addScenes(scenes)
}

export const useCurrentSceneId = () => {
    return useSnapshot(managerProxy).currentScene
}

export const setSelectedScene = (sceneId: string) => {
    managerProxy.currentScene = sceneId
}

export const getManagerSceneProxy = (sceneId?: string): any => {
    if (!sceneId) {
        sceneId = managerProxy.currentScene
    }
    const scene = managerProxy.scenes[sceneId]
    if (scene) {
        return scene
    }
    initManagerSceneProxy(sceneId)
    return managerProxy.scenes[sceneId]
}

export const useCurrentSceneProxy = () => {
    const [proxy, setProxy] = useState<any>(getManagerSceneProxy())

    useEffect(() => {
        const unsub = subscribe(managerProxy, () => {
            setProxy(getManagerSceneProxy())
        })
        return () => {
            unsub()
        }
    }, [])

    return proxy
}

export type ScenesData = Record<string, {
    name: string,
    data?: StoredData,
}>

export const initManager = (currentScene: string, initialScenesData?: ScenesData) => {
    managerProxy.currentScene = currentScene
    initStoredScenes()
    if (initialScenesData) {
        Object.entries(initialScenesData).forEach(([id, data]) => {
            initManagerSceneProxy(id, data.data)
        })
        if (!initialScenesData[currentScene]) {
            initManagerSceneProxy(currentScene)
        }
    } else {
        initManagerSceneProxy(currentScene)
    }
    managerProxy.count += 1
    console.log('initManager...!!!')
}

export const setInstancesData = (sceneId: string, data: any) => {
    const sceneProxy = getManagerSceneProxy(sceneId)
    const newTimestamp = data?.timestamp ?? 0
    const currentTimestamp = sceneProxy.value?.timestamp ?? 0
    if (newTimestamp <= currentTimestamp) {
        console.log('ignoring old data...')
        return
    }
    Object.entries(data).forEach(([key, entry]) => {
        // @ts-ignore
        sceneProxy.value[key] = entry
    })
}

export const ingestScenesData = (scenesData: ScenesData) => {
    Object.entries(scenesData).forEach(([id, data]) => {
        if (data.data) {
            setInstancesData(id, data.data)
        }
    })
    addScenes(scenesData)
}

/*

need to know what scene it is currently
for each scene, have a proxy?
have an overall proxy handler?

 */

// export const instancesDataProxy = proxyWithHistory(getInitialState(DEFAULT_SCENE_ID) as StoredData)

// const savedSaveHistory = instancesDataProxy.saveHistory
// instancesDataProxy.saveHistory = () => {
//     savedSaveHistory()
//     if (instancesDataProxy.history.snapshots.length > 10) {
//         instancesDataProxy.history.snapshots.shift()
//         --instancesDataProxy.history.index
//     }
// }

export const storeScenes = () => {
    const scenes: Record<string, string> = {}

    Object.entries(editorStateProxy.scenes).forEach(([id, data]) => {
        scenes[id] = data?.name ?? ''
    })

    storeScenesInStorage(scenes)
}

export const storeSnapshot = () => {
    const timestamp = Date.now()
    const sceneId = managerProxy.currentScene
    const sceneName = getSceneName(sceneId)
    const sceneProxy = getManagerSceneProxy()
    set(getSceneStorageKey(sceneId), {
        ...snapshot(sceneProxy.value),
        timestamp,
        sceneId,
        sceneName,
    });
}

export const getSnapshot = () => {
    const sceneProxy = getManagerSceneProxy()
    return snapshot(sceneProxy.value)
}

export const useUndoRedoState = () => {

    const sceneProxy = useCurrentSceneProxy()

    const [canRedo, setCanRedo] = useState(sceneProxy.canRedo())
    const [canUndo, setCanUndo] = useState(sceneProxy.canUndo())

    useEffect(() => {
        return subscribe(sceneProxy, () => {
            setCanRedo(sceneProxy.canRedo())
            setCanUndo(sceneProxy.canUndo())
        })
    }, [sceneProxy])

    return {
        canRedo,
        canUndo,
    }

}

export const addNewGroup = (children: string[], parent: string) => {
    const sceneProxy = getManagerSceneProxy()
    const id = uniqueId()
    if (!sceneProxy.value.groups) {
        sceneProxy.value.groups = {}
    }
    children.forEach(childId => {
        if (sceneProxy.value.instances[childId]) {
            sceneProxy.value.instances[childId]._parent = id
        } else if (sceneProxy.value.groups?.[childId]) {
            sceneProxy.value.groups[childId]._parent = id
        }
    })
    sceneProxy.value.groups[id] = {
        children,
        _parent: parent,
    }
}

export const undoData = () => {
    const sceneProxy = getManagerSceneProxy()
    sceneProxy.undo()
    storeSnapshot()
}

export const redoData = () => {
    const sceneProxy = getManagerSceneProxy()
    sceneProxy.redo()
    storeSnapshot()
}

export const deleteInstance = (id: string) => {
    const sceneProxy = getManagerSceneProxy()
    delete sceneProxy.value.instances[id]
}

export const duplicateInstance = (id: string) => {
    const sceneProxy = getManagerSceneProxy()
    const instance = sceneProxy.value.instances[id]
    if (!instance) return
    const newId = uniqueId()
    sceneProxy.value.instances[newId] = {
        ...instance,
        id: newId,
    }
}

export const deleteInstances = (ids: string[]) => {
    const sceneProxy = getManagerSceneProxy()
    const update = {
        ...sceneProxy.value.instances,
    }
    ids.forEach(id => {
        delete update[id]
    })
    sceneProxy.value.instances = update
}

export const addNewInstance = (type: string, name: string, x: number, y: number, z: number, otherValues?: Record<string, any>) => {
    const sceneProxy = getManagerSceneProxy()
    const id = uniqueId()
    sceneProxy.value.instances[id] = {
        id,
        _type: type,
        _name: name,
        _position: [x, y, z],
        ...(otherValues ?? {}),
    }
    return id
}

export const addNewInstanceOfSelectedAsset = (x: number, y: number, z: number, otherValues?: Record<string, any>) => {
    const selectedAsset = editorStateProxy.selectedAsset
    if (!selectedAsset) return ''
    const asset = assetsProxy.assets[selectedAsset]
    if (!asset) return ''
    return addNewInstance(selectedAsset, asset.name, x, y, z, otherValues)
}

export const updateInstanceValue = (id: string, update: Record<string, any>) => {
    const sceneProxy = getManagerSceneProxy()
    if (!sceneProxy.value.instances[id]) {
        console.log(`Can't update instance ${id} as it's not stored.`)
        return
    }
    Object.entries(update).forEach(([key, value]) => {
        sceneProxy.value.instances[id][key] = value
    })
}

export const updateGroupValue = (id: string, update: Record<string, any>) => {
    const sceneProxy = getManagerSceneProxy()
    if (!sceneProxy.value.groups) {
        sceneProxy.value.groups = {}
    }
    sceneProxy.value.groups = {
        ...sceneProxy.value.groups,
        [id]: {
            ...(sceneProxy.value.groups[id] ?? {}),
            ...update,
        }
    }
}

export const updateInstancePosition = (id: string, x: number, y: number, z: number) => {
    updateInstanceValue(id, {
        [InstanceDataKeys.position]: [x, y, z],
    })
}

export const updateInstanceScale = (id: string, x: number, y: number, z: number) => {
    updateInstanceValue(id, {
        [InstanceDataKeys.scale]: [x, y, z],
    })
}

export const updateInstanceRotation = (id: string, x: number, y: number, z: number) => {
    updateInstanceValue(id, {
        [InstanceDataKeys.rotation]: [x, y, z],
    })
}
