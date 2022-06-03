import React from "react";
import {boxLikeAssetConfig, registerAsset, SceneEditor, SceneEditorControls} from "../../src";
import {Canvas} from "@react-three/fiber";
import { Box } from "@react-three/drei";
import styled from "styled-components";
import {GlobalStyle} from "./ui/global";
import {setInstancesData} from "../../src/editor/state/data";
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
    ...boxLikeAssetConfig,
    id: '_box',
    name: 'Box',
    component: BoxComponent,
})

setInstancesData(data)

export function App() {
    return (
        <>
            <GlobalStyle/>
            <SceneEditor>
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
