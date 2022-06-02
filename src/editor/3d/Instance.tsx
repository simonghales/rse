import React from "react"
import {DEFAULT_POSITION, InstanceData} from "../state/data";
import {useVisualiserProps} from "./Visualiser";

export const Instance: React.FC<InstanceData & {
    selected: boolean,
    selectable: boolean,
    hovered: boolean,
    rangeSelected: boolean,
    component: any,
    groupProps: Record<string, any>,
}> = ({
          id,
                                 groupProps,
          selected,
            selectable,
          hovered,
          rangeSelected,
         component: Component,
    ...otherProps
      }) => {

    const {
        ref,
        onPointerUp,
        onPointerDown,
        onPointerOut,
        onPointerOver,
    } = useVisualiserProps(id, selected, rangeSelected, hovered, selectable)

    const inner = (
        <group {...groupProps} ref={ref}
                onPointerUp={onPointerUp} onPointerDown={onPointerDown}
                onPointerOut={onPointerOut} onPointerOver={onPointerOver}>
            <Component {...otherProps}/>
        </group>
    )

    // if (portalRef) {
    //     return createPortal(inner, portalRef.current)
    // }

    return inner
}
