import React, {useLayoutEffect} from "react"
import {SceneEditorUI} from "./menus/SceneEditorUI";
import styled from "styled-components";
import {GlobalStyle} from "../ui/global";
import {HotkeysHandler} from "./HotkeysHandler";
import "./3d/assets/defaultAssets"
import {InteractionMenu} from "./menus/InteractionMenu";
import {Manager} from "./state/Manager";
import {ingestScenesData, initManager, ScenesData} from "./state/data";
import {getEditorStorage} from "./state/storage";

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

export type SceneEditorBaseProps = {
    children: any,
    defaultSceneId?: string,
    scenes?: ScenesData,
}

export const SceneEditor: React.FC<SceneEditorBaseProps> = ({children, defaultSceneId, scenes}) => {

    useLayoutEffect(() => {
        const data = getEditorStorage()
        const sceneId = defaultSceneId ?? data?.selectedSceneId ?? ''
        initManager(sceneId, scenes)
    }, [])

    useLayoutEffect(() => {
        if (!scenes) return
        ingestScenesData(scenes)
    }, [scenes])

    return (
        <Manager isParent>
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
        </Manager>
    )
}
