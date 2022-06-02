import {MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {BoxHelper, Object3D} from "three";
import {useHelper} from "@react-three/drei";
import {
    addSelectedInstanceRangeRef,
    clearHoveredInstance,
    isPendingSelect,
    setHoveredInstance,
    setPendingSelect,
    setSelectedInstance,
    setSelectedInstanceRef
} from "../state/editor";
import {isCommandPressed} from "../state/hotkeys";

export const useVisualiserProps = (
    id: string,
    selected: boolean,
    rangeSelected: boolean,
    sceneHovered: boolean,
    selectable: boolean,
    ref?: MutableRefObject<Object3D>) => {

    const localRef = useRef<Object3D>(null!)
    const [hovered, setHovered] = useState(false)

    ref = ref || localRef

    useHelper(ref, ((selected || hovered || rangeSelected || sceneHovered) && selectable) ? BoxHelper : null, (selected || rangeSelected) ? 'orange' : 'cyan')

    useLayoutEffect(() => {
        if (selected) {
            return setSelectedInstanceRef(id, ref as any)
        }
    }, [selected])

    useLayoutEffect(() => {
        if (rangeSelected) {
            return addSelectedInstanceRangeRef(id, ref as any)
        }
    }, [rangeSelected])

    const {
        onPointerUp,
        onPointerDown,
        onPointerOver,
        onPointerOut,
    } = useMemo(() => ({
        onPointerUp: (event: any) => {

            if (!selectable) return

            event.stopPropagation()

            if (isPendingSelect(id)) {
                setSelectedInstance(id, !isCommandPressed())
            }

        },
        onPointerDown: (event: any) => {

            if (!selectable) return

            event.stopPropagation()
            setPendingSelect(id)
        },
        onPointerOver: (event: any) => {

            if (!selectable) return

            event.stopPropagation()
            setHovered(true)
            setHoveredInstance(id)
        },
        onPointerOut: (event: any) => {
            // event.stopPropagation()
            setHovered(false)
            clearHoveredInstance(id)
        },
    }), [ref, selectable])

    return {
        ref,
        onPointerUp,
        onPointerDown,
        onPointerOver,
        onPointerOut,
    }


}
