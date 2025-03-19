import { OverheadLevel, Terrain, Traversability } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { makeObstaclesAndTileMap } from "./stuff";


const tilesLevel1 = `
sssssssssssssss
ssssssssssccsss
ssssssssssccsss
s            ss
s            ss
sr      wwwwwss
srrr   wwwwwwss
sr    wwwwwwwss
sr   wwww    ss
sr          sss
sss    s s  sss
sssssssssssssss
`;

export const caveLevel = (): OverheadLevel => {

    return  {
                id: 'second',
                levelType: 'overhead',
                exits: [
                    {
                        x: TILE_SIZE * 10,
                        y: TILE_SIZE * 1,
                        width: TILE_SIZE * 2,
                        height: TILE_SIZE * 1,
                        destination: {
                            levelIndex: 0,
                            x: TILE_SIZE * 4.5,
                            y: TILE_SIZE * 2,
                        }
                    }
                ],
                npcs: [],
                ...makeObstaclesAndTileMap(tilesLevel1, {
                    terrain: Terrain.MossyGround,
                    traversability: Traversability.Open
                })
            }
}