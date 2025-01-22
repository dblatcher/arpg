import { Direction } from "@dblatcher/sprite-canvas"
import { GameCharacter, GameState, InputState, Obstable } from "./types"
import { doRectsIntersect, Rect } from "../lib/geometry"

const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd) > Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    }
    return yd > 0 ? 'Down' : 'Up'
}

const obstacleToRect = (o: Obstable): Rect => ({ top: o.y, left: o.x, bottom: o.y + o.height, right: o.x + o.width })

const attemptMove = (character: GameCharacter, state: GameState): { character: GameCharacter } => {
    const newPosition = {
        x: character.x + character.vector.xd * character.speed,
        y: Math.min(character.y + character.vector.yd * character.speed, state.mapHeight - 30),
    }
    const newPositionRect = obstacleToRect({ ...character, ...newPosition })
    const collidedObstacle = state.obstacles.find(obstacle => doRectsIntersect(obstacleToRect(obstacle), newPositionRect))
    if (!collidedObstacle) {
        character.x = newPosition.x;
        character.y = newPosition.y;
    }
    return { character }
}

export const directionToUnitVector = (direction: Direction) => {
    switch (direction) {
        case "Up":
            return { xd: 0, yd: -1 }
        case "Down":
            return { xd: 0, yd: 1 }
        case "Left":
            return { xd: -1, yd: 0 }
        case "Right":
            return { xd: 1, yd: 0 }
    }
}

export const getAttackZone = (character: GameCharacter): Rect | undefined => {
    const { attack, direction } = character
    if (!attack) {
        return undefined
    }
    const attackVector = directionToUnitVector(direction)

    return {
        left: character.x + (character.width * attackVector.xd),
        right: character.x + character.width + (character.width * attackVector.xd),
        top: character.y + (character.height * attackVector.yd),
        bottom: character.y + character.height + (character.height * attackVector.yd),
    }

}

const updatePlayer = (player: GameCharacter, prevState: GameState, inputs: InputState): GameCharacter => {
    if (player.attack) {
        player.attack.remaining -= 1
        if (player.attack.remaining <= 0) {
            delete player.attack
        }
        return player
    }

    const { xd = 0, yd = 0, attackButton } = inputs;
    player.direction = xd || yd ? getDirection(xd, yd) : player.direction;

    if (attackButton) {
        return {
            ...player,
            attack: {
                duration: 100,
                remaining: 100,
            }
        }
    }

    player.vector = { xd, yd }

    const afterMove = attemptMove(player, prevState)
    return afterMove.character
}

export const runCycle = (prevState: GameState, inputs: InputState): GameState => {
    const { player } = prevState
    return {
        ...prevState,
        cycleNumber: prevState.cycleNumber + 1,
        player: updatePlayer(player, prevState, inputs)
    }
}