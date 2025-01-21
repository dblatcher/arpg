import { GameState } from "./types"


export const makeInitalState = (): GameState => ({
    player: {
        direction: 'Down',
        x: 5, y: 5,
        vector: {
            xd: 0, yd: 0
        },
    },
    mapHeight: 250,
    mapWidth: 300,
    cycleNumber: 0,
    paused: false,
})

export * from './types'
export * from './process-inputs'
