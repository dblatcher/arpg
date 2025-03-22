import { GameState, Space } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { caveLevel } from "./levels.ts/cave";
import { overlandLevel } from "./levels.ts/overland";
import { MAP_HEIGHT, MAP_WIDTH, standardNpc } from "./levels.ts/stuff";


const xy = (x: number, y: number): Space => ({ 
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
        x: TILE_SIZE * 11.2, y: TILE_SIZE*7,
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
                xy(0, 0),
                xy(0, 5),
                xy(7, 8),
                xy(8, 9),
                xy(9, 9),
                xy(9.1, 6.8),
                xy(10.1, 7.0),
                xy(11, 9),
                xy(0, 10),
                xy(2, 10),
                xy(4, 10),
                xy(5, 10),
                xy(6, 10),
                xy(4, 12),
                xy(0, 14),
                xy(3, 14),
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
