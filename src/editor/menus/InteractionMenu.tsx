import React from "react"
import styled, {css} from "styled-components";
import {THEME} from "../../ui/theme";
import {FiMove} from "react-icons/fi";
import {IoMdResize} from "react-icons/io";
import {AiOutlineRotateRight} from "react-icons/ai";
import {cssButtonReset} from "../../ui/buttons";
import {setTransformMode, TransformMode, useTransformMode} from "../state/editor";

const StyledContainer = styled.div`
  position: absolute;
  top: ${THEME.spacing.$2 - 1}px;
  left: ${THEME.spacing.$2 - 1}px;
  z-index: ${THEME.zIndices.overlay};
  display: grid;
  grid-auto-flow: column;
  background-color: ${THEME.colors.dark};
  border: 1px solid black;
`

const cssHighlighted = css`
  background-color: ${THEME.colors.purple};
  color: ${THEME.colors.white};
`

const StyledButton = styled.button<{
    highlighted?: boolean,
}>`
  ${cssButtonReset};
  color: ${THEME.colors.light};
  font-size: ${THEME.fontSizes.smallPlus}px;
  display: inline-flex;
  width: 22px;
  height: 22px;
  justify-content: center;
  align-items: center;
  ${props => props.highlighted ? cssHighlighted : ''};
`

export const InteractionMenu: React.FC = () => {
    const transformMode = useTransformMode()
    return (
        <StyledContainer>
            <StyledButton highlighted={transformMode === TransformMode.position} onClick={() => {
                setTransformMode(TransformMode.position)
            }}>
                <FiMove size={12}/>
            </StyledButton>
            <StyledButton highlighted={transformMode === TransformMode.rotation} onClick={() => {
                setTransformMode(TransformMode.rotation)
            }}>
                <AiOutlineRotateRight/>
            </StyledButton>
            <StyledButton highlighted={transformMode === TransformMode.scale} onClick={() => {
                setTransformMode(TransformMode.scale)
            }}>
                <IoMdResize size={12}/>
            </StyledButton>
        </StyledContainer>
    )
}
