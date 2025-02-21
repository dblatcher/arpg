import { GameCharacter, GameState, Terrain, Tile, Traversability } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { stringToTileMap, tileMapToObstacles } from "./tile-maps";

let npcId = 1
const standardNpc = (x: number, y: number): GameCharacter => (
    {
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
    }
)

const MAP_WIDTH = 600
const MAP_HEIGHT = 600

const tilesLevel0 = `
 rssccsssffssss
 rssccsssffssss
 r     wwFFww
 rrrrr wwwwww
 r   r     
  ss rrrrrr
 sss      r   s
 sss      r   s
`;


const tilesLevel1 = `
sssssssssssssss
ssssssssssccsss
ssssssssssccsss
s            ss
s            ss
sr      wwwwwss
srrr   wwwwwwss
sr    wwwwwwwss
sr   wwww    ss
sr          sss
sss    s s  sss
sssssssssssssss
`;


const makeObstaclesAndTileMap = (tiles: string, defaultTile?: Tile) => {
    const tileMap = stringToTileMap(tiles, MAP_WIDTH / TILE_SIZE, MAP_HEIGHT / TILE_SIZE, defaultTile)
    const obstacles = tileMapToObstacles(tileMap)
    return {
        tileMap, obstacles
    }
}

export const makeInitalState = (): GameState => ({
    feedbackEvents: [],
    player: {
        id: -1,
        direction: 'Down',
        x: TILE_SIZE * 5, y: TILE_SIZE * 2,
        width: 39,
        height: 39,
        speed: 1.5,
        vector: {
            xd: 0, yd: 0
        },
        health: {
            max: 10,
            current: 10
        }
    },

    currentLevelIndex: 0,

    levels: [
        {
            id: 'first',
            exits: [
                {
                    width: TILE_SIZE * 2,
                    height: TILE_SIZE * 1,
                    y: TILE_SIZE * 0,
                    x: TILE_SIZE * 4,
                    destination: {
                        levelIndex: 1,
                        x: TILE_SIZE * 10.5,
                        y: TILE_SIZE * 3,
                    }
                }
            ],
            npcs: [
                standardNpc(20, 100),
                standardNpc(65, 100),
                standardNpc(100, 340),
                standardNpc(150, 440),
                standardNpc(150, 360),
                standardNpc(180, 280),
                standardNpc(265, 260),
                standardNpc(350, 360),
                standardNpc(300, 300),
                standardNpc(350, 440),
                standardNpc(550, 360),
                standardNpc(500, 300),
                standardNpc(550, 440),
            ],
            ...makeObstaclesAndTileMap(tilesLevel0)
        },
        {
            id: 'second',
            exits: [
                {
                    x: TILE_SIZE * 10,
                    y: TILE_SIZE * 1,
                    width: TILE_SIZE * 2,
                    height: TILE_SIZE * 1,
                    destination: {
                        levelIndex: 0,
                        x: TILE_SIZE * 4.5,
                        y: TILE_SIZE * 2,
                    }
                }
            ],
            npcs: [],
            ...makeObstaclesAndTileMap(tilesLevel1, {
                terrain: Terrain.MossyGround,
                traversability: Traversability.Open
            })
        }
    ],


    mapHeight: MAP_HEIGHT,
    mapWidth: MAP_WIDTH,
    cycleNumber: 0,
    paused: false,
})
