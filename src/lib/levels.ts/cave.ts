import { EntityType, OverheadLevel, Terrain, Traversability } from "../../game-state";
import { TILE_SIZE } from "../../game-state/constants";
import { LEVEL_IDS, makeObstaclesAndTileMap, makeScenery, makeTraversabilityMap } from "./stuff";


const tilesLevel1 = `
sssssssssssssss
ssssccssssccsss
ssssccssssccsss
s            ss
s            ss
sr      wwwwwss
srrr   wwwwwwss
sr  . wwwwwwwss
sr   wwww    ss
sr          sss
sss    s s  sss
sssssssssssssss
sssssssssssssss
sssssssssssssss
`;

export const caveLevel = (): OverheadLevel => {

    const mapWidth = 600;
    const mapHeight = 600;

    return {
        id: LEVEL_IDS.Caves,
        bgm: 'cave-song',
        mapWidth,
        mapHeight,
        levelType: 'overhead',
        scenery: [
            makeScenery({
                spriteKey: 'tree',
                x: TILE_SIZE * 10,
                y: TILE_SIZE * 5,
                width: TILE_SIZE * 1,
                height: TILE_SIZE * 2,
                traversabilityMap: makeTraversabilityMap(Traversability.Blocking),
            }),
            makeScenery({
                spriteKey: 'tree',
                type: EntityType.Scenery,
                x: TILE_SIZE * 3.5,
                y: TILE_SIZE * 5.75,
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 2.5,
                traversabilityMap: makeTraversabilityMap(Traversability.Open),
            }),
            makeScenery({
                spriteKey: 'rock',
                type: EntityType.Scenery,
                x: TILE_SIZE * 1.5,
                y: TILE_SIZE * 8,
            }),
            makeScenery({
                spriteKey: 'rock',
                type: EntityType.Scenery,
                x: TILE_SIZE * 1,
                y: TILE_SIZE * 3,
            }),
        ],
        exits: [
            {
                x: TILE_SIZE * 10,
                y: TILE_SIZE * 1,
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 1,
                destination: {
                    levelId: LEVEL_IDS.Outside,
                    x: TILE_SIZE * 4.5,
                    y: TILE_SIZE * 2,
                }
            },
            {
                x: TILE_SIZE * 3,
                y: TILE_SIZE * 1,
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 1,
                destination: {
                    levelId: LEVEL_IDS.Bridge,
                    x: TILE_SIZE * 2,
                    y: TILE_SIZE * 4,
                }
            },
        ],
        npcs: [],
        defaultTerrain: Terrain.MossyGround,
        ...makeObstaclesAndTileMap(tilesLevel1, mapWidth, mapHeight, {
            terrain: Terrain.MossyGround,
            traversability: Traversability.Open
        })
    }
}