import { Direction } from "@dblatcher/sprite-canvas"
import { GameCharacter, GameState, InputState } from "./types"

const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd) > Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    }
    return yd > 0 ? 'Down' : 'Up'
}

const CHARACTER_SPEED = .75


const updatePlayer = (player: GameCharacter, prevState: GameState, inputs: InputState): GameCharacter => {


    if (player.attack) {
        player.attack.remaining -= 1
        if (player.attack.remaining <= 0) {
            delete player.attack
        }
        return player
    }

    const { xd = 0, yd = 0, attackButton } = inputs;
    const direction = xd || yd ? getDirection(xd, yd) : player.direction;
    if (attackButton && !player.attack) {
        return {
            ...player,
            direction,
            attack: {
                duration: 100,
                remaining: 100,
            }
        }
    }
    return {
        ...player,
        x: player.x + xd * CHARACTER_SPEED,
        y: Math.min(player.y + yd * CHARACTER_SPEED, prevState.mapHeight - 30),
        direction: direction,
        vector: { xd, yd },
    }
}

export const runCycle = (prevState: GameState, inputs: InputState): GameState => {
    const { player } = prevState


    return {
        ...prevState,
        cycleNumber: prevState.cycleNumber + 1,
        player: updatePlayer(player, prevState, inputs)
    }
}