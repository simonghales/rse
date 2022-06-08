import React, {useEffect, useMemo} from "react"
import {Instance} from "./Instance";
import {useSnapshot} from "valtio";
import {instancesDataProxy} from "../state/data";
import {editorStateProxy, useIsFreeViewMode, useSelectedInstance, useSelectedInstances} from "../state/editor";
import {SelectedInstanceHandler} from "./SelectedInstanceHandler";
import {SelectedInstanceMenu} from "../menus/SelectedInstanceMenu";
import {SelectedInstancesRangeHandler} from "./SelectedInstancesRangeHandler";
import {AssetConfig, useAssets} from "../state/assets";
import {GroupData, InstanceData} from "../state/types";

const isParentGroupLocked = (id: string, groups: Record<string, GroupData>) => {
    const parentGroup = Object.entries(groups).find(([groupId, groupData]) => {
        return (groupData.children.includes(id))
    })
    if (parentGroup) {
        return parentGroup[1]._locked ?? false
    }
    return false
}

const isParentGroupHidden = (id: string, groups: Record<string, GroupData>) => {
    const parentGroup = Object.entries(groups).find(([groupId, groupData]) => {
        return (groupData.children.includes(id))
    })
    if (parentGroup) {
        return parentGroup[1]._hidden ?? false
    }
    return false
}

const SceneInstances: React.FC = () => {
    const assets = useAssets()
    const {
        instances: data,
        groups,
    } = useSnapshot(instancesDataProxy).value
    const hoveredInstance = useSnapshot(editorStateProxy).hoveredInstance
    const isFreeView = useIsFreeViewMode()
    const {
        selectedInstance: selectedInstanceSource,
        selectedInstancesRange,
    } = useSelectedInstances()

    const selectedInstance = useMemo(() => {
        if (!isFreeView) return ''
        if (selectedInstancesRange.length === 0 || selectedInstancesRange.length === 1 && (selectedInstancesRange[0] === selectedInstanceSource)) {
            return selectedInstanceSource
        }
        return ''
    }, [isFreeView, selectedInstanceSource, selectedInstancesRange])

    const instances = useMemo(() => {
        return Object.entries(data).map(([id, instance]) => {
            const selected = id === selectedInstance
            const rangeSelected = isFreeView && (!selected && (id === selectedInstanceSource || selectedInstancesRange.includes(id)))
            const asset = assets[instance._type]
            if (!asset) {
                return null
            }
            const groupProps = (asset && asset.getGroupProps) ? asset.getGroupProps(instance as InstanceData, asset as AssetConfig) : {}
            const selectable = isFreeView && !isParentGroupLocked(id, groups as any)
            const hidden = isParentGroupHidden(id, groups as any)
            return (
                <Instance {...(instance as InstanceData)} hidden={hidden} groupProps={groupProps} selectable={selectable} component={asset.component} rangeSelected={rangeSelected} selected={selected} hovered={id === hoveredInstance} key={id}/>
            )
        })
    }, [data, assets, isFreeView, selectedInstance, hoveredInstance, selectedInstancesRange, selectedInstanceSource, groups])

    return (
        <>
            {instances}
        </>
    )
}


export const Instances: React.FC = () => {

    const {
        id,
        objRef,
    } = useSnapshot(editorStateProxy.selectedInstance)

    return (
        <>
            <SceneInstances/>
            <SelectedInstancesRangeHandler/>
            {
                (id && objRef) && (
                    <SelectedInstanceHandler id={id} objRef={objRef as any}/>
                )
            }
            {
                id && (
                    <SelectedInstanceMenu id={id}/>
                )
            }
        </>
    )

}
