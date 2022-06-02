import React, {MutableRefObject, useLayoutEffect, useRef} from "react"
import {useSnapshot} from "valtio";
import {editorStateProxy, setSelectedInstanceRangeUnsub} from "../state/editor";
import {BoxHelper, Object3D} from "three";
import {useHelper} from "@react-three/drei";

const InstanceHandler: React.FC<{
    id: string,
    groupRef: MutableRefObject<Object3D>,
    instanceRef: MutableRefObject<Object3D>,
}> = ({id, instanceRef, groupRef}) => {

    useLayoutEffect(() => {
        if (!instanceRef.current) return
        if (!groupRef.current) return
        const element = instanceRef.current
        const parent = instanceRef.current.parent
        parent?.remove(instanceRef.current)
        groupRef.current.add(instanceRef.current)

        let removed = false

        const removeElement = () => {
            removed = true
            if (!element) {
                return
            }
            groupRef.current.remove(element)
            if (parent) {
                parent.add(element)
            }
        }

        const unsub = setSelectedInstanceRangeUnsub(id, () => {
            removeElement()
        })

        return () => {
            if (!removed) {
                removeElement()
            }
            unsub()
        }
    }, [id, instanceRef, groupRef])

    return null
}

export const SelectedInstancesRangeHandler: React.FC = () => {

    const groupRef = useRef<Object3D>(null!)

    const selectedInstancesRangeRefs = useSnapshot(editorStateProxy.selectedInstancesRangeRefs)

    const selectedInstances = Object.keys(selectedInstancesRangeRefs).length > 0

    useHelper(groupRef, (selectedInstances) ? BoxHelper : null, 'orange')

    return (
        <>
            <group ref={groupRef}/>
            {
                Object.entries(selectedInstancesRangeRefs).map(([id, instanceRef]) => (
                    <InstanceHandler id={id} groupRef={groupRef} instanceRef={instanceRef as any} key={id}/>
                ))
            }
        </>
    )
}
