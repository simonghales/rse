import React, {MutableRefObject, useCallback, useEffect, useRef} from "react"
import {Plane} from "@react-three/drei";
import {degToRad} from "three/src/math/MathUtils";
import {InstancePreviewHandler} from "./InstancePreview";
import {addNewInstanceOfSelectedAsset} from "../state/data";
import {clearSelectedInstance, setClearPendingDown, useIsPlaceInstanceMode} from "../state/editor";
import {isCommandPressed} from "../state/hotkeys";
import {PlacementType, useSelectedAssetPlacementType} from "../state/assets";
import {useSceneEditorControlsContext} from "../SceneEditorControlsContext";

export const PlacementPlane: React.FC = () => {

    const {
        zAxisVertical,
    } = useSceneEditorControlsContext()

    const localStateRef = useRef({
        onPointerDown: [] as Array<MutableRefObject<(x: number, y: number, z:number) => void>>,
        onPointerUp: [] as Array<MutableRefObject<(x: number, y: number, z:number) => void>>,
        onPointerMove: [] as Array<MutableRefObject<(x: number, y: number, z:number) => void>>,
        pendingDeselect: 0,
        pendingDown: {
            pending: 0,
            x: 0,
            y: 0,
            z: 0,
        },
    })

    useEffect(() => {
        return setClearPendingDown(() => {
            localStateRef.current.pendingDeselect = 0
        })
    }, [])

    const enabled = useIsPlaceInstanceMode()

    useEffect(() => {
        localStateRef.current.pendingDown.pending = 0
    }, [enabled])

    const subscribeOnPointerMove = useCallback((callbackRef: MutableRefObject<(x: number, y: number, z:number) => void>) => {
        localStateRef.current.onPointerMove.push(callbackRef)
        return () => {
            const index = localStateRef.current.onPointerMove.indexOf(callbackRef)
            localStateRef.current.onPointerMove.splice(index)
        }
    }, [])

    const subscribeOnPointerDown = (callbackRef: MutableRefObject<(x: number, y: number, z:number) => void>) => {
        localStateRef.current.onPointerDown.push(callbackRef)
        return () => {
            const index = localStateRef.current.onPointerDown.indexOf(callbackRef)
            localStateRef.current.onPointerDown.splice(index)
        }
    }

    const subscribeOnPointerUp = (callbackRef: MutableRefObject<(x: number, y: number, z:number) => void>) => {
        localStateRef.current.onPointerUp.push(callbackRef)
        return () => {
            const index = localStateRef.current.onPointerUp.indexOf(callbackRef)
            localStateRef.current.onPointerUp.splice(index)
        }
    }

    const onPointerMove = (event: any) => {

        if (!enabled) return

        const x = event?.point?.x ?? 0
        const y = zAxisVertical ? (event?.point?.y ?? 0) : 0
        const z = zAxisVertical ? 0 : (event?.point?.z ?? 0)

        localStateRef.current.onPointerMove.forEach(callbackRef => {
            callbackRef.current(x, y, z)
        })

        if (localStateRef.current.pendingDown.pending) {
            if (
                localStateRef.current.pendingDown.pending < Date.now() - 50 &&
                (
                    localStateRef.current.pendingDown.x !== x ||
                    localStateRef.current.pendingDown.y !== y ||
                    localStateRef.current.pendingDown.z !== z
                )
            ) {
                localStateRef.current.pendingDown.pending = 0
            }
        }

    }

    const onPointerDown = (event: any) => {

        const x = event?.point?.x ?? 0
        const y = zAxisVertical ? (event?.point?.y ?? 0) : 0
        const z = zAxisVertical ? 0 : (event?.point?.z ?? 0)

        localStateRef.current.onPointerDown.forEach(callbackRef => {
            callbackRef.current(x, y, z)
        })

        if (!enabled) {
            localStateRef.current.pendingDeselect = Date.now()
            return
        }

        localStateRef.current.pendingDown.pending = Date.now()
        localStateRef.current.pendingDown.x = x
        localStateRef.current.pendingDown.y = y
        localStateRef.current.pendingDown.z = z
    }

    const placementType = useSelectedAssetPlacementType()

    const clickToPlace = enabled && (placementType === PlacementType.place)

    const onPointerUp = (event: any) => {

        const x = event?.point?.x ?? 0
        const y = zAxisVertical ? (event?.point?.y ?? 0) : 0
        const z = zAxisVertical ? 0 : (event?.point?.z ?? 0)

        localStateRef.current.onPointerUp.forEach(callbackRef => {
            callbackRef.current(x, y, z)
        })

        if (!enabled) {
            if (isCommandPressed()) return
            if (!localStateRef.current.pendingDeselect) return
            // if (hasRecentlyDragged()) return
            clearSelectedInstance()
            return
        }


        if (!localStateRef.current.pendingDown.pending) return
        localStateRef.current.pendingDown.pending = 0


        if (clickToPlace) {
            addNewInstanceOfSelectedAsset(x, y, z)
        }

    }

    return (
        <>
            <Plane onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp}
                   rotation={[zAxisVertical ? 0 : degToRad(-90), 0, 0]} args={[1024, 1024, 2, 2]} visible={false}/>
            {
                enabled && (
                    <InstancePreviewHandler
                        subscribeOnPointerMove={subscribeOnPointerMove}
                        subscribeOnPointerDown={subscribeOnPointerDown}
                        subscribeOnPointerUp={subscribeOnPointerUp}
                    />
                )
            }
        </>
    )
}
