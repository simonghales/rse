import React, {useCallback, useEffect, useRef, useState} from "react"
import {InstancePreviewProps} from "../InstancePreview";
import {useEffectRef} from "../../../utils/hooks";
import {Box, Sphere} from "@react-three/drei";
import {addNewInstanceOfSelectedAsset} from "../../state/data";
import {Object3D} from "three";
import {isCommandPressed, isShiftPressed} from "../../state/hotkeys";
import {clearSelectedAsset, setSelectedInstance} from "../../state/editor";
import {useSceneEditorControlsContext} from "../../SceneEditorControlsContext";

export const BoxPlacementPreview: React.FC<InstancePreviewProps> = ({
    subscribeOnPointerDown,
    subscribeOnPointerUp,
    subscribeOnPointerMove,
                                                                    }) => {

    const {
        zAxisVertical,
    } = useSceneEditorControlsContext()

    const startIndex = 0
    const endIndex = zAxisVertical ? 1 : 2


    const [pointerDown, setPointerDown] = useState(false)

    const localStateRef = useRef({
        startingPoint: [0, 0, 0] as [number, number, number],
        moved: false,
        pointerDown: false,
    })

    const boxRef = useRef<Object3D>(null!)
    const startRef = useRef<any>()
    const endRef = useRef<any>()

    const updateBox = useCallback((from: [number, number, number], to: [number, number, number]) => {
        const shiftPressed = isShiftPressed()
        let width = Math.abs(from[startIndex] - to[startIndex])
        let height = Math.abs(from[endIndex] - to[endIndex])
        let startX = from[0]
        let startY = from[1]
        let startZ = from[2]
        let endX = to[0]
        let endY = to[1]
        let endZ = to[2]
        let fromStart = from[startIndex]
        let toStart = to[startIndex]
        let fromEnd = from[endIndex]
        let toEnd = to[endIndex]
        if (shiftPressed) {
            width = Math.round(width)
            height = Math.round(height)
            startX = Math.round(startX)
            startY = Math.round(startY)
            startZ = Math.round(startZ)
            endX = Math.round(endX)
            endY = Math.round(endY)
            endZ = Math.round(endZ)
            fromStart = Math.round(fromStart)
            toStart = Math.round(toStart)
            fromEnd = Math.round(fromEnd)
            toEnd = Math.round(toEnd)
        }
        startRef.current.position.set(
            startX,
            startY,
            startZ,
        )
        endRef.current.position.set(
            endX,
            endY,
            endZ,
        )
        if (toStart > fromStart) {
            if (toEnd > fromEnd) {
                const right = fromStart
                const bottom = fromEnd
                const start = right + (width / 2)
                const end = bottom + (height / 2)
                boxRef.current.position.set(start, zAxisVertical ? end : boxRef.current.position.y, !zAxisVertical ? end : boxRef.current.position.z)
            } else {
                const right = fromStart
                const bottom = fromEnd
                const start = right + (width / 2)
                const end = bottom - (height / 2)
                boxRef.current.position.set(start, zAxisVertical ? end : boxRef.current.position.y, !zAxisVertical ? end : boxRef.current.position.z)
            }
        } else {
            if (toEnd > fromEnd) {
                const left = fromStart
                const bottom = fromEnd
                const start = left - (width / 2)
                const end = bottom + (height / 2)
                boxRef.current.position.set(start, zAxisVertical ? end : boxRef.current.position.y, !zAxisVertical ? end : boxRef.current.position.z)
            } else {
                const left = fromStart
                const bottom = fromEnd
                const start = left - (width / 2)
                const end = bottom - (height / 2)
                boxRef.current.position.set(start, zAxisVertical ? end : boxRef.current.position.y, !zAxisVertical ? end : boxRef.current.position.z)
            }
        }
        boxRef.current.scale.set(width, zAxisVertical ? height : 0.01, !zAxisVertical ? height : 0.01)
    }, [])

    const onPointerDown = useCallback((x: number, y: number, z: number) => {
        if (isCommandPressed()) {
            console.log('skip, command pressed...')
            localStateRef.current.pointerDown = false
            return
        }
        localStateRef.current.startingPoint = [x, y, z]
        localStateRef.current.moved = false
        localStateRef.current.pointerDown = true
        setPointerDown(true)
        updateBox([x, y, z], [x, y, z])
    }, [])

    const onPointerUp = useCallback((x: number, y: number, z: number) => {
        const valid = localStateRef.current.pointerDown
        localStateRef.current.pointerDown = false
        if (!valid) return
        updateBox(localStateRef.current.startingPoint, [x, y, z])
        setPointerDown(false)
        if (!localStateRef.current.moved) {
            return
        }
        const id = addNewInstanceOfSelectedAsset(boxRef.current.position.x, boxRef.current.position.y, boxRef.current.position.z, {
            _width: boxRef.current.scale.x,
            _depth: zAxisVertical ? boxRef.current.scale.y : boxRef.current.scale.z,
        })
        if (id) {
            setSelectedInstance(id)
        }
        clearSelectedAsset()
    }, [])

    const onPointerMove = useCallback((x: number, y: number, z: number) => {
        if (!localStateRef.current.pointerDown) return
        localStateRef.current.moved = true
        updateBox(localStateRef.current.startingPoint, [x, y, z])
    }, [])

    const onPointerDownRef = useEffectRef(onPointerDown)
    const onPointerUpRef = useEffectRef(onPointerUp)
    const onPointerMoveRef = useEffectRef(onPointerMove)

    useEffect(() => {
        const unsubs: any[] = []
        unsubs.push(subscribeOnPointerDown(onPointerDownRef))
        unsubs.push(subscribeOnPointerUp(onPointerUpRef))
        unsubs.push(subscribeOnPointerMove(onPointerMoveRef))
        return () => {
            unsubs.forEach(unsub => unsub())
        }
    }, [])

    return (
        <>
            <Box visible={pointerDown} ref={boxRef}>
                <meshBasicMaterial color="purple"/>
            </Box>
            <Sphere visible={pointerDown} scale={[0.25, 0.25, 0.25]} ref={startRef}>
                <meshBasicMaterial color={'green'} transparent opacity={0.25}/>
            </Sphere>
            <Sphere visible={pointerDown} scale={[0.25, 0.25, 0.25]} ref={endRef}>
                <meshBasicMaterial color={'green'} transparent opacity={0.25}/>
            </Sphere>
        </>
    )
}
