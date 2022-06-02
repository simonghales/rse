import styled, {css} from "styled-components";
import {THEME} from "./theme";

export const cssButtonReset = css`
  background: none;
  font: inherit;
  color: inherit;
  border: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
`

const cssEnabled = css`

  &:hover,
  &:focus {
    background-color: ${THEME.colors.purple};
    color: ${THEME.colors.white};
  }

`

const cssDisabled = css`

    cursor: default;
    opacity: 0.33;

`

const cssLargerIcon = css`
  font-size: 12px;
`

export const StyledRoundButton = styled.button<{
    disabled?: boolean,
    largerIcon?: boolean,
}>`
    ${cssButtonReset};
    font-size: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: ${THEME.colors.light};
  
    ${props => props.disabled ? cssDisabled : cssEnabled};
    ${props => props.largerIcon ? cssLargerIcon : ''};
    
`
