import { Direction } from "@dblatcher/sprite-canvas"
import { GameState, InputState } from "./types"

const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd)> Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    } 
    return yd > 0 ? 'Down' : 'Up'
}

const CHARACTER_SPEED = .75


export const runCycle = (prevState: GameState, inputs: InputState): GameState => {
    const { xd = 0, yd = 0 } = inputs;
    const { player } = prevState
    const direction = xd || yd ? getDirection(xd, yd) : player.direction;

    return {
        ...prevState,
        cycleNumber: prevState.cycleNumber + 1,
        player: {
            ...player,
            x: player.x + xd * CHARACTER_SPEED,
            y: Math.min(player.y + yd * CHARACTER_SPEED, prevState.mapHeight - 30),
            direction: direction,
            vector: { xd, yd },
        }
    }
}