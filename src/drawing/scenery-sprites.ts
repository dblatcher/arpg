import { Sprite } from "@dblatcher/sprite-canvas";
import { ScenerySprite } from "./constants-and-types";
import { ScenerySpriteKey } from "../game-state";
import { DARK_WATER } from "./tile-frames";


export const house: ScenerySprite = new Sprite(
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

export const bigHouse: ScenerySprite = new Sprite(
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

export const tree: ScenerySprite = new Sprite(
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

export const rock: ScenerySprite = new Sprite(
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
    house, rock, tree, bigHouse
}