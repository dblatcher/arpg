import { GameState, Space } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { caveLevel } from "./levels.ts/cave";
import { overlandLevel } from "./levels.ts/overland";
import { MAP_HEIGHT, MAP_WIDTH, standardNpc } from "./levels.ts/stuff";


const makePlatform = (x: number, y: number): Space => ({ 
    x: x * TILE_SIZE, 
    y: y * TILE_SIZE, 
    width: TILE_SIZE, 
    height: TILE_SIZE/2 })

export const makeInitalState = (): GameState => ({
    score: 0,
    feedbackEvents: [],
    player: {
        id: -1,
        direction: 'Down',
        // x: TILE_SIZE * 5, y: TILE_SIZE * 2,
        x: TILE_SIZE * 9.2, y: TILE_SIZE*4,
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
            id: 'castle',
            levelType: 'platform',
            npcs: [
                standardNpc(TILE_SIZE*5,50)
            ],
            platforms: [
                makePlatform(0, 0),
                makePlatform(0, 5),
                makePlatform(7, 8),
                makePlatform(8, 9),
                makePlatform(9, 9),
                makePlatform(9.1, 6.8),
                makePlatform(10.1, 7.0),
                makePlatform(11, 9),
                makePlatform(0, 10),
                makePlatform(2, 10),
                makePlatform(4, 10),
                makePlatform(5, 10),
                makePlatform(6, 10),
                makePlatform(4, 12),
                makePlatform(0, 14),
                makePlatform(3, 14),
            ]
        },
        overlandLevel(),
        caveLevel(),
    ],

    mapHeight: MAP_HEIGHT,
    mapWidth: MAP_WIDTH,
    cycleNumber: 0,
    paused: false,
})
