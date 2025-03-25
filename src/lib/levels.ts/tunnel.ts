import { Platform, PlatformLevel } from "../../game-state";
import { TILE_SIZE } from "../../game-state/constants";
import { stringToBackdropTiles } from "../tile-maps";
import { LEVEL_IDS } from "./stuff";

const makePlatform = (x: number, y: number, blocking = true): Platform => ({
    x: x * TILE_SIZE,
    y: y * TILE_SIZE,
    width: TILE_SIZE,
    height: blocking ? TILE_SIZE / 2 : TILE_SIZE / 4,
    blocking,
})

const tilesLevel0 = `
 
 
 
 
 
 
 
 s  s  s  s  s  s  s  s  s  s
 ssssssssssssssssssssssssssss
 ssssssmsmmmsssssssssssssssss
 ssssssmmmsssssssssssssssssss
 ssssssssssssssssssssssssssss
`;

export const tunnelLevel = (): PlatformLevel => {

    const mapWidth = 1200
    const mapHeight = 450

    return {
        id: LEVEL_IDS.Bridge,
        mapWidth,
        mapHeight,
        levelType: 'platform',
        npcs: [
            // standardNpc(TILE_SIZE * 5, 50)
        ],

        backdrops: [
            {
                parallax: 10,
                filter: 'sepia(70%)',
                baseColor: '#31a2f2',
                images: [{
                    image: 'CLOUDS',
                    repeat: 'repeat',
                    rect: [0, 100, mapWidth, 150],
                }],
            },
            {
                parallax: 2,
                filter: 'blur(1px) sepia(60%)',
                terrainMap: stringToBackdropTiles(tilesLevel0, mapWidth / TILE_SIZE, mapHeight / TILE_SIZE)
            }
        ],
        platforms: [
            makePlatform(0, 5),
            makePlatform(7, 8),
            makePlatform(8, 9),
            makePlatform(9, 9),
            makePlatform(9.1, 6.8),
            makePlatform(10.1, 7.0, false),
            makePlatform(11, 9),
            makePlatform(12, 9),
            makePlatform(13, 9),
            makePlatform(14, 9),
            makePlatform(15, 9),
            makePlatform(16, 9),
            makePlatform(17, 9),
            makePlatform(18, 9),
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