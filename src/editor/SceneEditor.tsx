import React from "react"
import {SceneEditorUI} from "./SceneEditorUI";
import styled from "styled-components";
import {GlobalStyle} from "../ui/global";

const StyledContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: auto 1fr;
`

const StyledChildrenWrapper = styled.div`
  height: 100%;
  position: relative;
`

export const SceneEditor: React.FC = ({children}) => {
    return (
        <>
            <GlobalStyle/>
            <StyledContainer>
                <SceneEditorUI/>
                <StyledChildrenWrapper>
                    {children}
                </StyledChildrenWrapper>
            </StyledContainer>
        </>
    )
}
