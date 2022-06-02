import React, {useCallback, useEffect, useMemo} from "react"
import {useControls} from "leva";
import {useSnapshot} from "valtio";
import {InstanceData, instancesDataProxy, updateInstanceValue} from "../state/data";
import {AssetConfig, AssetInputConfig, getInstanceValue, useAsset} from "../state/assets";

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

    const instances = useSnapshot(instancesDataProxy).value.instances

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
            config[value.label] = {
                value: getInstanceValue(instance as InstanceData, value as AssetInputConfig),
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
