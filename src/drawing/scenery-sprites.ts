import { Sprite, SpriteFrame } from "@dblatcher/sprite-canvas";
import { ScenerySprite } from "./constants-and-types";
import { ScenerySpriteKey } from "../game-state";
import { DARK_WATER } from "./tile-frames";
import { AssetKey } from "../assets-defs";


const staticSprite = (frame: SpriteFrame<AssetKey>): ScenerySprite => new Sprite(
    'Down', frame, {}
);

const house = staticSprite({ key: 'HOUSE3' });
const bigHouse = staticSprite({ key: 'HOUSE' });
const wall = staticSprite({ key: 'WALL' });
const gate = staticSprite({ key: 'GATE' });


const tree: ScenerySprite = new Sprite(
    'Down',
    { key: 'TREE' },
    {
        'base': {
            frames: {
                Down: [
                    { key: 'TREE' }
                ]
            }
        },
        'active': {
            frames: {
                Down: DARK_WATER
            }
        },
    });

const tree2: ScenerySprite = new Sprite(
    'Down',
    { key: 'TREE2' },
    {
        'base': {
            frames: {
                Down: [
                    { key: 'TREE2' }
                ]
            }
        },
        'active': {
            frames: {
                Down: [
                    { key: 'TREE2' }
                ]
            }
        },
    });

const rock: ScenerySprite = new Sprite(
    'Down',
    {
        key: 'MISC',
        fx: 1,
    },
    {
        'base': {
            frames: {
                Down: [{ key: 'MISC', fx: 1, }]
            }
        },
        'active': {
            frames: {
                Down: [{ key: 'MISC', fx: 0, }]
            }
        },
    });


export const scenerySprites: Record<ScenerySpriteKey, ScenerySprite> = {
    house, rock, tree, bigHouse, tree2, wall, gate
}