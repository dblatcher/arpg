import { GameState } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { caveLevel } from "./levels.ts/cave";
import { overlandLevel } from "./levels.ts/overland";
import { LEVEL_IDS, MAP_HEIGHT, MAP_WIDTH } from "./levels.ts/stuff";
import { tunnelLevel } from "./levels.ts/tunnel";

export const makeInitalState = (): GameState => {
    const levels = [
        tunnelLevel(),
        overlandLevel(),
        caveLevel(),
    ]
    const currentLevelIndex = levels.findIndex(level => level.id === LEVEL_IDS.Caves)

    return {
        score: 0,
        feedbackEvents: [],
        currentLevelIndex,
        levels,
        player: {
            id: -1,
            direction: 'Down',
            altitude: 0,
            // x: TILE_SIZE * 5, y: TILE_SIZE * 2,
            x: TILE_SIZE * 9.2, y: TILE_SIZE * 4,
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

        mapHeight: MAP_HEIGHT,
        mapWidth: MAP_WIDTH,
        cycleNumber: 0,
        paused: false,
    }
}
