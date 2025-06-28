import { Sprite } from "@dblatcher/sprite-canvas";
import { ScenerySprite } from "./constants-and-types";
import { ScenerySpriteKey } from "../game-state";
import { DARK_WATER } from "./tile-frames";


const house: ScenerySprite = new Sprite(
    'Down',
    { key: 'HOUSE3' },
    {
        'base': {
            frames: {
                Down: [
                    { key: 'HOUSE3' }
                ]
            }
        },
    });

const bigHouse: ScenerySprite = new Sprite(
    'Down',
    { key: 'HOUSE' },
    {
        'base': {
            frames: {
                Down: [
                    { key: 'HOUSE' }
                ]
            }
        },
    });

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
    house, rock, tree, bigHouse, tree2
}