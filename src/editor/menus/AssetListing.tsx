import React from "react"
import styled from "styled-components";
import {StyledContainer as StyledContainer_Instance} from "./InstanceListing"
import {FaCube, FaPlusCircle, FaTimes} from "react-icons/fa";
import {clearSelectedAsset, setSelectedAsset, startPlaceMode} from "../state/editor";
import {StyledRoundButton} from "../../ui/buttons";
import {AssetConfig} from "../state/assets";

const StyledContainer = styled(StyledContainer_Instance)`
  grid-template-columns: auto 1fr auto;
  padding-top: 0;
  padding-bottom: 0;
  min-height: 24px;
`

export const AssetListing: React.FC<{
    id: string,
    asset: AssetConfig,
    selected: boolean,
}> = ({id, asset, selected}) => {
    return (
        <StyledContainer onClick={() => {
            setSelectedAsset(id)
            startPlaceMode()
        }} hovered={false} selected={selected}>
            <div>
                <FaCube/>
            </div>
            <div>
                {asset.name}
            </div>
            <div>
                {
                    selected && (
                        <StyledRoundButton largerIcon onClick={(event) => {
                            event.stopPropagation()
                            clearSelectedAsset()
                        }}>
                            <FaTimes/>
                        </StyledRoundButton>
                    )
                }
                {/*<FaPlusCircle/>*/}
            </div>
        </StyledContainer>
    )
}
