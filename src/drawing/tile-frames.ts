import { SpriteFrame } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";


const STONE_TOP_GRASS: SpriteFrame<AssetKey> = { key: 'TILES_3', fx: 3, fy: 4, }
const STONE_TOP_CAVE: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 2, fy: 4, }
const STONE: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 5, }
const GRASS: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 0, }
const ROAD: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 4, fy: 0, }
const WATER: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 6, fy: 2, }
const MOSSY_GROUND: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 6, fy: 5 }
const WOOD: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 2, fy: 7 }
const LADDER: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 5, fy: 6 }
const LADDER_TOP: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 4, fy: 5 }

const CAVE = {
    topLeft: { key: 'TILES_3', fx: 4, fy: 0 },
    topRight: { key: 'TILES_3', fx: 5, fy: 0 },
    bottomLeft: { key: 'TILES_3', fx: 6, fy: 1 },
    bottomRight: { key: 'TILES_3', fx: 7, fy: 1 },
} satisfies Record<string, SpriteFrame<AssetKey>>

const WATERFALL = [
    { key: 'TILES_3', fx: 7, fy: 0 },
    { key: 'TILES_3', fx: 1, fy: 2 },
    { key: 'TILES_3', fx: 2, fy: 3 },
    { key: 'TILES_2', fx: 5, fy: 5 },
] satisfies SpriteFrame<AssetKey>[];

const SPLASH = [
    { key: 'TILES_3', fx: 7, fy: 0 },
    { key: 'TILES_3', fx: 1, fy: 2 },
    { key: 'TILES_3', fx: 2, fy: 3 },
    { key: 'TILES_3', fx: 0, fy: 4 },
] satisfies SpriteFrame<AssetKey>[];

const DARK_WATER = [
    { key: 'TILES_3', fx: 0, fy: 2 },
    { key: 'TILES_3', fx: 1, fy: 1 },
] satisfies SpriteFrame<AssetKey>[];

const BRICKWALL: SpriteFrame<AssetKey> = { key: 'CASTLE_TILES', fx: 0, fy: 2 }
const WOOD_FLOOR: SpriteFrame<AssetKey> = { key: 'CASTLE_TILES', fx: 2, fy: 7 }

export {
    STONE, GRASS, ROAD, WATER, MOSSY_GROUND, CAVE, WATERFALL, SPLASH, WOOD, LADDER, BRICKWALL, WOOD_FLOOR, STONE_TOP_GRASS, STONE_TOP_CAVE, DARK_WATER,
    LADDER_TOP,
}
