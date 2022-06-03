import React, {MutableRefObject, useEffect, useMemo, useRef} from "react"
import {Object3D, Vector3} from "three";
import {TransformControls} from "@react-three/drei";
import {miscState, setIsDragging, TransformMode, updateLastDragged, useTransformMode} from "../state/editor";
import {
    deleteInstance,
    duplicateInstance,
    updateInstancePosition,
    updateInstanceRotation,
    updateInstanceScale
} from "../state/data";
import {useEffectRef} from "../../utils/hooks";
import {radToDeg} from "three/src/math/MathUtils";
import {useIsShiftPressed} from "../state/hotkeys";
import useKeypress from 'react-use-keypress';
import {useHotkeys} from "react-hotkeys-hook";

const v3 = new Vector3()

export const SelectedInstanceHandler: React.FC<{
    id: string,
    objRef: MutableRefObject<Object3D>,
}> = ({id, objRef}) => {

    const shiftHeld = useIsShiftPressed()

    const transformRef = useRef<any>()

    const object = useMemo(() => {
        return objRef.current
    }, [objRef])

    const transformMode = useTransformMode()

    const mode = transformMode === TransformMode.rotation ? "rotate" : transformMode === TransformMode.scale ? "scale" : "translate"

    const onDragEnd = () => {
        console.log('onDragEnd', mode)
        if (mode === "translate") {
            objRef.current.getWorldPosition(v3)
            updateInstancePosition(id, v3.x, v3.y, v3.z)
        } else if (mode === "rotate") {
            updateInstanceRotation(id, radToDeg(objRef.current.rotation.x), radToDeg(objRef.current.rotation.y), radToDeg(objRef.current.rotation.z))
        } else if (mode === "scale") {
            updateInstanceScale(id, objRef.current.scale.x, objRef.current.scale.y, objRef.current.scale.z)
        }
        updateLastDragged()
        setIsDragging(false)
    }

    const onDragBegin = () => {
        setIsDragging(true)
    }

    const onDragEndRef = useEffectRef(onDragEnd)

    const onDragBeginRef = useEffectRef(onDragBegin)

    useEffect(() => {
        const transformControls = transformRef.current
        transformControls.addEventListener('dragging-changed', function (event: any) {
            miscState.clearPendingDown()
            if (!event.value) {
                onDragEndRef.current()
            } else {
                onDragBeginRef.current()
            }
        })
        return () => {
            transformControls.removeEventListener('dragging-changed')
            transformControls.enabled = false
            transformControls.dispose()
            transformControls.detach()
        }
        // const remove = setTransformControlsRef(transformRef)
        // return () => {
        //     remove()
        //     setEditorSelectedInstanceDragging(id, false)
        //     transformControls.removeEventListener('dragging-changed')
        //     transformControls.enabled = false
        //     transformControls.dispose()
        //     transformControls.detach()
        //     console.log('unmounting...')
        // }
    }, [])

    useEffect(() => {
        const transformControls = transformRef.current
        if (!transformControls) return
        transformControls.attach(object)
        return () => {
            transformControls.detach(object)
        }
    }, [object])

    useHotkeys('ctrl+d, cmd+d', (event) => {
        event.preventDefault()
        duplicateInstance(id)
    })

    useHotkeys('ctrl+del, cmd+del, ctrl+backspace, cmd+backspace', (event) => {
        event.preventDefault()
        deleteInstance(id)
    })

    useEffect(() => {
        if (!transformRef.current) return
        transformRef.current.translationSnap = shiftHeld ? 1 : null
    }, [shiftHeld])

    return (
        <TransformControls ref={transformRef} object={object} mode={mode}>
            <></>
        </TransformControls>
    )
}
