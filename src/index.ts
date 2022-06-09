import "./polyfills"
import { SceneEditor } from "./editor/SceneEditor";
import { SceneEditorControls } from "./editor/SceneEditorControls";
import { boxLikeAssetConfig } from "./editor/3d/assets/Box";
import { registerAsset } from "./editor/state/assets";
import { setInstancesData } from "./editor/state/data";
import {getSceneData, useSceneData } from "./live/SceneManager";
import { PolygonPreview } from "./editor/3d/assets/PolygonPreview";

export {
    SceneEditor,
    SceneEditorControls,
    boxLikeAssetConfig,
    registerAsset,
    setInstancesData,
    useSceneData,
    getSceneData,
    PolygonPreview,
}
