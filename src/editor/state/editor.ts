import {proxy, ref, useSnapshot} from "valtio";
import {MutableRefObject, useMemo} from "react";
import {Object3D} from "three";
import {addNewGroup, deleteInstances, instancesDataProxy} from "./data";
import {GroupData, InstanceData} from "./types";

export enum EditMode {
    FREE_VIEW = 'FREE_VIEW',
    PLACE_INSTANCE = 'PLACE_INSTANCE',
}

export const miscState = {
    clearPendingDown: () => {},
    pendingSelect: '',
    lastDragged: 0,
    isDragging: false,
}

export const setIsDragging = (isDragging: boolean) => {
    miscState.isDragging = isDragging
}

export const updateLastDragged = () => {
    miscState.lastDragged = Date.now()
}

export const hasRecentlyDragged = () => {
    return miscState.isDragging || ((Date.now() - miscState.lastDragged) < 35)
}

export const setPendingSelect = (id: string) => {
    miscState.pendingSelect = id
}

export const isPendingSelect = (id: string) => {
    return miscState.pendingSelect === id
}

export const clearPendingSelect = () => {
    miscState.pendingSelect = ''
}

export const setClearPendingDown = (callback: () => void) => {
    miscState.clearPendingDown = callback
    return () => {
        miscState.clearPendingDown = () => {}
    }
}

export const editorContextStateProxy = proxy({
    isSelected: false,
    selectedId: '',
    x: 50,
    y: 200,
})

export const clearEditorContextState = () => {
    editorContextStateProxy.selectedId = ''
}

export const setEditorContextSelectedId = (id: string, x: number, y: number, selected: boolean) => {
    editorContextStateProxy.selectedId = id
    editorContextStateProxy.x = x
    editorContextStateProxy.y = y
    editorContextStateProxy.isSelected = selected
}

export enum TransformMode {
    position = 'position',
    rotation = 'rotation',
    scale = 'scale',
}

export const editorStateProxy = proxy({
    editMode: EditMode.FREE_VIEW,
    transformMode: TransformMode.position,
    selectedInstance: {
        id: '',
        objRef: null as null | MutableRefObject<Object3D>,
        manualMode: false,
    },
    selectedInstancesRange: [] as string[],
    selectedInstancesRangeRefs: {} as Record<string, MutableRefObject<Object3D>>,
    hoveredInstance: '',
    selectedAsset: '',
    expandedState: {} as Record<string, boolean>,
    dragging: false,
})

export const isEditorDragging = () => {
    return editorStateProxy.dragging
}

export const setEditorDragging = (dragging: boolean) => {
    editorStateProxy.dragging = dragging
}

export const setTransformMode = (mode: TransformMode) => {
    editorStateProxy.transformMode = mode
}

export const useTransformMode = () => {
    return useSnapshot(editorStateProxy).transformMode
}

export const useSelectedAsset = () => {
    return useSnapshot(editorStateProxy).selectedAsset
}

export const setGroupExpanded = (id: string, expanded: boolean) => {
    editorStateProxy.expandedState[id] = expanded
}

export const useIsGroupExpanded = (id: string) => {
    const expandedState = useSnapshot(editorStateProxy.expandedState)
    if (expandedState[id] === undefined) return true
    return expandedState[id]
}

export const editorStateMisc = {
    selectedInstancesRangeUnsubs: {} as Record<string, () => void>,
}

export const triggerSelectedInstancesRangeUnsubs = (ids: string[]) => {
    ids.forEach(id => {
        if (editorStateMisc.selectedInstancesRangeUnsubs[id]) {
            editorStateMisc.selectedInstancesRangeUnsubs[id]()
        }
    })
}

export const setSelectedInstanceRangeUnsub = (id: string, unsub: () => void) => {
    editorStateMisc.selectedInstancesRangeUnsubs[id] = unsub
    return () => {
        delete editorStateMisc.selectedInstancesRangeUnsubs[id]
    }
}

export const setSelectedAsset = (id: string) => {
    editorStateProxy.selectedAsset = id
}

export const clearHoveredInstance = (id: string) => {
    if (id === editorStateProxy.hoveredInstance) {
        editorStateProxy.hoveredInstance = ''
    }
}

export const setHoveredInstance = (id: string) => {
    editorStateProxy.hoveredInstance = id
}

export const useSelectedInstance = () => {
    return useSnapshot(editorStateProxy).selectedInstance
}

export const getSelectedId = () => {
    return editorStateProxy.selectedInstance.id
}

export const clearSelectedInstance = () => {
    editorStateProxy.selectedInstance.id = ''
    editorStateProxy.selectedInstance.objRef = null
    editorStateProxy.selectedInstance.manualMode = false
    editorStateProxy.selectedInstancesRange = []
}

export const enterManualMode = () => {
    editorStateProxy.selectedInstance.manualMode = true
}

export const hasSelectedInstance = () => {
    return !!editorStateProxy.selectedInstance.id
}

export const setSelectedInstance = (id: string, clearSelectedRange: boolean = true) => {
    if (clearSelectedRange) {
        editorStateProxy.selectedInstancesRange = []
        editorStateProxy.selectedInstance.id = id
    } else {
        editorStateProxy.selectedInstancesRange.push(id)
    }
}

export const addSelectedInstanceRangeRef = (id: string, objRef: MutableRefObject<Object3D>) => {
    editorStateProxy.selectedInstancesRangeRefs[id] = ref(objRef)
    return () => {
        console.log('remove selected?')
        delete editorStateProxy.selectedInstancesRangeRefs[id]
    }
}

export const setSelectedInstanceRef = (id: string, objRef: MutableRefObject<Object3D>) => {
    editorStateProxy.selectedInstance.objRef = ref(objRef)
    return () => {
        editorStateProxy.selectedInstance.objRef = null
    }
}

export const useEditMode = () => {
    return useSnapshot(editorStateProxy).editMode
}

export const startPlaceMode = () => {
    editorStateProxy.editMode = EditMode.PLACE_INSTANCE
}

export const clearSelectedAsset = () => {
    editorStateProxy.editMode = EditMode.FREE_VIEW
    editorStateProxy.selectedAsset = ''
}

export const startFreeViewMode = () => {
    clearSelectedAsset()
}

export const useIsFreeViewMode = () => {
    return useEditMode() === EditMode.FREE_VIEW
}

export const useIsPlaceInstanceMode = () => {
    return useEditMode() === EditMode.PLACE_INSTANCE
}

const getSelectedInstanceIndex = (instances: string[]) => {
    if (!editorStateProxy.selectedInstance.id) {
        return 0
    }
    const index = instances.indexOf(editorStateProxy.selectedInstance.id)
    return index
}

const getInstancesInRange = (instances: string[], start: number, end: number): string[] => {
    let from = start
    let to = end + 1
    if (start > end) {
        from = end
        to = start
    }
    return instances.slice(from, to)
}

export const deselectInstance = (id: string) => {
    if (editorStateProxy.selectedInstance.id === id) {
        editorStateProxy.selectedInstance.id = ''
    }
    if (editorStateProxy.selectedInstancesRange.includes(id)) {
        const index = editorStateProxy.selectedInstancesRange.indexOf(id)
        editorStateProxy.selectedInstancesRange.splice(index, 1)
    }
}

export const selectInstancesRange = (targetId: string) => {

    const order = sortInstances(instancesDataProxy.value.instances as any, instancesDataProxy.value.groups as any)

    const currentStartingIndex = getSelectedInstanceIndex(order)

    const targetIndex = order.indexOf(targetId)

    const inRange = getInstancesInRange(order, currentStartingIndex, targetIndex)

    editorStateProxy.selectedInstancesRange = inRange

}

const getSelectedInstances = () => {
    const instances = {} as Record<string, string>
    if (editorStateProxy.selectedInstance.id) {
        instances[editorStateProxy.selectedInstance.id] = editorStateProxy.selectedInstance.id
    }
    editorStateProxy.selectedInstancesRange.forEach(id => {
        instances[id] = id
    })
    return Object.keys(instances)
}

export const getGroup = (id: string) => {
    return instancesDataProxy.value.groups?.[id]
}

export const getGroupLevel = (id: string, currentLevel: number, group?: GroupData): number => {
    group = group || getGroup(id)
    if (!group) return currentLevel
    if (!id) return currentLevel
    if (!group._parent) return currentLevel + 1
    return getGroupLevel(group._parent, currentLevel + 1)
}

export const getInstanceLevel = (id: string, instance: InstanceData) => {
    if (!instance._parent) return 0
    return getGroupLevel(instance._parent, 0)
}

export const getHighestParent = (instances: string[]) => {
    let parentLevel: null | number = null
    let parent: null | string = ''
    const instancesData = instancesDataProxy.value.instances
    const groupsData = instancesDataProxy.value.groups ?? {}
    instances.forEach((id) => {
        let instanceParent = ''
        let instanceLevel = 0
        if (instancesData[id]) {
            const instance = instancesData[id]
            if (instance._parent) {
                instanceParent = instance._parent
            }
            instanceLevel = getInstanceLevel(id, instance)
        } else if (groupsData[id]) {
            const group = groupsData[id]
            if (group._parent) {
                instanceParent = group._parent
            }
            instanceLevel = getGroupLevel(instanceParent, 0, group)
        }
        if (parentLevel === null || instanceLevel < parentLevel) {
            parentLevel = instanceLevel
            parent = instanceParent
        }

    })
    return parent ?? ''
}

export const groupSelectedInstances = () => {
    const instances = getSelectedInstances()
    const targetParent = getHighestParent(instances)
    addNewGroup(instances, targetParent)
}

export const deleteSelectedInstances = () => {
    const instances = getSelectedInstances()
    triggerSelectedInstancesRangeUnsubs(instances)
    deleteInstances(instances)
}

export const useSelectedInstances = () => {
    const {
        editMode,
        selectedInstancesRange,
    } = useSnapshot(editorStateProxy)
    const {
        id,
        manualMode,
    } = useSnapshot(editorStateProxy.selectedInstance)
    return useMemo(() => {
        if (editMode !== EditMode.FREE_VIEW) {
            return {
                selectedInstance: '',
                selectedInstancesRange: [],
                manualMode,
            }
        }
        return {
            selectedInstance: id,
            selectedInstancesRange,
            manualMode,
        }
    }, [editMode, id, selectedInstancesRange, manualMode])
}

export const insertChildren = (children: string[], groups: Record<string, GroupData>) => {
    for (let i = children.length - 1; i >= 0; i--) {
        const id = children[i]
        if (groups[id]) {
            const group = groups[id]
            if (group?.children) {
                const groupChildren = group.children.slice()
                insertChildren(groupChildren, groups)
                children.splice(i + 1, 0, ...groupChildren)
            }
        }
    }
}

export const getGroupDepth = (currentLevel: number, groupId: string, group: GroupData, groups: Record<string, GroupData>, groupsMap: Record<string, number>): number => {

    let depth = currentLevel

    const parent = group._parent

    if (parent) {
        const groupParent = groups[parent]
        if (groupParent) {
            depth = getGroupDepth(depth, parent, groupParent, groups, groupsMap) + 1
        } else {
            depth += 1
        }
    }

    groupsMap[groupId] = depth

    return depth
}

export const insertOrphans = (children: string[], orphans: Record<string, string[]>, groupsMap: Record<string, number>) => {

    const rootOrphans = orphans['']

    if (rootOrphans) {
        children.splice(0, 0, ...rootOrphans)
    }

    const sortedGroups = Object.keys(groupsMap).sort(([groupA, groupB]) => {
        return (groupsMap[groupA] ?? -1) - (groupsMap[groupB] ?? -1)
    })

    sortedGroups.forEach(groupId => {
        const groupOrphans = orphans[groupId]
        if (!groupOrphans) return
        const groupIndex = children.indexOf(groupId)
        children.splice(groupIndex + 1, 0, ...groupOrphans)
    })

}

export const sortInstances = (instances: Record<string, InstanceData>, groups?: Record<string, GroupData>) => {

    groups = groups || {}

    const root = groups[''] ?? {}

    const children: string[] = root?.children ? root.children.slice() : []

    insertChildren(children, groups)

    const groupsMap: Record<string, number> = {}

    Object.entries(groups).forEach(([groupId, group]) => {
        if (!groupId) {
            // is root, ignore...
            return
        }
        if (groupsMap[groupId] !== undefined) return
        getGroupDepth(0, groupId, group, groups, groupsMap)
    })

    const orphans: Record<string, string[]> = {}

    Object.entries(instances).forEach(([id, instance]) => {
        if (!children.includes(id)) {
            const parent = instance?._parent ?? ''
            if (!orphans[parent]) {
                orphans[parent] = []
            }
            orphans[parent].push(id)
        }
    })

    Object.entries(groups).forEach(([id, group]) => {
        if (!id) return // skip root
        if (!children.includes(id)) {
            const parent = group?._parent ?? ''
            if (!orphans[parent]) {
                orphans[parent] = []
            }
            orphans[parent].push(id)
        }
    })

    insertOrphans(children, orphans, groupsMap)

    return children

}
