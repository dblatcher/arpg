import { GameCharacter, GameState } from "../game-state";
import { stringToTileMap, tileMapToObstacles } from "./tile-maps";

const standardNpc = (x: number, y: number): GameCharacter => (
    {
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
    `
rr  r
 r   r
 rrrrrrrrrr
 r   r    r
  sss     r
 sss      r   s
`;

const tileMap = stringToTileMap(tiles)
const blockedTiles = tileMapToObstacles(tileMap)

export const makeInitalState = (): GameState => ({
    feedbackEvents: [],
    player: {
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
    mapHeight: 600,
    mapWidth: 600,
    cycleNumber: 0,
    paused: false,
    tileMap,
})
