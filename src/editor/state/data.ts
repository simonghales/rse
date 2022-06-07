import {proxyWithHistory} from 'valtio/utils'
import {get, set} from "local-storage"
import {uniqueId} from "../../utils/ids";
import {useEffect, useState} from "react";
import {proxy, snapshot, subscribe} from "valtio";
import {editorStateProxy} from "./editor";
import {assetsProxy} from "./assets";

const storageKey = '_instancesData'

export type InstanceData = {
    id: string,
    _type: string,
    _name?: string,
    _parent?: string,
    [key: string]: any,
}

export enum InstanceDataKeys {
    name = '_name',
    position = '_position',
    scale = '_scale',
    rotation = '_rotation',
}

export const DEFAULT_POSITION: [number, number, number] = [0, 0, 0]

export const getInstancePosition = (instance: InstanceData) => {
    return instance?._position ?? DEFAULT_POSITION
}

export type GroupData = {
    children: string[],
    _name?: string,
    _parent?: string,
}

export enum GroupDataKeys {
    name = '_name',
}

export type StoredData = {
    timestamp?: number,
    instances: Record<string, InstanceData>,
    groups?: Record<string, GroupData>,
}

const getInitialState = (): StoredData => {
    return get(storageKey) ?? {
        instances: {},
    }
}

export const instancesDataProxy = proxyWithHistory(getInitialState() as StoredData)

export const setInstancesData = (data: any) => {
    const newTimestamp = data?.timestamp ?? 0
    const currentTimestamp = instancesDataProxy.value?.timestamp ?? 0
    if (newTimestamp <= currentTimestamp) {
        console.log('ignoring old data...')
        return
    }
    Object.entries(data).forEach(([key, entry]) => {
        // @ts-ignore
        instancesDataProxy.value[key] = entry
    })
}

const savedSaveHistory = instancesDataProxy.saveHistory
instancesDataProxy.saveHistory = () => {
    savedSaveHistory()
    if (instancesDataProxy.history.snapshots.length > 10) {
        instancesDataProxy.history.snapshots.shift()
        --instancesDataProxy.history.index
    }
}

export const storeSnapshot = () => {
    const timestamp = Date.now()
    set(storageKey, {
        ...snapshot(instancesDataProxy.value),
        timestamp,
    });
    console.log('storeSnapshot')
}

export const getSnapshot = () => {
    return snapshot(instancesDataProxy.value)
}

subscribe(instancesDataProxy.value, storeSnapshot)

export const useUndoRedoState = () => {

    const [canRedo, setCanRedo] = useState(instancesDataProxy.canRedo())
    const [canUndo, setCanUndo] = useState(instancesDataProxy.canUndo())

    useEffect(() => {
        return subscribe(instancesDataProxy, () => {
            setCanRedo(instancesDataProxy.canRedo())
            setCanUndo(instancesDataProxy.canUndo())
        })
    }, [])

    return {
        canRedo,
        canUndo,
    }

}

export const addNewGroup = (children: string[], parent: string) => {
    const id = uniqueId()
    if (!instancesDataProxy.value.groups) {
        instancesDataProxy.value.groups = {}
    }
    children.forEach(childId => {
        if (instancesDataProxy.value.instances[childId]) {
            instancesDataProxy.value.instances[childId]._parent = id
        } else if (instancesDataProxy.value.groups?.[childId]) {
            instancesDataProxy.value.groups[childId]._parent = id
        }
    })
    instancesDataProxy.value.groups[id] = {
        children,
        _parent: parent,
    }
}

export const undoData = () => {
    instancesDataProxy.undo()
    storeSnapshot()
}

export const redoData = () => {
    instancesDataProxy.redo()
    storeSnapshot()
}

export const deleteInstance = (id: string) => {
    delete instancesDataProxy.value.instances[id]
}

export const duplicateInstance = (id: string) => {
    const instance = instancesDataProxy.value.instances[id]
    if (!instance) return
    const newId = uniqueId()
    instancesDataProxy.value.instances[newId] = {
        ...instance,
        id: newId,
    }
}

export const deleteInstances = (ids: string[]) => {
    const update = {
        ...instancesDataProxy.value.instances,
    }
    ids.forEach(id => {
        delete update[id]
    })
    instancesDataProxy.value.instances = update
}

export const addNewInstance = (type: string, name: string, x: number, y: number, z: number, otherValues?: Record<string, any>) => {
    const id = uniqueId()
    instancesDataProxy.value.instances[id] = {
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
    if (!instancesDataProxy.value.instances[id]) {
        console.log(`Can't update instance ${id} as it's not stored.`)
        return
    }
    Object.entries(update).forEach(([key, value]) => {
        instancesDataProxy.value.instances[id][key] = value
    })
}

export const updateGroupValue = (id: string, update: Record<string, any>) => {
    if (!instancesDataProxy.value.groups) {
        instancesDataProxy.value.groups = {}
    }
    instancesDataProxy.value.groups = {
        ...instancesDataProxy.value.groups,
        [id]: {
            ...(instancesDataProxy.value.groups[id] ?? {}),
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
