import React, {useState} from "react"
import Modal from 'react-modal';
import {modalClassnames} from "../../ui/modal";
import styled from "styled-components";
import {cssDarkTheme} from "../../ui/theme";
import {addNewScene} from "../state/editor";

const StyledContainer = styled.div`
  ${cssDarkTheme};
  padding: 16px;
  min-width: 320px;
`

export const AddSceneModal: React.FC<{
    onClose: () => void,
}> = ({onClose}) => {

    const [name, setName] = useState('')

    const onSubmit = () => {

        addNewScene(name)

        onClose()
    }

    return (
        <Modal isOpen className={modalClassnames.base} overlayClassName={modalClassnames.overlay} onRequestClose={onClose}>
            <StyledContainer>
                <form onSubmit={event => {
                    event.preventDefault()
                    onSubmit()
                }}>
                    <header>
                        Create new scene
                    </header>
                    <div>
                        <input value={name} onChange={event => {
                            setName(event.target.value)
                        }} autoFocus type="text" placeholder="Scene name"/>
                    </div>
                    <div>
                        <button>Create</button>
                    </div>
                </form>
            </StyledContainer>
        </Modal>
    )
}
