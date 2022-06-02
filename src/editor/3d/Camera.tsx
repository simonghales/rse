import React, {useRef} from "react"
import {OrbitControls as OrbitControlsImpl} from "three-stdlib"
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {clearPendingSelect, miscState} from "../state/editor";
import {useIsCommandPressed} from "../state/hotkeys";

const Controls: React.FC = () => {

    const ref = useRef<OrbitControlsImpl>(null!)

    const localStateRef = useRef({
        moving: false,
    })

    const onStart = (event: any) => {
        localStateRef.current.moving = true
    }

    const onEnd = (event: any) => {
        localStateRef.current.moving = false
    }

    const onChange = () => {
        if (localStateRef.current.moving) {
            miscState.clearPendingDown()
            clearPendingSelect()
        }
    }

    const commandPressed = useIsCommandPressed()

    return (
        <OrbitControls mouseButtons={{
            LEFT: 2,
            RIGHT: 2,
            MIDDLE: 2,
        }} enablePan={false} enableRotate={commandPressed} onChange={onChange} onEnd={onEnd} onStart={onStart} makeDefault ref={ref} />
    )

}

export const Camera: React.FC = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, -5]} />
            <Controls/>
        </>
    )
}
