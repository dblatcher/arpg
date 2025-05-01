import { Platform, PlatformLevel } from "../../game-state";
import { TILE_SIZE } from "../../game-state/constants";
import { stringToBackdropTiles } from "../tile-maps";
import { LEVEL_IDS, standardNpc } from "./stuff";

const makeSmallPlatform = (x: number, y: number, blocking = true): Platform => ({
    x: x * TILE_SIZE,
    y: y * TILE_SIZE,
    width: TILE_SIZE,
    height: blocking ? TILE_SIZE / 2 : TILE_SIZE / 4,
    blocking,
})

const makeRectPlatform = (x: number, y: number, width: number, height = .5, blocking = true): Platform => ({
    x: x * TILE_SIZE,
    y: y * TILE_SIZE,
    width: width * TILE_SIZE,
    height: height * TILE_SIZE,
    blocking,
})

const castleWall = `
 
 
 
 
 
 
 
 s  s  s  s  s  s  s  s  s  s
 ssssssssssssssssssssssssssss
 ssssssmsmmmsssssssssssssssss
 ssssssmmmsssssssssssssssssss
 ssssssssssssssssssssssssssss
`;

const castleGate = `
 
 
 
 
 
 
 
ss
 s
 s
sss
`;

export const tunnelLevel = (): PlatformLevel => {

    const mapWidth = 1200
    const mapHeight = 450

    return {
        id: LEVEL_IDS.Bridge,
        bgm: 'main-theme',
        mapWidth,
        mapHeight,
        levelType: 'platform',
        npcs: [
            standardNpc(TILE_SIZE * 4.9, 50)
        ],

        backdrops: [
            {
                parallax: 10,
                filter: 'sepia(70%)',
                baseColor: '#31a2f2',
                images: [{
                    assetKey: 'CLOUDS',
                    repeat: 'repeat-x',
                    rectArgs: [0, 50, mapWidth, 150],
                    scaleX: 1.5,
                    scaleY: 2,
                }],
            },
            {
                parallax: 2,
                filter: 'blur(1px) sepia(60%)  contrast(50%)',
                terrainMap: stringToBackdropTiles(castleWall, mapWidth / TILE_SIZE, mapHeight / TILE_SIZE)
            },
            {
                parallax: 1,
                filter: 'blur(0px) sepia(60%) contrast(60%)',
                terrainMap: stringToBackdropTiles(castleGate, mapWidth / TILE_SIZE, mapHeight / TILE_SIZE)
            }
        ],
        platforms: [
            makeRectPlatform(0, 10, 3),
            makeSmallPlatform(7, 8),
            makeRectPlatform(8, 9, 2),
            makeSmallPlatform(9.1, 6.8),
            makeSmallPlatform(10.1, 7.0, false),
            makeRectPlatform(11, 9, 8),
            makeSmallPlatform(5, 10),
            makeSmallPlatform(6, 10),
            makeSmallPlatform(6, 9.1, false),
            makeSmallPlatform(5, 9.1, false),
            makeSmallPlatform(4, 9.1, false),
            makeSmallPlatform(6, 8.3, false),
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