import {proxy, useSnapshot} from "valtio";

export const HOTKEYS = {
    COMMAND: [224, "OSLeft"],
    SHIFT: ["Shift", "ShiftRight", "ShiftLeft"],
}

export const isKeyPressed = (code: string | number, check: (string | number)[]) => {
    return check.includes(code)
}

export const hotkeysProxy = proxy({
    shiftPressed: false,
    commandPressed: false,
})

export const setShiftPressed = (pressed: boolean) => {
    hotkeysProxy.shiftPressed = pressed
}

export const setCommandPressed = (pressed: boolean) => {
    hotkeysProxy.commandPressed = pressed
}

export const useIsCommandPressed = () => {
    return useSnapshot(hotkeysProxy).commandPressed
}

export const useIsShiftPressed = () => {
    return useSnapshot(hotkeysProxy).shiftPressed
}

export const isCommandPressed = () => {
    return hotkeysProxy.commandPressed
}

export const isShiftPressed = () => {
    return hotkeysProxy.shiftPressed
}
