import { Platform, PlatformLevel } from "../../game-state";
import { TILE_SIZE } from "../../game-state/constants";
import { LEVEL_IDS } from "./stuff";

const makePlatform = (x: number, y: number, blocking = true): Platform => ({
    x: x * TILE_SIZE,
    y: y * TILE_SIZE,
    width: TILE_SIZE,
    height: blocking ? TILE_SIZE / 2 : TILE_SIZE / 4,
    blocking,
})

export const tunnelLevel = (): PlatformLevel => {

    return {
        id: LEVEL_IDS.Bridge,
        levelType: 'platform',
        npcs: [
            // standardNpc(TILE_SIZE * 5, 50)
        ],
        platforms: [
            makePlatform(0, 0),
            makePlatform(0, 5),
            makePlatform(7, 8),
            makePlatform(8, 9),
            makePlatform(9, 9),
            makePlatform(9.1, 6.8),
            makePlatform(10.1, 7.0, false),
            makePlatform(11, 9),
            makePlatform(0, 10),
            makePlatform(1, 10),
            makePlatform(2, 10),
            makePlatform(4, 10),
            makePlatform(5, 10),
            makePlatform(6, 10),
            makePlatform(6, 9.1, false),
            makePlatform(6, 8.3, false),
            makePlatform(4, 12),
            makePlatform(0, 14),
            makePlatform(3, 14),
        ],
        exits: [
            {
                x: 0,
                y: TILE_SIZE * 8,
                width: TILE_SIZE * 1,
                height: TILE_SIZE * 2,
                destination: {
                    levelId: LEVEL_IDS.Caves,
                    x: TILE_SIZE * 4.5,
                    y: TILE_SIZE * 3,
                }
            },
        ]
    };
}