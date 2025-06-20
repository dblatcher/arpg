import { EffectType, EntityType, OverheadLevel, Traversability } from "../../game-state"
import { TILE_SIZE } from "../../game-state/constants"
import { LEVEL_IDS, makeObstaclesAndTileMap, safeNpc, standardNpc } from "./stuff";


const tilesLevel0 = `
 rssccsssffssss
 rssccsssffssss B
 r     wwFFww s
 rrrrr wwwwww s
 r   r        ssssslsssss
  ss rrrrrr   ssssslsssss
 sss      r   ssssslsssss
 sss      r   ssssslsssss
       B  r   ssssslsssss
          r              
   ....   r              
   ....   r  ....        
   .  .   r  ....        
   .  .   r  ....        
          r  .  .        
`;

export const overlandLevel = (): OverheadLevel => {

    const mapWidth = 1000;
    const mapHeight = 800;

    return {
        id: LEVEL_IDS.Outside,
        mapWidth,
        mapHeight,
        levelType: 'overhead',
        exits: [
            {
                width: TILE_SIZE * 2,
                height: TILE_SIZE * 1,
                x: TILE_SIZE * 4,
                y: TILE_SIZE * 0,
                destination: {
                    levelId: LEVEL_IDS.Caves,
                    x: TILE_SIZE * 10.5,
                    y: TILE_SIZE * 3,
                }
            },
            {
                width: TILE_SIZE * 3,
                height: TILE_SIZE * 1,
                x: TILE_SIZE * 3,
                y: TILE_SIZE * 12,
                destination: {
                    levelId: LEVEL_IDS.House,
                    x: TILE_SIZE * 5,
                    y: TILE_SIZE * 6,
                }
            }
        ],
        scenery: [
            {
                type: EntityType.Scenery,
                x: TILE_SIZE * 2.5,
                y: TILE_SIZE * 8.75,
                width: TILE_SIZE * 5,
                height: TILE_SIZE * 5.5,
                traversability: Traversability.Open,
                image: {
                    key: 'HOUSE3'
                }
            },
            {
                type: EntityType.Scenery,
                x: TILE_SIZE * 12.5,
                y: TILE_SIZE * 9.75,
                width: TILE_SIZE * 5,
                height: TILE_SIZE * 5.5,
                traversability: Traversability.Open,
                image: {
                    key: 'HOUSE3'
                }
            },
            {
                type: EntityType.Scenery,
                x: TILE_SIZE * 11.5,
                y: TILE_SIZE * 8,
                width: TILE_SIZE * 1,
                height: TILE_SIZE * 1,
                traversability: Traversability.Blocking,
                image: {
                    key: 'MISC',
                    fx: 1,
                },
                interaction: {
                    effects: [
                        { type: EffectType.Log, contents: ["running interaction effects"] },
                        {
                            type: EffectType.ModTargetScenery, mod: {
                                image: {
                                    key: 'MISC',
                                    fx: 2,
                                },
                            }
                        }
                    ]
                }
            },
        ],
        npcs: [
            standardNpc(TILE_SIZE * 3.9, TILE_SIZE * 2.1, { task: 'Guard' }, 'hue-rotate(60deg)', 'ranger'),
            standardNpc(TILE_SIZE * 5.1, TILE_SIZE * 2.5, { task: 'Guard' }, 'hue-rotate(60deg)', 'ranger'),
            standardNpc(TILE_SIZE * 4.9, TILE_SIZE * 5.5, { task: 'Guard' }, 'hue-rotate(60deg)', 'ranger'),
            standardNpc(100, 340),
            safeNpc(50, 440, {}, 'hue-rotate(-90deg) brightness(1.6)'),
            standardNpc(150, 300),
            standardNpc(265, 260),
            {
                ...safeNpc(550, TILE_SIZE * 15, { task: 'Guard' }, 'hue-rotate(-90deg) brightness(1.6)'),
                interaction: { dialog: { text: 'Hello, I am standing still.' } }
            },
            safeNpc(500, 300, {}, 'hue-rotate(-90deg) brightness(1.6)'),
            standardNpc(700, 440),
        ],
        ...makeObstaclesAndTileMap(tilesLevel0, mapWidth, mapHeight)
    };
}