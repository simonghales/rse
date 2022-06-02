import React, {useEffect, useRef, useState} from "react"
import styled, {css} from "styled-components";
import {THEME} from "../../ui/theme";
import {FaCube} from "react-icons/fa";
import {
    clearHoveredInstance, deselectInstance, hasSelectedInstance, selectInstancesRange,
    setEditorContextSelectedId,
    setHoveredInstance,
    setSelectedInstance, startFreeViewMode
} from "../state/editor";
import {InstanceData, InstanceDataKeys, updateInstanceValue} from "../state/data";
import {isCommandPressed, isShiftPressed} from "../state/hotkeys";

const cssSelected = css`
  background-color: ${THEME.colors.active};
  color: ${THEME.colors.white};

  svg {
    color: ${THEME.colors.nearWhite};
  }
  
`

const cssHovered = css`
  background-color: ${THEME.colors.black};
  color: ${THEME.colors.white};
  
  svg {
    color: ${THEME.colors.nearWhite};
  }
  
`

const cssInteractive = css`
  
  &:hover,
  &:focus {
    ${cssHovered};
  }
  
`

export const StyledContainer = styled.div<{
    selected: boolean,
    hovered?: boolean,
}>`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: ${THEME.spacing.$1b}px;
  padding: ${THEME.spacing.$1b}px ${THEME.spacing.$2}px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  min-height: 24px;
  
  svg {
    color: ${THEME.colors.faint};
    font-size: 0.8em;
  }
  
  ${props => props.hovered ? cssHovered : ''};
  ${props => props.selected ? cssSelected : cssInteractive};
`

export const StyledIcon = styled.div`
`

export const useDraggable = () => {

    const localStateRef = useRef({
        pointerDown: null as null | [number, number],
    })
    const [dragging, setDragging] = useState(false)

    const onPointerDown = (event: any) => {
        localStateRef.current.pointerDown = [event.clientX, event.clientY]
    }

    const onPointerUp = () => {
        localStateRef.current.pointerDown = null
        setDragging(false)
    }

    const onPointerOut = () => {
        if (localStateRef.current.pointerDown) {
            setDragging(true)
        }
        localStateRef.current.pointerDown = null
    }

    return {
        onPointerDown,
        onPointerUp,
        onPointerOut,
    }

}

const StyledName = styled.div`

    span {
      padding-right: ${THEME.spacing.$0b}px;
    }

`

const StyledForm = styled.form`
  display: inline-block;
`

const StyledInput = styled.input`
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  display: inline-block;
`

export const NameInput: React.FC<{
    name: string,
    onComplete: (updatedName: string) => void,
}> = ({name, onComplete}) => {

    const [value, setValue] = useState(name)
    const inputRef = useRef<any>()

    useEffect(() => {
        inputRef.current.focus()
        inputRef.current.select()
    }, [])

    return (
        <StyledForm onSubmit={event => {
            event.preventDefault()
            onComplete(value)
        }}>
            <StyledInput ref={inputRef} value={value} onChange={event => {
                setValue(event.target.value)
            }} type={"text"} onBlur={() => {
                onComplete(value)
            }}/>
        </StyledForm>
    )
}

export const useNameEdit = (selected: boolean) => {
    const [editingName, setEditingName] = useState(false)

    const onNameClick = () => {
        if (!selected) return
        setEditingName(true)
    }

    const finish = () => {
        setEditingName(false)
    }

    return {
        editingName,
        onNameClick,
        finish,
    }

}

export const InstanceListing: React.FC<InstanceData & {
    selected: boolean,
    hovered: boolean,
}> = ({id, selected, hovered, _name}) => {

    const onClick = () => {

        startFreeViewMode()

        if (isShiftPressed()) {
            selectInstancesRange(id)
        } else {
            if (isCommandPressed() && selected) {
                deselectInstance(id)
            } else {
                setSelectedInstance(id, !isCommandPressed())
            }
        }
    }

    const onPointerOver = () => {
        setHoveredInstance(id)
    }

    const {
        onPointerDown,
        onPointerOut: dragOnPointerOut,
        onPointerUp,
    } = useDraggable()

    const onPointerOut = () => {
        clearHoveredInstance(id)
        dragOnPointerOut()
    }

    const onContextMenu = (event: any) => {
        event.preventDefault()
        setEditorContextSelectedId(id, event.clientX, event.clientY, selected)
    }

    const {
        editingName,
        onNameClick,
        finish,
    } = useNameEdit(selected)

    const name = _name || 'Object'

    return (
        <StyledContainer selected={selected} hovered={hovered}
                         onPointerDown={onPointerDown}
                         onPointerUp={onPointerUp}
                         onPointerOver={onPointerOver}
                         onPointerOut={onPointerOut} onClick={onClick} onContextMenu={onContextMenu}>
            <StyledIcon>
                <FaCube/>
            </StyledIcon>
            <StyledName>
                {
                    editingName ? (
                        <NameInput name={name} onComplete={(newName: string) => {
                            updateInstanceValue(id, {
                                [InstanceDataKeys.name]: newName,
                            })
                            finish()
                        }}/>
                    ) : (
                        <span onClick={onNameClick}>
                            {name}
                        </span>
                    )
                }
            </StyledName>
        </StyledContainer>
    )
}
