import React, {useCallback, useEffect, useRef, useState} from "react"
import {InstancePreviewProps} from "../InstancePreview";
import {useEffectRef} from "../../../utils/hooks";
import {Box, Sphere} from "@react-three/drei";
import {addNewInstanceOfSelectedAsset} from "../../state/data";
import {Object3D} from "three";
import {isCommandPressed} from "../../state/hotkeys";
import {clearSelectedAsset, setSelectedInstance} from "../../state/editor";

export const BoxPlacementPreview: React.FC<InstancePreviewProps> = ({
    subscribeOnPointerDown,
    subscribeOnPointerUp,
    subscribeOnPointerMove,
                                                                    }) => {

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
        const width = Math.abs(from[0] - to[0])
        const height = Math.abs(from[2] - to[2])
        startRef.current.position.set(from[0], from[1], from[2])
        endRef.current.position.set(to[0], to[1], to[2])
        if (to[0] > from[0]) {
            if (to[2] > from[2]) {
                const right = from[0]
                const bottom = from[2]
                boxRef.current.position.set(right + (width / 2), boxRef.current.position.y, bottom + (height / 2))
            } else {
                const right = from[0]
                const bottom = from[2]
                boxRef.current.position.set(right + (width / 2), boxRef.current.position.y, bottom - (height / 2))
            }
        } else {
            if (to[2] > from[2]) {
                const left = from[0]
                const bottom = from[2]
                boxRef.current.position.set(left - (width / 2), boxRef.current.position.y, bottom + (height / 2))
            } else {
                const left = from[0]
                const bottom = from[2]
                boxRef.current.position.set(left - (width / 2), boxRef.current.position.y, bottom - (height / 2))
            }
        }
        boxRef.current.scale.set(width, 0.01, height)
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
            _depth: boxRef.current.scale.z,
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
