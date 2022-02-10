import React from "react"
import styled from "styled-components";

const StyledContainer = styled.div`
  height: 100%;
  width: 200px;
  background-color: black;
  color: white;
`

export const SceneEditorUI: React.FC = () => {
    return (
        <StyledContainer>
            <div>
                TOP MENU ITEMS...
            </div>
            <div>
                LIST OF SCENE ITEMS...
            </div>
        </StyledContainer>
    )
}
