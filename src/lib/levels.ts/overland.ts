import { OverheadLevel } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { LEVEL_IDS, makeObstaclesAndTileMap, standardNpc } from "./stuff";


const tilesLevel0 = `
 rssccsssffssss
 rssccsssffssss
 r     wwFFww s
 rrrrr wwwwww s
 r   r        ssssslsssss
  ss rrrrrr   ssssslsssss
 sss      r   ssssslsssss
 sss      r   ssssslsssss`;

export const overlandLevel = (): OverheadLevel => {

    const mapWidth = 1000;
    const mapHeight = 600;

    return {
        id: LEVEL_IDS.Outside,
        mapWidth,
        mapHeight,
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
            standardNpc(TILE_SIZE * 3.9, TILE_SIZE*2.1, {task:'Guard'}),
            standardNpc(TILE_SIZE * 5.1, TILE_SIZE*2.5, {task:'Guard'}),
            standardNpc(TILE_SIZE * 4.9, TILE_SIZE*5.5, {task:'Guard'}),
            standardNpc(100, 340),
            standardNpc(150, 440),
            standardNpc(150, 360),
            standardNpc(265, 260),
            standardNpc(550, 360),
            standardNpc(500, 300),
            standardNpc(550, 440),
        ],
        ...makeObstaclesAndTileMap(tilesLevel0, mapWidth, mapHeight)
    };
}