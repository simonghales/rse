import React, {useCallback, useEffect, useRef} from "react"
import {Object3D} from "three";
import {useEffectRef} from "../../utils/hooks";
import {PlacementType, useSelectedAssetPlacementType, useSelectedAssetPreviewComponent} from "../state/assets";
import {BoxPlacementPreview} from "./assets/BoxPlacementPreview";

export type InstancePreviewProps = {
    subscribeOnPointerMove: any,
    subscribeOnPointerDown: any,
    subscribeOnPointerUp: any,
}

export const InstancePreview: React.FC<InstancePreviewProps> = ({subscribeOnPointerMove}) => {

    const Component = useSelectedAssetPreviewComponent()

    const groupRef = useRef<Object3D>()

    const onPointerMove = useCallback((x: number, y: number, z: number) => {
        if (!groupRef.current) return
        groupRef.current?.position.set(x, y, z)
    }, [])

    const onPointerMoveRef = useEffectRef(onPointerMove)

    useEffect(() => {
        return subscribeOnPointerMove(onPointerMoveRef)
    }, [subscribeOnPointerMove])

    return (
        <group ref={groupRef}>
            {
                Component && <Component/>
            }
        </group>
    )
}

export const InstancePreviewHandler: React.FC<InstancePreviewProps> = (props) => {

    const placementType = useSelectedAssetPlacementType()

    if (placementType === PlacementType.box) {
        return <BoxPlacementPreview {...props}/>
    }

    return <InstancePreview {...props}/>
}
