import { Sprite } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";


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

type CharacterAnimations = 'idle' | 'walk' | 'run' | 'attack' | 'run' | 'reel'

export const ranger = new Sprite<AssetKey, CharacterAnimations>(
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
        'reel': {
            frames: {
                Down: [{ key: 'RANGER_HIT', fy: 0, fx: 3 }],
                Left: [{ key: 'RANGER_HIT', fy: 0, fx: 1 }],
                Right: [{ key: 'RANGER_HIT', fy: 0, fx: 0 }],
                Up: [{ key: 'RANGER_HIT', fy: 0, fx: 2 }],
            }
        }
    })