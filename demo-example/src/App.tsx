import React from "react";
import {
    boxLikeAssetConfig,
    PolygonPreview,
    registerAsset, SceneEditor, SceneEditorControls,
} from "../../src";
import {Canvas} from "@react-three/fiber";
import { Box, Sphere } from "@react-three/drei";
import styled from "styled-components";
import {GlobalStyle} from "./ui/global";
import data from "./data.json"

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const SphereComponent: React.FC = () => {

    return (
        <Sphere/>
    )

}

export const BoxComponent: React.FC = ({
                                           _width = 1,
                                           _depth = 1,
                                       }: any) => {
    return (
        <Box args={[_width, _depth, 1]} position={[0, 0, 0.5]}>
            <meshBasicMaterial color={"red"}/>
        </Box>
    )
    // return (
    //     <Box args={[_width, 1, _depth]} position={[0, 0.5, 0]}>
    //         <meshBasicMaterial color={"red"}/>
    //     </Box>
    // )
}

registerAsset({
    id: '_polygon',
    name: 'Polygon',
    component: PolygonPreview,
})

registerAsset({
    ...boxLikeAssetConfig,
    id: '_box',
    name: 'Box',
    component: BoxComponent,
})

registerAsset({
    id: '_sphere',
    name: 'Sphere',
    component: SphereComponent,
    inputs: {
        test: {
            key: 'test',
            label: 'Test',
            defaultValue: 'test',
            options: {
                options: [],
            }
        }
    }
})

// initManager('', data)

const scenes = {
    '': {
        name: 'Default',
        data,
    },
    '_second': {
        name: 'Second Scene',
    },
}

export function App() {

    return (
        <>
            <GlobalStyle/>
            <SceneEditor scenes={scenes}>
                <StyledContainer>
                    <Canvas>
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        {/*<Box/>*/}
                        <SceneEditorControls zAxisVertical/>
                    </Canvas>
                </StyledContainer>
            </SceneEditor>
        </>
    );
}
