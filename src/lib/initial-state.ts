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

const tileMapLevel0 = stringToTileMap(tilesLevel0, MAP_WIDTH / TILE_SIZE, MAP_HEIGHT / TILE_SIZE)
const blockedTilesLevel0 = tileMapToObstacles(tileMapLevel0)

const tilesLevel1 = `
 ssssssssssssss
 ssssssssssssss
  
  
 r     wwwwww
 r     wwwwww
 r    wwwwwww
 r   wwww
 r         
 r     s s   
 r         
`;

const tileMapLevel1 = stringToTileMap(tilesLevel1, MAP_WIDTH / TILE_SIZE, MAP_HEIGHT / TILE_SIZE)
const blockedTilesLevel1 = tileMapToObstacles(tileMapLevel1)

export const makeInitalState = (): GameState => ({
    feedbackEvents: [],
    player: {
        id: -1,
        direction: 'Down',
        x: TILE_SIZE * 5, y: TILE_SIZE * 2,
        width: 40,
        height: 40,
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
            exits: [
                {
                    width: TILE_SIZE * 2,
                    height: TILE_SIZE * 1,
                    y: TILE_SIZE * 0,
                    x: TILE_SIZE * 4,
                    id: 'cave'
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
            obstacles: [
                ...blockedTilesLevel0
            ],
            tileMap: tileMapLevel0,
        },
        {
            exits: [],
            npcs: [],
            obstacles: [
                ...blockedTilesLevel1
            ],
            tileMap: tileMapLevel1
        }
    ],


    mapHeight: MAP_HEIGHT,
    mapWidth: MAP_WIDTH,
    cycleNumber: 0,
    paused: false,
})
