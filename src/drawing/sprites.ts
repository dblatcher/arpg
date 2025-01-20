import { Sprite } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";


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

export const ranger = new Sprite('Down', {
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
    }
}, assetParams)