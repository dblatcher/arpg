import { EntityType, GameState, Level } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";
import { caveLevel } from "./levels.ts/cave";
import { houseLevel } from "./levels.ts/house";
import { overlandLevel } from "./levels.ts/overland";
import { tunnelLevel } from "./levels.ts/tunnel";

export const makeInitalState = (): GameState => {
    const levels: [Level, Level, Level, Level] = [
        overlandLevel(),
        tunnelLevel(),
        caveLevel(),
        houseLevel(),
    ]

    const currentLevel = levels[0]
    // const currentLevel = levels[2]
    const { mapWidth, mapHeight, id: currentLevelId } = currentLevel
    return {
        score: 0,
        feedbackEvents: [],
        currentLevelId,
        levels,
        player: {
            type: EntityType.Player,
            id: -1,
            spriteKey: 'ranger',
            direction: 'Down',
            altitude: 0,
            // x: TILE_SIZE * 5,
            // y: TILE_SIZE * 3,
            x: TILE_SIZE * 22,
            y: TILE_SIZE * 20,
            width: 35,
            height: 35,
            speed: 1.5,
            vector: {
                xd: 0, yd: 0
            },
            health: {
                max: 10,
                current: 10
            },
            mind: {},
        },

        mapHeight,
        mapWidth,
        cycleNumber: 0,
        paused: false,
    }
}
