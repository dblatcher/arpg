import { GameCharacter, Tile } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { stringToTileMap, tileMapToObstacles } from "../tile-maps"

export const MAP_WIDTH = 600
export const MAP_HEIGHT = 600

export enum LEVEL_IDS {
    Caves = 'caves',
    Outside = 'first',
    Tunnel = 'tunnel',
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
    }
)

export const makeObstaclesAndTileMap = (tiles: string, defaultTile?: Tile) => {
    const tileMap = stringToTileMap(tiles, MAP_WIDTH / TILE_SIZE, MAP_HEIGHT / TILE_SIZE, defaultTile)
    const obstacles = tileMapToObstacles(tileMap)
    return {
        tileMap, obstacles
    }
}