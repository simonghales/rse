import {proxy, ref, useSnapshot} from "valtio";
import {useSelectedAsset} from "./editor";
import {degToRad} from "three/src/math/MathUtils";
import {InstanceData, InstanceDataKeys} from "./types";

export type AssetInputConfig = {
    key: string,
    label: string,
    defaultValue: any,
    options?: Record<string, any>,
}

export type CoreAssetConfig = {
    inputs: Record<string, AssetInputConfig>
    getGroupProps?: (instance: InstanceData, asset: AssetConfig) => Record<string, any>,
}

export enum PlacementType {
    place = 'place',
    box = 'box',
}

export type RequiredAssetConfig = {
    id: string,
    name: string,
    component: any,
    previewComponent?: any,
    placementType?: PlacementType,
}

export type AssetConfig = CoreAssetConfig & RequiredAssetConfig

export const positionInput: AssetInputConfig = {
    key: '_position',
    label: 'Position',
    defaultValue: [0, 0, 0],
}

export const scaleInput: AssetInputConfig = {
    key: '_scale',
    label: 'Scale',
    defaultValue: [1, 1, 1],
}

export const rotationInput: AssetInputConfig = {
    key: '_rotation',
    label: 'Rotation',
    defaultValue: [0, 0, 0],
}

export const defaultGetGroupProps = (instance: InstanceData, asset: AssetConfig) => {
    const props: Record<string, any> = {
        position: instance[InstanceDataKeys.position],
    }
    if (asset.inputs[scaleInput.key] && instance[scaleInput.key]) {
        props.scale = instance[scaleInput.key]
    }
    if (asset.inputs[rotationInput.key] && instance[rotationInput.key]) {
        props.rotation = (instance[rotationInput.key] as [number, number, number]).map(degrees => degToRad(degrees))
    }
    return props
}

export const defaultInputs = {
    [positionInput.key]: positionInput,
    [scaleInput.key]: scaleInput,
    [rotationInput.key]: rotationInput,
}

export const assetsProxy = proxy({
    assets: {} as Record<string, AssetConfig>,
})

export const useAssets = () => {
    return useSnapshot(assetsProxy.assets)
}

export const useAsset = (id: string) => {
    return useAssets()[id]
}

export const getInstanceValue = (instance: InstanceData, input: AssetInputConfig) => {
    if (instance[input.key] !== undefined) {
        return instance[input.key]
    }
    return input.defaultValue
}

export const getInstanceOptions = (value: any, instance: InstanceData, input: AssetInputConfig) => {
    const options = {
        ...input.options ?? {}
    }
    if (options.options) {
        if (!options.options.includes(value)) {
            options.options = options.options.slice()
            options.options.push(value)
        }
    }
    return options
}

export const registerAsset = (assetConfig: RequiredAssetConfig & Partial<AssetConfig>) => {
    assetsProxy.assets[assetConfig.id] = ref({
        getGroupProps: defaultGetGroupProps,
        ...assetConfig,
        inputs: {
            [positionInput.key]: positionInput,
            ...(assetConfig.inputs ?? {}),
        }
    })
}

export const useSelectedAssetConfig = () => {
    const selectedAsset = useSelectedAsset()
    const asset = useAsset(selectedAsset)
    return asset
}

export const useSelectedAssetPlacementType = () => {
    const asset = useSelectedAssetConfig()
    return asset?.placementType ?? PlacementType.place
}

export const useSelectedAssetPreviewComponent = () => {
    const asset = useSelectedAssetConfig()
    if (!asset) return null
    if (asset.previewComponent) {
        return asset.previewComponent
    }
    return asset.component ?? null
}
