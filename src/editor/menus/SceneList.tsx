import React, {useMemo} from "react"
import styled from "styled-components";
import {THEME} from "../../ui/theme";
import {StyledMediumHeader} from "../../ui/typography";
import {useSnapshot} from "valtio";
import {GroupData, InstanceData, instancesDataProxy} from "../state/data";
import {editorStateProxy, sortInstances, useSelectedInstances} from "../state/editor";
import {Group, Item} from "./SceneGroup";

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: hidden;
  grid-row-gap: ${THEME.spacing.$1}px;
`

const StyledBody = styled.div`
  overflow-y: auto;
  padding-bottom: ${THEME.spacing.$2}px;
  display: flex;
  flex-direction: column;
`

export const SceneList: React.FC = () => {

    const data = useSnapshot(instancesDataProxy).value.instances

    const hoveredInstance = useSnapshot(editorStateProxy).hoveredInstance

    const {
        selectedInstance,
        selectedInstancesRange,
    } = useSelectedInstances()

    const groups = useSnapshot(instancesDataProxy.value).groups ?? {}

    // const instances = useMemo(() => {
    //     return Object.entries(data).map(([id, instance]) => (
    //         <InstanceListing {...instance as InstanceData} selected={selectedInstance === id || selectedInstancesRange.includes(id)} hovered={hoveredInstance === id} key={id}/>
    //     ))
    // }, [data, selectedInstance, hoveredInstance, selectedInstancesRange])

    const items = useMemo(() => {

        const grouped: Record<string, Item[]> = {}

        Object.entries(data).forEach(([id, instance]) => {
            const selected = selectedInstance === id || selectedInstancesRange.includes(id)
            const hovered = hoveredInstance === id
            let parent = instance._parent ?? ''
            if (!groups[parent]) {
                parent = ''
            }
            if (!grouped[parent]) {
                grouped[parent] = []
            }
            grouped[parent].push({
                id,
                type: 'instance',
                data: instance as InstanceData,
                selected,
                hovered,
            })
        })

        Object.entries(groups).forEach(([id, group]) => {
            const selected = selectedInstance === id || selectedInstancesRange.includes(id)
            let parent = group._parent ?? ''
            if (!groups[parent]) {
                parent = ''
            }
            if (!grouped[parent]) {
                grouped[parent] = []
            }
            grouped[parent].push({
                id,
                type: 'group',
                data: group as GroupData,
                selected,
            })
        })

        const root = grouped[''] ?? []

        const order = sortInstances(data as any, groups as any)

        const mapChildren = (child: Item): Item => {
            if (child.type === 'group') {
                const children = grouped[child.id] ?? []
                return {
                    ...child,
                    children: children.sort((childA, childB) => {
                        return order.indexOf(childA.id) - order.indexOf(childB.id)
                    }).map(mapChildren),
                }
            } else {
                return child
            }
        }

        const items = root.map(mapChildren).sort((childA, childB) => {
            return order.indexOf(childA.id) - order.indexOf(childB.id)
        })

        return items
    }, [data, groups, hoveredInstance, selectedInstance, selectedInstancesRange])

    return (
        <StyledContainer>
            <StyledMediumHeader>
                Scene
            </StyledMediumHeader>
            <StyledBody>
                <Group items={items}/>
            </StyledBody>
        </StyledContainer>
    )
}
