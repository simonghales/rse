import React from "react"
import styled from "styled-components";
import {AssetListing} from "./AssetListing";
import {StyledMediumHeader} from "../../ui/typography";
import {useSnapshot} from "valtio";
import {editorStateProxy} from "../state/editor";
import {useAssets} from "../state/assets";

const StyledContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  overflow-y: hidden;
  grid-row-gap: 4px;
  grid-template-rows: auto 1fr;
`

const StyledBody = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

export const AssetsSection: React.FC = () => {

    const selectedAsset = useSnapshot(editorStateProxy).selectedAsset
    const assets = useAssets()

    return (
        <StyledContainer>
            <StyledMediumHeader>
                <div>Assets</div>
            </StyledMediumHeader>
            <StyledBody>
                {
                    Object.entries(assets).map(([id, asset]) => (
                        <AssetListing id={asset.id} asset={asset} selected={asset.id === selectedAsset} key={asset.id}/>
                    ))
                }
            </StyledBody>
        </StyledContainer>
    )
}
