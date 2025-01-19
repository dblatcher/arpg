import { Direction } from "@dblatcher/sprite-canvas"
import { GameState, InputState } from "./types"

const getDirection = (xd: number, yd: number): Direction => {
    if (yd > 0) {
        return 'Down'
    }
    if (yd < 0) {
        return 'Up'
    }
    return xd > 0 ? 'Right' : 'Left'
}

export const runCycle = (prevState:GameState, inputs:InputState ):GameState => {
    const { xd, yd } = inputs;
    const { player } = prevState
    const direction = xd || yd ? getDirection(xd, yd) : player.direction;

    return {
        ...prevState,
        cycleNumber: prevState.cycleNumber + 1,
        player: {
            ...player,
            x: player.x + xd,
            y: Math.min(player.y + yd, prevState.mapHeight - 30),
            direction: direction,
            vector: { xd, yd },
        }
    }
}