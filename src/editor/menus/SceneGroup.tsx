import React from "react"
import {
    GroupData,
    GroupDataKeys,
    InstanceData,
    InstanceDataKeys,
    updateGroupValue,
    updateInstanceValue
} from "../state/data";
import {InstanceListing, NameInput, StyledContainer, StyledIcon, useNameEdit} from "./InstanceListing";
import styled from "styled-components";
import {THEME} from "../../ui/theme";
import {
    deselectInstance,
    selectInstancesRange,
    setGroupExpanded,
    setSelectedInstance,
    startFreeViewMode, useIsGroupExpanded
} from "../state/editor";
import {isCommandPressed, isShiftPressed} from "../state/hotkeys";
import {
    FaCaretDown,
    FaCaretUp,
    FaCube,
    FaEye, FaEyeSlash,
    FaFolder,
    FaFolderOpen,
    FaLock,
    FaLockOpen,
    FaSave
} from "react-icons/fa";
import {cssButtonReset, StyledRoundButton} from "../../ui/buttons";

type ItemBase = {
    id: string,
}

type GroupItem = ItemBase & {
    type: 'group',
    data: GroupData,
    children?: Item[],
}

type InstanceItem = ItemBase & {
    type: 'instance',
    data: InstanceData,
}

export type Item = (InstanceItem | GroupItem) & {
    selected?: boolean,
    hovered?: boolean,
}

const StyledGroupChildren = styled.div`
  padding-left: ${THEME.spacing.$2}px;
`

const StyledGroupContainer = styled(StyledContainer)``

const StyledToggleIcon = styled.button`
  ${cssButtonReset};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  margin-left: 1px;
`

const StyledHeaderOptions = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
`

const StyledExtras = styled.div`
  justify-self: flex-end;
  align-self: center;
  height: 10px;
  display: flex;
  align-items: center;
`

export const SceneGroup: React.FC<{
    data: GroupItem,
    selected: boolean,
}> = ({data, selected}) => {

    const id = data.id

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

    const expanded = useIsGroupExpanded(id)

    const onToggle = () => {
        setGroupExpanded(id, !expanded)
    }

    const {
        editingName,
        onNameClick,
        finish,
    } = useNameEdit(selected)

    const name = data?.data?._name || 'Group'

    const hidden = data?.data?.[GroupDataKeys.hidden] ?? false
    const locked = data?.data?.[GroupDataKeys.locked] ?? false

    const onToggleVisibility = () => {
        updateGroupValue(id, {
            [GroupDataKeys.hidden]: !hidden,
        })
    }

    const onToggleLocked = () => {
        updateGroupValue(id, {
            [GroupDataKeys.locked]: !locked,
        })
    }

    return (
        <div>
            <StyledGroupContainer selected={selected} onClick={onClick}>
                <StyledIcon onClick={() => {
                    onToggle()
                }}>
                    {
                        expanded ? (
                            <FaFolderOpen/>
                        ) : (
                            <FaFolder/>
                        )
                    }
                </StyledIcon>
                <StyledHeaderOptions>
                    <div>
                        {
                            editingName ? (
                                <NameInput name={name} onComplete={(newName: string) => {
                                    updateGroupValue(id, {
                                        [GroupDataKeys.name]: newName,
                                    })
                                    finish()
                                }}/>
                            ) : (
                                <span onClick={onNameClick}>
                                {name}
                            </span>
                            )
                        }
                        <StyledToggleIcon onClick={() => {
                            onToggle()
                        }}>
                            {
                                expanded ? (
                                    <FaCaretDown/>
                                ) : (
                                    <FaCaretUp/>
                                )
                            }
                        </StyledToggleIcon>
                    </div>
                    <StyledExtras>
                        <StyledRoundButton onClick={onToggleVisibility}>
                            {
                                hidden ? (
                                    <FaEyeSlash size={11}/>
                                ) : (
                                    <FaEye size={11}/>
                                )
                            }
                        </StyledRoundButton>
                        <StyledRoundButton onClick={onToggleLocked}>
                            {
                                locked ? (
                                    <FaLock size={11}/>
                                ) : (
                                    <FaLockOpen size={11}/>
                                )
                            }
                        </StyledRoundButton>
                    </StyledExtras>
                </StyledHeaderOptions>
            </StyledGroupContainer>
            {
                expanded && (
                    <StyledGroupChildren>
                        <Group items={data.children ?? []}/>
                    </StyledGroupChildren>
                )
            }
        </div>
    )
}

export const GroupItem: React.FC<{
    item: Item,
}> = ({item}) => {
    if (item.type === 'instance') {
        return (
            <InstanceListing {...item.data} selected={item.selected ?? false} hovered={item.hovered ?? false} />
        )
    } else {
        return (
            <SceneGroup data={item} selected={item.selected ?? false}/>
        )
    }
}

export const Group: React.FC<{
    items: Item[],
}> = ({items}) => {
    return (
        <div>
            {
                items.map((item) => {
                    return (
                        <GroupItem item={item} key={item.id}/>
                    )
                })
            }
        </div>
    )
}
