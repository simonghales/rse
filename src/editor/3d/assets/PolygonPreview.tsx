import React, {useEffect, useMemo, useRef, useState} from "react"
import {Box, Line, Plane, Sphere} from "@react-three/drei";
import {Object3D, Shape} from "three";
import {enterManualMode, setEditorDragging} from "../../state/editor";
import {Vector3} from "three/src/math/Vector3";
import {updateInstanceValue} from "../../state/data";
import {snapshot} from "valtio";
import {ThreeEvent} from "@react-three/fiber";
import {useIsShiftPressed} from "../../state/hotkeys";
import {useHotkeys} from "react-hotkeys-hook";
import {useEffectRef} from "../../../utils/hooks";

type PolygonDataPoint = {
    x: number,
    y: number,
}

const extrudeSettings = {
    depth: 0.001,
};

const defaultPolygons: PolygonDataPoint[] = [
    {
        x: -1,
        y: 1,
    },
    {
        x: 1,
        y: 1,
    },
    {
        x: 1,
        y: -1,
    },
    {
        x: -1,
        y: -1,
    },
]

const DeleteListener: React.FC<{
    onDelete: () => void,
}> = ({onDelete}) => {

    const onDeleteRef = useEffectRef(onDelete)

    useHotkeys('del, backspace', (event) => {
        event.preventDefault()
        onDeleteRef.current()
    })

    return null
}

export const PolygonPreview: React.FC<{
    _position: any,
    _polygons: PolygonDataPoint[],
    manualSelected?: boolean,
    id: string,
}> = ({id, _position, _polygons , manualSelected = false}) => {

    const shiftHeld = useIsShiftPressed()

    const data: PolygonDataPoint[] = _polygons ?? defaultPolygons

    const shape = useMemo<Shape>(() => {
        const shape = new Shape()
        if (data.length === 0) {
            return shape
        }
        shape.moveTo(data[0].x, data[0].y)
        data.forEach((polygon, index) => {
            if (index === 0) return
            shape.lineTo(polygon.x, polygon.y)
        })
        shape.lineTo(data[0].x, data[0].y)
        return shape
    }, [data])

    const [hoveredHandle, setHoveredHandle] = useState('')

    const [selectedPolygon, setSelectedPolygon] = useState({
        id: '',
        index: -1,
    })

    const [localState] = useState({
        movingPolygonIndex: -1,
        movingPolygon: null as null | Object3D
    })

    const updateHandle = (point: Vector3, final: boolean = false) => {
        if (!localState.movingPolygon) return
        let x = shiftHeld ? Math.round(point.x) : point.x
        let y = shiftHeld ? Math.round(point.y) : point.y
        localState.movingPolygon.position.x = x - _position[0]
        localState.movingPolygon.position.y = y - _position[1]
        if (final) {
            const updatedPolygons = [...data]
            updatedPolygons[localState.movingPolygonIndex] = {
                x: localState.movingPolygon.position.x,
                y: localState.movingPolygon.position.y,
            }
            updateInstanceValue(id, {
                _polygons: updatedPolygons,
            })
        }
    }

    const [addPointActive, setAddPointActive] = useState(false)
    const [dragging, setDragging] = useState(false)

    const busy = addPointActive || dragging

    useEffect(() => {
        if (!busy) return
        setEditorDragging(true)
        return () => {
            setEditorDragging(false)
        }
    }, [busy])

    const lineVectors = useMemo<any[]>(() => {
        if (data.length <= 1) return []
        const dataVectors = data.map(point => {
            return [point.x, point.y, 0]
        })
        dataVectors.push(dataVectors[0])
        return dataVectors
    }, [data])

    const lines = useMemo(() => {
        const lines: any[] = []
        lineVectors.forEach((vector, index) => {
            if (index === lineVectors.length - 1) return
            lines.push([vector, lineVectors[index + 1]])
        })
        return lines
    }, [lineVectors])

    const newPointRef = useRef<Object3D>()

    const updateNewPointPosition = (point: Vector3) => {
        if (!newPointRef.current) return
        let x = shiftHeld ? Math.round(point.x) : point.x
        let y = shiftHeld ? Math.round(point.y) : point.y
        newPointRef.current.position.x = x - _position[0]
        newPointRef.current.position.y = y - _position[1]
    }

    const addNewPoint = (point: Vector3, event: ThreeEvent<PointerEvent>) => {
        const line = event.intersections.find(intersection => {
            return intersection.object?.userData?.type === 'segmentLine'
        })
        if (!line) return
        const lineIndex = line.object?.userData?.index ?? -1
        if (lineIndex < 0) return

        const updatedPolygons = [...data]
        const newPolygon = {
            x: point.x - _position[0],
            y: point.y - _position[1],
        }
        updatedPolygons.splice(lineIndex + 1, 0, newPolygon)
        updateInstanceValue(id, {
            _polygons: updatedPolygons,
        })
        setSelectedPolygon({
            id: '',
            index: lineIndex + 1,
        })
    }

    const onDelete = () => {
        if (selectedPolygon.index < 0) return
        const updatedPolygons = [...data]
        updatedPolygons.splice(selectedPolygon.index, 1)
        updateInstanceValue(id, {
            _polygons: updatedPolygons,
        })
    }

    return (
        <>
            {
                manualSelected && (
                    <DeleteListener onDelete={onDelete}/>
                )
            }
            <mesh onDoubleClick={(event) => {
                event.stopPropagation()
                enterManualMode()
            }}>
                <extrudeBufferGeometry args={[shape, extrudeSettings]}/>
                <meshBasicMaterial color={'cyan'} transparent opacity={0.2}/>
            </mesh>
            {
                manualSelected && (
                    <>
                        {
                            data.map((point, index) => {
                                const id = `${point.x}:${point.y}`
                                const selected = selectedPolygon.index === index
                                const hovered = id === hoveredHandle
                                return (
                                    <Sphere onPointerDown={(event) => {
                                        event.stopPropagation()
                                        setDragging(true)
                                        setSelectedPolygon({
                                            id,
                                            index,
                                        })
                                        localState.movingPolygonIndex = index
                                        localState.movingPolygon = event.object
                                    }} onPointerOver={() => {
                                        setHoveredHandle(id)
                                    }} onPointerOut={() => {
                                        setHoveredHandle('')
                                    }} args={[0.2]} position={[point.x, point.y, 0]} key={id}>
                                        <meshBasicMaterial color={selected ? 'red' : hovered ? 'orange' : 'grey'} transparent opacity={0.5} depthTest={false} depthWrite={false}/>
                                    </Sphere>
                                )
                            })
                        }
                        {
                            lines.map((line, index) => (
                                <Line color={'green'} userData={{
                                    type: 'segmentLine',
                                    index,
                                }} points={line} lineWidth={5} onPointerOver={(event) => {
                                    setAddPointActive(true)
                                    updateNewPointPosition((event as any).point)
                                }} onPointerOut={(event) => {
                                    setAddPointActive(false)
                                    updateNewPointPosition((event as any).point)
                                }} onPointerMove={(event) => {
                                    updateNewPointPosition((event as any).point)
                                }} onPointerUp={(event) => {
                                    if (!(addPointActive && !hoveredHandle)) {
                                        return
                                    }
                                    event.stopPropagation()
                                    addNewPoint((event as any).point, event)
                                }} key={index} depthTest={false} depthWrite={false}/>
                            ))
                        }
                        <Sphere ref={newPointRef} args={[0.3]} visible={(addPointActive && !hoveredHandle)}>
                            <meshBasicMaterial color={'purple'} depthWrite={false} depthTest={false}/>
                        </Sphere>
                        <Plane visible={false} scale={[512, 512, 1]} onPointerMove={(event) => {
                            if (localState.movingPolygonIndex < 0) {
                                return
                            }
                            updateHandle(event.point)
                        }} onPointerUp={(event) => {
                            event.stopPropagation()
                            setDragging(false)
                            if (localState.movingPolygonIndex < 0) {
                                if (addPointActive && !hoveredHandle) {
                                    addNewPoint(event.point, event)
                                    return
                                }
                                return
                            }
                            updateHandle(event.point, true)
                            localState.movingPolygonIndex = -1
                            localState.movingPolygon = null
                        }}>

                        </Plane>
                    </>
                )
            }
        </>
    )
}
