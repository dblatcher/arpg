import { GameState } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { caveLevel } from "./levels.ts/cave";
import { overlandLevel } from "./levels.ts/overland";
import { MAP_HEIGHT, MAP_WIDTH } from "./levels.ts/stuff";



export const makeInitalState = (): GameState => ({
    score: 0,
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
        overlandLevel(),
        caveLevel(),
    ],

    mapHeight: MAP_HEIGHT,
    mapWidth: MAP_WIDTH,
    cycleNumber: 0,
    paused: false,
})
