import { OverheadLevel, Terrain, Traversability } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { LEVEL_IDS, makeObstaclesAndTileMap, safeNpc } from "./stuff";


const tiles = `
BBBBBBBBBB
BBBBBBBBBB
BBBBBBBBBB
B        B
B        B
B        B
B        B
B        B
B        B
BBBB  BBBB
`;

export const houseLevel = (): OverheadLevel => {

    const mapWidth = 10 * TILE_SIZE;
    const mapHeight = 10 * TILE_SIZE;

    return {
        id: LEVEL_IDS.House,
        bgm: undefined,
        mapWidth,
        mapHeight,
        levelType: 'overhead',
        scenery: [

        ],
        exits: [
            {
                x: TILE_SIZE * 4,
                y: TILE_SIZE * 9.5,
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 1,
                destination: {
                    levelId: LEVEL_IDS.Outside,
                    x: TILE_SIZE * 21.5,
                    y: TILE_SIZE * 17.5,
                }
            },
        ],
        npcs: [
            {
                ...safeNpc(TILE_SIZE * 4, TILE_SIZE * 5, { task: 'Guard' }),
                interaction: { dialog: { text: 'It is dangerous to go alone... too bad.' } }
            },
        ],
        ...makeObstaclesAndTileMap(tiles, mapWidth, mapHeight, {
            terrain: Terrain.WoodFloor,
            traversability: Traversability.Open
        })
    }
}