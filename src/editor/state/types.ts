export type InstanceData = {
    id: string,
    _type: string,
    _name?: string,
    _parent?: string,
    [key: string]: any,
}

export enum InstanceDataKeys {
    name = '_name',
    position = '_position',
    scale = '_scale',
    rotation = '_rotation',
}

export type GroupData = {
    children: string[],
    _name?: string,
    _parent?: string,
    _locked?: boolean,
    _hidden?: boolean,
}

export enum GroupDataKeys {
    name = '_name',
    locked = '_locked',
    hidden = '_hidden',
}

export type StoredData = {
    timestamp?: number,
    instances: Record<string, InstanceData>,
    groups?: Record<string, GroupData>,
}
