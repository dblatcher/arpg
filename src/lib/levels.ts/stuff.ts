import { CharacterSpriteKey, CharacterState, EntityType, GameCharacter, Scenery, SceneryCondition, Tile, Traversability } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { stringToTileMap, tileMapToObstacles } from "../tile-maps"

export enum LEVEL_IDS {
    Caves = 'caves',
    Outside = 'first',
    Bridge = 'bridge',
    House = 'house',
}

let npcId = 1;
let sceneryId = 1;
export const standardNpc = (
    x: number,
    y: number,
    mind: CharacterState = {},
    filter?: string,
    spriteKey: CharacterSpriteKey = 'punisher'
): GameCharacter => (
    {
        type: EntityType.NPC,
        altitude: 0,
        spriteKey,
        spriteFilter: filter,
        id: npcId++,
        direction: 'Down',
        x, y,
        width: 40,
        height: 40,
        speed: .75,
        vector: {
            xd: 0, yd: 0
        },
        health: {
            max: 3,
            current: 3,
        },
        pointsForKilling: 25,
        mind,
        drawFlat: undefined,
    }
)

export const safeNpc = (
    x: number,
    y: number,
    mind: CharacterState = {},
    filter?: string,
    spriteKey: CharacterSpriteKey = 'punisher'
) => {
    return { ...standardNpc(x, y, mind, filter, spriteKey), safe: true }
}

export const makeTraversabilityMap = (traversabilityForAll: Traversability) => ({
    [SceneryCondition.Base]: traversabilityForAll,
    [SceneryCondition.Active]: traversabilityForAll,
})

export const makeScenery = (input: Partial<Scenery> & Pick<Scenery, 'spriteKey' | 'x' | 'y'>): Scenery => {
    return {
        id: sceneryId++,
        condition: SceneryCondition.Base,
        type: EntityType.Scenery,
        width: TILE_SIZE * 1,
        height: TILE_SIZE * 1,
        traversabilityMap: makeTraversabilityMap(Traversability.Blocking),
        ...input
    };
}

export const makeHouseAt = (x: number, y: number): Scenery => makeScenery({
    spriteKey: 'house',
    x: x - (TILE_SIZE * .5),
    y: y - (TILE_SIZE * 1.25),
    width: TILE_SIZE * 5,
    height: TILE_SIZE * 5.5,
    traversabilityMap: makeTraversabilityMap(Traversability.Open),
})

export const makeBigHouseAt = (x: number, y: number): Scenery => makeScenery({
    spriteKey: 'bigHouse',
    x: x - (TILE_SIZE * .75),
    y: y - (TILE_SIZE * 1.5),
    width: TILE_SIZE * 7,
    height: TILE_SIZE * 5.75,
    traversabilityMap: makeTraversabilityMap(Traversability.Open),
})

export const makeObstaclesAndTileMap = (tiles: string, width: number, height: number, defaultTile?: Tile) => {
    const tileMap = stringToTileMap(tiles, width / TILE_SIZE, height / TILE_SIZE, defaultTile)
    const tileObstacles = tileMapToObstacles(tileMap)
    return {
        tileMap, tileObstacles
    }
}