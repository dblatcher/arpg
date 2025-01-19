import { BaseGameState } from "@dblatcher/sprite-canvas"
import { Reducer } from "react"

export type GameState = BaseGameState & {
    x: number,
    y: number,
    paused: boolean,
}

export type InputState = {
    xd: number,
    yd: number,
}

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
            const { inputs } = action;
            return {
                ...prevState,
                cycleNumber: prevState.cycleNumber + 1,
                x: prevState.x + inputs.xd,
                y: Math.min(prevState.y + inputs.yd, prevState.mapHeight - 30)
            }
        }
        case "pause":
            return {
                ...prevState,
                paused: action.value,
            }
    }
}

export const makeInitalState = (): GameState => ({
    x: 5, y: 5,
    mapHeight: 250,
    mapWidth: 150,
    cycleNumber: 0,
    paused: false,
})
