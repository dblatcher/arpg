import { AssetData, GenericAssetMap } from "@dblatcher/sprite-canvas"
import miscPng from "./assets/misc.png"

const MISC: AssetData = {
    src: miscPng,
    sprites: {
        cols: 3, rows: 4
    }
}

export const assetParams = {
    MISC,
}

export type AssetKey = keyof typeof assetParams;
export type AssetMap = GenericAssetMap<AssetKey>;
