import { Sprite } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { CharacterSprite } from "./constants-and-types";


const frameRow = (key: AssetKey, fy: number) => [
    { key, fx: 0, fy },
    { key, fx: 1, fy },
    { key, fx: 2, fy },
    { key, fx: 3, fy },
]

const animationFrames = (key: AssetKey) => ({
    Down: frameRow(key, 0),
    Up: frameRow(key, 1),
    Right: frameRow(key, 2),
    Left: frameRow(key, 3),
})
const animationFramesSingle = (key: AssetKey) => ({
    Down: [{ key, fx: 0, fy: 0 }],
    Up: [{ key, fx: 0, fy: 1 }],
    Right: [{ key, fx: 0, fy: 2 }],
    Left: [{ key, fx: 0, fy: 3 }],
})

export const punisher: CharacterSprite = new Sprite(
    'Down',
    { key: 'PUNISHER_IDLE', fx: 0, fy: 0 },
    {
        'idle': {
            frames: animationFrames('PUNISHER_IDLE')
        },
        'walk': {
            frames: animationFrames('PUNISHER_WALK')
        },
        'run': {
            frames: animationFrames('PUNISHER_RUN')
        },
        'attack': {
            frames: animationFramesSingle('PUNISHER_ATTACK')
        },
        'reel': {
            frames: animationFramesSingle('PUNISHER_HURT')
        },
        'jump': {
            frames: animationFramesSingle('PUNISHER_HURT')
        },
        'leap': {
            frames: animationFramesSingle('PUNISHER_HURT')
        }
    })