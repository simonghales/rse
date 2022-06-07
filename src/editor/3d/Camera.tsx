import React, {MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef} from "react"
import {OrbitControls as OrbitControlsImpl} from "three-stdlib"
import {MapControls as MapControlsImpl} from "three-stdlib"
import {MapControls, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {clearPendingSelect, miscState, useIsPlaceInstanceMode, useSelectedInstance} from "../state/editor";
import {useIsCommandPressed} from "../state/hotkeys";
import {useSceneEditorControlsContext} from "../SceneEditorControlsContext";
import {Matrix4, Object3D, Vector3} from "three";
import {debounce} from "lodash";
import {get, set} from "local-storage";
import {useThree} from "@react-three/fiber";

const storageKeys = {
    cameraMatrix: '_cameraMatrix',
    cameraPosition: '_cameraPosition',
    cameraTargetPosition: '_cameraTargetPosition',
}

const storeCameraPosition = (controls: MapControlsImpl) => {

    // set(storageKeys.cameraMatrix, controls.object.matrix.toArray())
    set(storageKeys.cameraPosition, controls.object.position.toArray())
    set(storageKeys.cameraTargetPosition, controls.target.toArray())

}

const getStoredCameraPosition = (): [number, number, number] | null => {

    return get(storageKeys.cameraPosition)

}

const getStoredCameraTargetPosition = (): [number, number, number] | null => {

    return get(storageKeys.cameraTargetPosition)

}

const getStoredCameraMatrix = (): number[] | null => {

    return get(storageKeys.cameraMatrix)

}

const Controls: React.FC<{
    cameraRef: MutableRefObject<Object3D>,
}> = ({cameraRef}) => {

    const ref = useRef<OrbitControlsImpl>(null!)
    const controlsRef = useRef<MapControlsImpl>(null!)

    const localStateRef = useRef({
        moving: false,
    })

    const defaultCamera = useThree((state) => state.camera)

    useEffect(() => {

        const set = () => {
            const targetPosition = getStoredCameraTargetPosition()

            if (targetPosition) {
                console.log('setting target...', targetPosition)
                controlsRef.current.target.fromArray(targetPosition)
            }

            const position = getStoredCameraPosition()

            if (position) {
                controlsRef.current.object.position.fromArray(position)
                // cameraRef.current.position.fromArray(position)
                console.log('setting position?', position)

                // @ts-ignore
                controlsRef.current.object.updateProjectionMatrix()

            }

            controlsRef.current.update()

            console.log('updated controls...')
        }

        set()

    }, [defaultCamera])

    // const onStart = (event: any) => {
    //     localStateRef.current.moving = true
    // }
    //
    // const onEnd = (event: any) => {
    //     localStateRef.current.moving = false
    // }
    //
    // const onChange = () => {
    //     if (localStateRef.current.moving) {
    //         miscState.clearPendingDown()
    //         clearPendingSelect()
    //     }
    // }

    const commandPressed = useIsCommandPressed()

    const selectedInstance = useSelectedInstance()
    const hasSelectedInstance = selectedInstance?.id !== ''

    const disabled = useIsPlaceInstanceMode()

    const {
        onEnd,
    } = useMemo(() => {
        return {
            onEnd: debounce(() => {

                if (!cameraRef.current) return

                storeCameraPosition(controlsRef.current)


            }, 500, {
                leading: true,
                trailing: true,
            })
        }
    }, [])

    useEffect(() => {
        return () => {
            onEnd.cancel()
        }
    }, [onEnd])

    return <MapControls ref={controlsRef} enabled={!hasSelectedInstance && !disabled} enableRotate={false} onEnd={onEnd}/>

    // return (
    //     <OrbitControls mouseButtons={{
    //         LEFT: 2,
    //         RIGHT: 2,
    //         MIDDLE: 2,
    //     }} enablePan={false} enableRotate={commandPressed} onChange={onChange} onEnd={onEnd} onStart={onStart} makeDefault ref={ref} />
    // )

}

export const Camera: React.FC = () => {

    const cameraRef = useRef<Object3D>(null!)

    const {
        zAxisVertical,
    } = useSceneEditorControlsContext()

    useLayoutEffect(() => {
        if (!cameraRef.current) return
        // const cameraPosition = getStoredCameraPosition()
        if (zAxisVertical) {
            cameraRef.current.up.set(0, 0, 1)
            cameraRef.current.lookAt(0, 0, 0)
            cameraRef.current.position.set(0, 0, 5)
        } else {
            cameraRef.current.up.set(0, 1, 0)
            cameraRef.current.lookAt(0, 0, 0)
            cameraRef.current.position.set(0, 5, -5)
        }
        cameraRef.current.rotation.set(0, 0, 0)

        console.log('finished initial setup...')

    }, [])

    return (
        <>
            <PerspectiveCamera ref={cameraRef} makeDefault />
            <Controls cameraRef={cameraRef}/>
        </>
    )
}
