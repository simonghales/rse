import React from "react"
import {DEFAULT_POSITION} from "../state/data";
import {useVisualiserProps} from "./Visualiser";
import {InstanceData} from "../state/types";

export const Instance: React.FC<InstanceData & {
    selected: boolean,
    selectable: boolean,
    manualSelected: boolean,
    hovered: boolean,
    rangeSelected: boolean,
    component: any,
    hidden: boolean,
    groupProps: Record<string, any>,
}> = ({
          id,
                                 groupProps,
          selected,
            selectable,
          hovered,
          rangeSelected,
                                 manualSelected,
                                 hidden,
         component: Component,
    ...otherProps
      }) => {

    const {
        ref,
        onPointerUp,
        onPointerDown,
        onPointerOut,
        onPointerOver,
    } = useVisualiserProps(id, selected && !manualSelected, rangeSelected, hovered, selectable)

    const inner = (
        <group {...groupProps} ref={ref}
                onPointerUp={onPointerUp} onPointerDown={onPointerDown}
                onPointerOut={onPointerOut} onPointerOver={onPointerOver} visible={!hidden}>
            <Component id={id} manualSelected={manualSelected} {...otherProps}/>
        </group>
    )

    // if (portalRef) {
    //     return createPortal(inner, portalRef.current)
    // }

    return inner
}
