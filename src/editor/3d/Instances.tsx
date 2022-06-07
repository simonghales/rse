import React, {useEffect, useMemo} from "react"
import {Instance} from "./Instance";
import {useSnapshot} from "valtio";
import {InstanceData, instancesDataProxy} from "../state/data";
import {editorStateProxy, useIsFreeViewMode, useSelectedInstance, useSelectedInstances} from "../state/editor";
import {SelectedInstanceHandler} from "./SelectedInstanceHandler";
import {SelectedInstanceMenu} from "../menus/SelectedInstanceMenu";
import {SelectedInstancesRangeHandler} from "./SelectedInstancesRangeHandler";
import {AssetConfig, useAssets} from "../state/assets";

const SceneInstances: React.FC = () => {
    const assets = useAssets()
    const data = useSnapshot(instancesDataProxy).value.instances
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
            const selectable = isFreeView
            if (!asset) {
                return null
            }
            const groupProps = (asset && asset.getGroupProps) ? asset.getGroupProps(instance as InstanceData, asset as AssetConfig) : {}
            return (
                <Instance {...(instance as InstanceData)} groupProps={groupProps} selectable={selectable} component={asset.component} rangeSelected={rangeSelected} selected={selected} hovered={id === hoveredInstance} key={id}/>
            )
        })
    }, [data, assets, isFreeView, selectedInstance, hoveredInstance, selectedInstancesRange, selectedInstanceSource])

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
