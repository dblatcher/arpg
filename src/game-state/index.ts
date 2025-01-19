import { Reducer } from "react"
import { runCycle } from "./run-cycle"
import { GameState, InputState } from "./types"


export type GameStateAction = {
    type: 'tick'
    inputs: InputState
} | {
    type: 'pause',
    value: boolean,
}


export const myReducer: Reducer<GameState, GameStateAction> = (prevState: GameState, action: GameStateAction) => {

    switch (action.type) {
        case "tick": {
            return runCycle(prevState, action.inputs)
        }
        case "pause":
            return {
                ...prevState,
                paused: action.value,
            }
    }
}

export const makeInitalState = (): GameState => ({
    player: {
        direction: 'Down',
        x: 5, y: 5,
        vector: {
            xd: 0, yd: 0
        }
    },
    mapHeight: 250,
    mapWidth: 300,
    cycleNumber: 0,
    paused: false,
})

export * from './types'
