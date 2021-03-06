import React from "react"
import styled from "styled-components";
import {SceneList} from "./SceneList";
import {AssetsSection} from "./AssetsSection";
import {cssDarkTheme, THEME} from "../../ui/theme";
import {getSnapshot, redoData, storeSnapshot, undoData, useUndoRedoState} from "../state/data";
import {FaRedoAlt, FaUndoAlt, FaSave} from "react-icons/fa";
import {StyledRoundButton} from "../../ui/buttons";
import {ContextMenu} from "./ContextMenu";
import {ScenesSection} from "./ScenesSection";

const StyledContainer = styled.div`
  ${cssDarkTheme};
  height: 100%;
  width: 200px;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  grid-row-gap: ${THEME.spacing.$2}px;
  padding-top: ${THEME.spacing.$2}px;
`

const StyledTopContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-end;
  grid-column-gap: ${THEME.spacing.$0b}px;
  padding: 0 ${THEME.spacing.$2}px;
`

const TopOptions: React.FC = () => {

    const {
        canUndo,
        canRedo,
    } = useUndoRedoState()

    const copyData = () => {
        navigator.clipboard.writeText(JSON.stringify(getSnapshot())).then(function() {
            console.log('Async: Copying to clipboard was successful!');
            storeSnapshot()
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    return (
        <StyledTopContainer>
            <StyledRoundButton onClick={copyData} disabled={false}>
                <FaSave/>
            </StyledRoundButton>
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
                <ScenesSection/>
                <AssetsSection/>
                <SceneList/>
            </StyledContainer>
            <ContextMenu/>
        </>
    )
}
