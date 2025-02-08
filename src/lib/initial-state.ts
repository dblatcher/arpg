import { GameCharacter, GameState } from "../game-state";
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

const tiles =
    `    ww
rr  r    ww
 r   r   FF
 rrrrrrrrrr
 r   r    r
  sss     r
 sss      r   s
`;

const MAP_WIDTH = 600
const MAP_HEIGHT = 600

const tileMap = stringToTileMap(tiles, MAP_WIDTH / TILE_SIZE, MAP_HEIGHT / TILE_SIZE)
const blockedTiles = tileMapToObstacles(tileMap)

export const makeInitalState = (): GameState => ({
    feedbackEvents: [],
    player: {
        id: -1,
        direction: 'Down',
        x: 300, y: 50,
        width: 40,
        height: 40,
        speed: 1,
        vector: {
            xd: 0, yd: 0
        },
        health: {
            max: 10,
            current: 10
        }
    },
    obstacles: [
        ...blockedTiles
    ],
    npcs: [
        standardNpc(20, 100),
        standardNpc(65, 100),
        standardNpc(265, 260),
        standardNpc(150, 280),
    ],
    mapHeight: MAP_HEIGHT,
    mapWidth: MAP_WIDTH,
    cycleNumber: 0,
    paused: false,
    tileMap,
})
