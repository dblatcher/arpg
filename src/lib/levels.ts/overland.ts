import { OverheadLevel } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { LEVEL_IDS, makeObstaclesAndTileMap, standardNpc } from "./stuff";


const tilesLevel0 = `
 rssccsssffssss
 rssccsssffssss
 r     wwFFww
 rrrrr wwwwww
 r   r     
  ss rrrrrr
 sss      r   s
 sss      r   s
`;

export const overlandLevel = (): OverheadLevel => {

    return {
        id: LEVEL_IDS.Outside,
        levelType: 'overhead',
        exits: [
            {
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 1,
                y: TILE_SIZE * 0,
                x: TILE_SIZE * 4,
                destination: {
                    levelId: LEVEL_IDS.Caves,
                    x: TILE_SIZE * 10.5,
                    y: TILE_SIZE * 3,
                }
            }
        ],
        npcs: [
            standardNpc(20, 100),
            standardNpc(65, 100),
            standardNpc(100, 340),
            standardNpc(150, 440),
            standardNpc(150, 360),
            standardNpc(180, 280),
            standardNpc(265, 260),
            standardNpc(350, 360),
            standardNpc(300, 300),
            standardNpc(350, 440),
            standardNpc(550, 360),
            standardNpc(500, 300),
            standardNpc(550, 440),
        ],
        ...makeObstaclesAndTileMap(tilesLevel0)
    };
}