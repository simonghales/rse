import React from "react"
import {useSnapshot} from "valtio";
import {
    clearEditorContextState,
    deleteSelectedInstances, disableSelectedInstances,
    editorContextStateProxy, enableSelectedInstances,
    groupSelectedInstances
} from "../state/editor";
import styled from "styled-components";
import {useDetectClickOutside} from "react-detect-click-outside";
import {cssDarkTheme, THEME} from "../../ui/theme";
import {deleteInstance} from "../state/data";

const StyledContainer = styled.div<{
    x: number,
    y: number,
}>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  z-index: ${THEME.zIndices.modal};
`

const StyledBody = styled.div`
  ${cssDarkTheme};
  border: 1px solid white;
  padding: ${THEME.spacing.$1}px ${THEME.spacing.$2}px;
  min-width: 180px;
`

const StyledList = styled.div`
  margin-left: ${-THEME.spacing.$2}px;
  margin-right: ${-THEME.spacing.$2}px;
`

const StyledOption = styled.div`
  cursor: pointer;
  font-size: ${THEME.fontSizes.small}px;
  padding: ${THEME.spacing.$1}px ${THEME.spacing.$2}px;
  
  &:hover,
  &:focus {
    background-color: ${THEME.colors.black};
  }
  
`

const Inner: React.FC = () => {

    const {
        selectedId,
        x,
        y,
        isSelected,
    } = useSnapshot(editorContextStateProxy)

    const closeDropdown = () => {
        clearEditorContextState()
    }

    const ref = useDetectClickOutside({ onTriggered: closeDropdown });

    const onDelete = () => {
        if (isSelected) {
            deleteSelectedInstances()
        } else {
            deleteInstance(selectedId)
        }
        closeDropdown()
    }

    const onGroup = () => {
        groupSelectedInstances()
        closeDropdown()
    }

    const onDisable = () => {
        disableSelectedInstances()
        closeDropdown()
    }

    const onEnable = () => {
        enableSelectedInstances()
        closeDropdown()
    }

    return (
        <StyledContainer x={x} y={y} ref={ref}>
            <StyledBody>
                <StyledList>
                    <StyledOption onClick={onDelete}>
                        Delete
                    </StyledOption>
                    <StyledOption onClick={onGroup}>
                        Group
                    </StyledOption>
                    <StyledOption onClick={onDisable}>
                        Disable
                    </StyledOption>
                    <StyledOption onClick={onEnable}>
                        Enable
                    </StyledOption>
                </StyledList>
            </StyledBody>
        </StyledContainer>
    )
}

export const ContextMenu: React.FC = () => {

    const {
        selectedId,
    } = useSnapshot(editorContextStateProxy)

    if (!selectedId) return null

    return <Inner/>
}
