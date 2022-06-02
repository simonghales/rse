import React from "react";
import {SceneEditor, SceneEditorControls} from "../../src";
import {Canvas} from "@react-three/fiber";
import { Box } from "@react-three/drei";
import styled from "styled-components";
import {GlobalStyle} from "./ui/global";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

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
