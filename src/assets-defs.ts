import { AssetData, GenericAssetMap } from "@dblatcher/sprite-canvas"
import miscPng from "./assets/misc.png"
import rangerIdle from "./assets/NES_Ranger_Idle_Sheet_4way.png"
import rangerWalk from "./assets/NES_Ranger_Walk_Sheet_4way.png"
import rangerRun from "./assets/NES_Ranger_Run_Sheet_4way.png"
import rangerAttack from "./assets/NES_Ranger_Attack_Sheet_4way.png"
import rangerHit from "./assets/NES_Ranger_Hit_Sheet_4way.png"
import tiles1 from "./assets/NES_Stonelands_Tile_Set_16x16_128x128_1.png"
import tiles2 from "./assets/NES_Stonelands_Tile_Set_16x16_128x128_2.png"
import centurionIdle from "./assets/centurion-purple/Idle_SpriteSheet.png"
import punisherIdle from "./assets/punisher/Idle_SpriteSheet.png"
import punisherWalk from "./assets/punisher/Walk_SpriteSheet.png"
import punisherRun from "./assets/punisher/Run_SpriteSheet.png"
import punisherHurt from "./assets/punisher/Hurt_SpriteSheet.png"
import punisherAttack from "./assets/punisher/Attack_SpriteSheet.png"

const buildAsset = (src: string, cols: number, rows: number, widthScale = 1, heightScale = 1): AssetData => ({ src, sprites: { cols, rows }, frameScale: { width: widthScale, height: heightScale } })

const MISC: AssetData = {
    src: miscPng,
    sprites: { cols: 3, rows: 4 }
}

const RANGER_FRAME_WIDTH_SCALE = 1.1

const RANGER_IDLE: AssetData = {
    src: rangerIdle,
    sprites: { cols: 4, rows: 4 },
    frameScale: { width: RANGER_FRAME_WIDTH_SCALE }
}
const RANGER_WALK: AssetData = {
    src: rangerWalk,
    sprites: { cols: 4, rows: 4 },
    frameScale: { width: RANGER_FRAME_WIDTH_SCALE },
}
const RANGER_RUN: AssetData = {
    src: rangerRun,
    sprites: { cols: 4, rows: 4 },
    frameScale: { width: RANGER_FRAME_WIDTH_SCALE },
}
const RANGER_ATTACK: AssetData = {
    src: rangerAttack,
    sprites: { cols: 4, rows: 4 },
    frameScale: { width: RANGER_FRAME_WIDTH_SCALE * 1.5 },

}
const RANGER_HIT: AssetData = {
    src: rangerHit,
    sprites: { cols: 4, rows: 1 },
    frameScale: { width: RANGER_FRAME_WIDTH_SCALE }
}

const TILES_1: AssetData = {
    src: tiles1,
    sprites: { cols: 8, rows: 8 }
}

const TILES_2: AssetData = {
    src: tiles2,
    sprites: { cols: 8, rows: 8 }
}

const CENTURION_IDLE = buildAsset(centurionIdle, 4, 4, 2, 1.25)

const PUNISHER_IDLE: AssetData = buildAsset(punisherIdle, 4, 4, 1.1, 1);
const PUNISHER_WALK: AssetData = buildAsset(punisherWalk, 4, 4, 1.1, 1);
const PUNISHER_RUN: AssetData = buildAsset(punisherRun, 4, 4, 1.1, 1);
const PUNISHER_ATTACK: AssetData = buildAsset(punisherAttack, 1, 4, 1.1, 1);
const PUNISHER_HURT: AssetData = buildAsset(punisherHurt, 1, 4, 1.1, 1);

export const assetParams = {
    MISC,
    RANGER_IDLE, RANGER_WALK, RANGER_RUN, RANGER_ATTACK, RANGER_HIT,
    TILES_1, TILES_2,
    CENTURION_IDLE,
    PUNISHER_IDLE, PUNISHER_WALK, PUNISHER_RUN, PUNISHER_HURT, PUNISHER_ATTACK
}

export type AssetKey = keyof typeof assetParams;
export type AssetMap = GenericAssetMap<AssetKey>;
