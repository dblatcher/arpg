import { GameCharacter, Tile } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { stringToTileMap, tileMapToObstacles } from "../tile-maps"

export enum LEVEL_IDS {
    Caves = 'caves',
    Outside = 'first',
    Bridge = 'bridge',
}

let npcId = 1
export const standardNpc = (x: number, y: number): GameCharacter => (
    {
        altitude: 0,
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
        mind: {}
    }
)

export const makeObstaclesAndTileMap = (tiles: string, width: number, height: number, defaultTile?: Tile) => {
    const tileMap = stringToTileMap(tiles, width / TILE_SIZE, height / TILE_SIZE, defaultTile)
    const obstacles = tileMapToObstacles(tileMap)
    return {
        tileMap, obstacles
    }
}