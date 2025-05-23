import { Sprite, SpriteFrame } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { CharacterSprite } from "./constants-and-types";


const frameRow = (key: AssetKey, fy: number) => [
    { key, fx: 0, fy },
    { key, fx: 1, fy },
    { key, fx: 2, fy },
    { key, fx: 3, fy },
]

const animationFrames = (key: AssetKey) => ({
    Up: frameRow(key, 0),
    Left: frameRow(key, 1),
    Down: frameRow(key, 2),
    Right: frameRow(key, 3)
})
const animationFrames2 = (key: AssetKey) => ({
    Down: frameRow(key, 0),
    Left: frameRow(key, 1),
    Up: frameRow(key, 2),
    Right: frameRow(key, 3)
})

const sameAllDirections = (frames: SpriteFrame<AssetKey>[]) => ({
    Down: frames,
    Left: frames,
    Up: frames,
    Right: frames
})

export const ranger: CharacterSprite = new Sprite(
    'Down',
    { key: 'RANGER_IDLE', fx: 0, fy: 0 },
    {
        'idle': {
            frames: animationFrames('RANGER_IDLE')
        },
        'walk': {
            frames: animationFrames('RANGER_WALK')
        },
        'run': {
            frames: animationFrames('RANGER_RUN')
        },
        'attack': {
            frames: animationFrames2('RANGER_ATTACK')
        },
        'jump': {
            frames: {
                Down: [{ key: 'RANGER_JUMP', fy: 0, fx: 3 }],
                Left: [{ key: 'RANGER_JUMP', fy: 0, fx: 0 }],
                Right: [{ key: 'RANGER_JUMP', fy: 0, fx: 1 }],
                Up: [{ key: 'RANGER_JUMP', fy: 0, fx: 2 }],
            }
        },
        'reel': {
            frames: {
                Down: [{ key: 'RANGER_HIT', fy: 0, fx: 3 }],
                Left: [{ key: 'RANGER_HIT', fy: 0, fx: 1 }],
                Right: [{ key: 'RANGER_HIT', fy: 0, fx: 0 }],
                Up: [{ key: 'RANGER_HIT', fy: 0, fx: 2 }],
            }
        },
        'leap': {
            frames: {
                Down: [{ key: 'RANGER_RUN', fy: 2, fx: 1 }],
                Left: [{ key: 'RANGER_RUN', fy: 1, fx: 0 }],
                Right: [{ key: 'RANGER_RUN', fy: 3, fx: 3 }],
                Up: [{ key: 'RANGER_RUN', fy: 0, fx: 2 }],
            }
        },
        'climbing': {
            frames: sameAllDirections([
                { key: 'RANGER_CLIMB', fy: 0, fx: 0 },
                { key: 'RANGER_CLIMB', fy: 0, fx: 1 },
                { key: 'RANGER_CLIMB', fy: 0, fx: 2 },
                { key: 'RANGER_CLIMB', fy: 0, fx: 3 },
            ])
        },
        'climbIdle': {
            frames: sameAllDirections([
                { key: 'RANGER_CLIMB', fy: 0, fx: 2 }
            ])
        }
    })