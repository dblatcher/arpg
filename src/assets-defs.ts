import { AssetData, GenericAssetMap } from "@dblatcher/sprite-canvas"
import miscPng from "./assets/misc.png"
import rangerIdle from "./assets/NES_Ranger_Idle_Sheet_4way.png"
import rangerWalk from "./assets/NES_Ranger_Walk_Sheet_4way.png"
import rangerRun from "./assets/NES_Ranger_Run_Sheet_4way.png"
import rangerAttack from "./assets/NES_Ranger_Attack_Sheet_4way.png"
import rangerHit from "./assets/NES_Ranger_Hit_Sheet_4way.png"
import tiles1 from "./assets/NES_Stonelands_Tile_Set_16x16_128x128_1.png"
import tiles2 from "./assets/NES_Stonelands_Tile_Set_16x16_128x128_2.png"

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
const RANGER_RUN: AssetData = {
    src: rangerRun,
    sprites: {
        cols: 4, rows: 4,
    }
}
const RANGER_ATTACK: AssetData = {
    src: rangerAttack,
    sprites: {
        cols: 4, rows: 4,
    }
}
const RANGER_HIT: AssetData = {
    src: rangerHit,
    sprites: {
        cols: 4, rows: 1,
    }
}

const TILES_1: AssetData = {
    src: tiles1,
    sprites: {
        cols: 8,
        rows: 8,
    }
}

const TILES_2: AssetData = {
    src: tiles2,
    sprites: {
        cols: 8,
        rows: 8,
    }
}

export const assetParams = {
    MISC, 
    RANGER_IDLE, RANGER_WALK, RANGER_RUN, RANGER_ATTACK, RANGER_HIT, 
    TILES_1, TILES_2
}

export type AssetKey = keyof typeof assetParams;
export type AssetMap = GenericAssetMap<AssetKey>;
