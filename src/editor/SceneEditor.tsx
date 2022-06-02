import React from "react"
import {SceneEditorUI} from "./menus/SceneEditorUI";
import styled from "styled-components";
import {GlobalStyle} from "../ui/global";
import {HotkeysHandler} from "./HotkeysHandler";
import "./3d/assets/defaultAssets"
import {InteractionMenu} from "./menus/InteractionMenu";

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
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
            </style>
            <GlobalStyle/>
            <StyledContainer>
                <SceneEditorUI/>
                <StyledChildrenWrapper>
                    {children}
                    <InteractionMenu/>
                </StyledChildrenWrapper>
            </StyledContainer>
            <HotkeysHandler/>
        </>
    )
}
