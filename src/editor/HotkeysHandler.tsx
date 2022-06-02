import React, {useEffect} from "react"
import hotkeys from "hotkeys-js";
import {HOTKEYS, isKeyPressed, setCommandPressed, setShiftPressed} from "./state/hotkeys";

export const HotkeysHandler: React.FC = () => {

    useEffect(() => {

        hotkeys('*', {
            keydown: true,
            keyup: true,
        }, (event) => {

            // console.log('event', event)

            const keydown = event.type === "keydown"

            if (isKeyPressed(event.code, HOTKEYS.COMMAND)) {
                setCommandPressed(keydown)
            } else if (isKeyPressed(event.code, HOTKEYS.SHIFT)) {
                setShiftPressed(keydown)
            }

        })

    }, [])

    return null
}
