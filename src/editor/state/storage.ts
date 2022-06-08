import {get} from "local-storage";
import {StoredData} from "./types";

export const storageKey = '_instancesData'

export const getInitialState = (): StoredData => {
    return get(storageKey) ?? {
        instances: {},
    }
}
