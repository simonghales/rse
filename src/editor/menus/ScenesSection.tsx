import React, {useState} from "react"
import {StyledMediumHeader} from "../../ui/typography";
import styled from "styled-components";
import {useScenes} from "../state/editor";
import {setSelectedScene, useCurrentSceneId} from "../state/data";
import {FaPlus} from "react-icons/all";
import { StyledRoundButton } from "../../ui/buttons";
import {AddSceneModal} from "./AddSceneModal";

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-column-gap: 4px;
  padding-right: 8px;
`

const StyledInputWrapper = styled.div`

    select {
      display: block;
      width: 100%;
    }

`

const StyledHeader = styled(StyledMediumHeader)`
  padding-right: 2px;
`

export const ScenesSection: React.FC = () => {

    const currentScene = useCurrentSceneId()
    const scenes = useScenes()

    const [showAddModal, setShowAddModal] = useState(false)

    return (
        <>
            <StyledContainer>
                <StyledHeader>
                    <div>Scene</div>
                </StyledHeader>
                <StyledInputWrapper>
                    <select value={currentScene} onChange={event => {
                        setSelectedScene(event.target.value)
                    }}>
                        {
                            Object.entries(scenes).map(([id, data]) => (
                                <option value={id} key={id}>
                                    {data.name ?? id}
                                </option>
                            ))
                        }
                    </select>
                </StyledInputWrapper>
                <div>
                    <StyledRoundButton onClick={() => {
                        setShowAddModal(true)
                    }}>
                        <FaPlus/>
                    </StyledRoundButton>
                </div>
            </StyledContainer>
            {
                showAddModal && (
                    <AddSceneModal onClose={() => {
                        setShowAddModal(false)
                    }}/>
                )
            }
        </>
    )
}
