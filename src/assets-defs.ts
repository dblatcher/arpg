import { AssetData, GenericAssetMap } from "@dblatcher/sprite-canvas"
import miscPng from "./assets/misc.png"
import rangerIdle from "./assets/NES_Ranger_Idle_Sheet_4way.png"
import rangerWalk from "./assets/NES_Ranger_Walk_Sheet_4way.png"

const MISC: AssetData = {
    src: miscPng,
    sprites: {
        cols: 3, rows: 4
    }
}

const RANGER_IDLE: AssetData = {
    src: rangerIdle,
    sprites: {
        cols: 4, rows: 4,
    }
}
const RANGER_WALK: AssetData = {
    src: rangerWalk,
    sprites: {
        cols: 4, rows: 4,
    }
}

export const assetParams = {
    MISC, RANGER_IDLE, RANGER_WALK
}

export type AssetKey = keyof typeof assetParams;
export type AssetMap = GenericAssetMap<AssetKey>;
