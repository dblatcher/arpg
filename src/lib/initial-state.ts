import { GameState, Level } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { caveLevel } from "./levels.ts/cave";
import { overlandLevel } from "./levels.ts/overland";
import { tunnelLevel } from "./levels.ts/tunnel";

export const makeInitalState = (): GameState => {
    const levels: [Level, Level, Level] = [
        tunnelLevel(),
        overlandLevel(),
        caveLevel(),
    ]
  
    const currentLevel = levels[0]
    const { mapWidth, mapHeight, id:currentLevelId } = currentLevel
    return {
        score: 0,
        feedbackEvents: [],
        currentLevelId,
        levels,
        player: {
            id: -1,
            direction: 'Down',
            altitude: 0,
            // x: TILE_SIZE * 5, y: TILE_SIZE * 2,
            x: 80,
            y: TILE_SIZE * 4,
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

        mapHeight,
        mapWidth,
        cycleNumber: 0,
        paused: false,
    }
}
