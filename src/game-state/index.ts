import { GameState } from "./types"


export const makeInitalState = (): GameState => ({
    player: {
        direction: 'Down',
        x: 5, y: 5,
        width: 40,
        height: 40,
        speed: .75,
        vector: {
            xd: 0, yd: 0
        },
    },
    obstacles: [
        {
            x: 170,
            y: 30,
            width: 30,
            height: 100,
        },
        {
            x: 80,
            y: 40,
            width: 60,
            height: 30,
        }
    ],
    mapHeight: 250,
    mapWidth: 300,
    cycleNumber: 0,
    paused: false,
})

export * from './types'
export * from './process-inputs'
