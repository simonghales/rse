import React, {useCallback, useEffect, useMemo} from "react"
import {useControls} from "leva";
import {useSnapshot} from "valtio";
import {updateInstanceValue} from "../state/data";
import {AssetConfig, AssetInputConfig, getInstanceOptions, getInstanceValue, useAsset} from "../state/assets";
import {InstanceData, StoredData} from "../state/types";
import {useCurrentSceneProxy} from "../state/Manager";

const getMappedKey = (label: string, asset: AssetConfig) => {
    const inputs = asset.inputs ?? {}
    const match = Object.entries(inputs).find(([, value]) => {
        return value.label === label
    })
    if (match) {
        return match[0]
    }
    return label
}

export const SelectedInstanceMenu: React.FC<{
    id: string,
}> = ({id}) => {

    const sceneProxy = useCurrentSceneProxy()

    const instances = (useSnapshot(sceneProxy).value as StoredData).instances

    const instance = useMemo(() => {
        return instances[id]
    }, [instances, id])

    const instanceAsset = instance?._type

    const asset = useAsset(instanceAsset)

    const onChange = useCallback((value: any, key: string, context: {
        initial: boolean,
        fromPanel: boolean,
    }) => {
        if (!context.fromPanel || context.initial) {
            return
        }
        updateInstanceValue(id, {
            [getMappedKey(key, asset)]: value,
        })
    }, [id, asset])

    const config = useMemo(() => {
        const config: Record<string, any> = {}
        if (!asset) return config
        const inputs = asset.inputs ?? {}
        Object.entries(inputs).forEach(([key, value]) => {
            const inputValue = getInstanceValue(instance as InstanceData, value as AssetInputConfig)
            config[value.label] = {
                ...getInstanceOptions(inputValue, instance as InstanceData, value as AssetInputConfig),
                value: inputValue,
                onChange,
            }
        })
        return config
    }, [instance, asset, onChange])

    const [, set] = useControls(() => {
        return config
    }, [id, onChange])

    useEffect(() => {
        const update: Record<string, any> = {}
        Object.entries(config).forEach(([key, value]) => {
            update[key] = value.value
        })
        set(update)
    }, [id, config, set])

    return null
}
