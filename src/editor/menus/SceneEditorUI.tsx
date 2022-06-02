import React from "react"
import styled from "styled-components";
import {SceneList} from "./SceneList";
import {AssetsSection} from "./AssetsSection";
import {cssDarkTheme, THEME} from "../../ui/theme";
import {redoData, undoData, useUndoRedoState} from "../state/data";
import {FaRedoAlt, FaUndoAlt} from "react-icons/all";
import {StyledRoundButton} from "../../ui/buttons";
import {ContextMenu} from "./ContextMenu";

const StyledContainer = styled.div`
  ${cssDarkTheme};
  height: 100%;
  width: 200px;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-row-gap: ${THEME.spacing.$2}px;
  padding-top: ${THEME.spacing.$2}px;
`

const StyledTopContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: flex-end;
  grid-column-gap: ${THEME.spacing.$0b}px;
  padding: 0 ${THEME.spacing.$2}px;
`

const TopOptions: React.FC = () => {

    const {
        canUndo,
        canRedo,
    } = useUndoRedoState()

    return (
        <StyledTopContainer>
            <StyledRoundButton onClick={undoData} disabled={!canUndo}>
                <FaUndoAlt/>
            </StyledRoundButton>
            <StyledRoundButton onClick={redoData} disabled={!canRedo}>
                <FaRedoAlt/>
            </StyledRoundButton>
        </StyledTopContainer>
    )

}

export const SceneEditorUI: React.FC = () => {
    return (
        <>
            <StyledContainer>
                <TopOptions/>
                <AssetsSection/>
                <SceneList/>
            </StyledContainer>
            <ContextMenu/>
        </>
    )
}
