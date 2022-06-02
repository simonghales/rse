import React, {useEffect, useMemo} from "react"
import {SelectionBox as SelectionBoxImpl, SelectionHelper} from "three-stdlib"
import {useThree} from "@react-three/fiber";

export const SelectionBox: React.FC = () => {

    const camera = useThree(({ camera }) => camera)
    const scene = useThree(({ scene }) => scene)
    const gl = useThree(({ gl }) => gl)

    const box = useMemo(() => {
        console.log('creating selection box???')
        return new SelectionBoxImpl(camera, scene)
    }, [camera, scene])

    useMemo(() => {
        return new SelectionHelper( box, gl, 'selectBox' );
    }, [gl])

    useEffect(() => {

        let isDown = false

        console.log('set it up...')

        const onPointerDown = (event: PointerEvent) => {

            isDown = true

            console.log('pointer down...', box.collection)

            for ( const item of box.collection ) {


                // @ts-ignore
                // item.material.emissive.set( 0x000000 );

            }

            box.startPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );
        }

        gl.domElement.addEventListener('pointerdown', onPointerDown)

        const onPointerMove = (event: PointerEvent) => {
            if (isDown) {

                for ( let i = 0; i < box.collection.length; i ++ ) {

                    // @ts-ignore
                    // box.collection[ i ].material.emissive.set( 0x000000 );

                }

                box.endPoint.set(
                    ( event.clientX / window.innerWidth ) * 2 - 1,
                    - ( event.clientY / window.innerHeight ) * 2 + 1,
                    0.5 );

                const allSelected = box.select();

                if (allSelected.length > 0) {
                    console.log('allSelected', allSelected)
                }

                for ( let i = 0; i < allSelected.length; i ++ ) {

                    // @ts-ignore
                    // allSelected[ i ].material.emissive.set( 0xffffff );

                }

            }
        }

        gl.domElement.addEventListener('pointermove', onPointerMove)

        const onPointerUp = (event: PointerEvent) => {

            isDown = false

            box.endPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );

            const allSelected = box.select();
            console.log('pointer up... allSelected', allSelected, box.collection)

            for ( let i = 0; i < allSelected.length; i ++ ) {

                // @ts-ignore
                // allSelected[ i ].material.emissive.set( 0xffffff );

            }
        }

        gl.domElement.addEventListener('pointerup', onPointerUp)

        return () => {

            gl.domElement.removeEventListener('pointerdown', onPointerDown)
            gl.domElement.removeEventListener('pointermove', onPointerMove)
            gl.domElement.removeEventListener('pointerup', onPointerUp)

        }

    }, [box, gl])

    return null
}
