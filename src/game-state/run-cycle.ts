import { doRectsIntersect, Rect, toUnitVector, translate, XY } from "../lib/geometry"
import { directionToUnitVector, getDirection, obstacleToRect } from "./helpers"
import { GameCharacter, GameState, InputState } from "./types"

// game thinking:
// reel should move the target far back enough to be 
// out of range of an attack from the same position
const BASE_REEL_SPEED = .95
const REEL_DURATION = 100
const ATTACK_DURATION = 40

const reelVector = (character: GameCharacter): XY => {
    const { reeling } = character
    if (!reeling) {
        return { x: 0, y: 0 }
    }
    const speed = BASE_REEL_SPEED * (reeling.remaining) / reeling.duration
    return {
        x: reeling.unitVector.x * speed,
        y: reeling.unitVector.y * speed,
    }
}

const attemptMove = (character: GameCharacter, state: GameState): { character: GameCharacter, collidedNpc?: GameCharacter } => {

    // game thinking
    // characters don't move while attacking
    // might want to revise that or have other types
    // of attack that involve movement (charge?)
    if (character.attack && !character.reeling) {
        return {
            character
        }
    }

    const vector = character.reeling
        ? reelVector(character)
        : {
            x: character.vector.xd * character.speed,
            y: character.vector.yd * character.speed
        }

    const newPosition = translate(character, vector);
    // TO DO - bind new position by edge of map? 
    // detect player walking off to next screen?

    const newPositionRect = obstacleToRect({ ...character, ...newPosition })
    const collidedObstacle = state.obstacles.find(obstacle => doRectsIntersect(obstacleToRect(obstacle), newPositionRect))
    const collidedNpc = state.npcs.find(npc => doRectsIntersect(obstacleToRect(npc), newPositionRect))
    if (!collidedObstacle && !collidedNpc) {
        character.x = newPosition.x;
        character.y = newPosition.y;
    }
    return { character, collidedNpc }
}


export const getAttackZone = (character: GameCharacter): Rect | undefined => {
    const { attack, direction } = character
    if (!attack) {
        return undefined
    }
    const attackVector = directionToUnitVector(direction)
    // TO DO - shouldn't always be square or the same size as the character
    return {
        left: character.x + (character.width * attackVector.x),
        right: character.x + character.width + (character.width * attackVector.x),
        top: character.y + (character.height * attackVector.y),
        bottom: character.y + character.height + (character.height * attackVector.y),
    }
}

const progressReelingAndAttack = (character: GameCharacter) => {
    if (character.reeling) {
        character.reeling.remaining -= 1
        if (character.reeling.remaining <= 0) {
            delete character.reeling
            delete character.attack
        }
        return true
    }

    if (character.attack) {
        character.attack.remaining -= 1
        if (character.attack.remaining <= 0) {
            delete character.attack
        }
        return true
    }
    return false
}

const updatePlayer = (player: GameCharacter, inputs: InputState): GameCharacter => {
    if (player.attack || player.reeling) {
        return player
    }

    if (player.health.current <= 0) {
        player.vector = { xd: 0, yd: 0 }
        return player
    }

    const { xd = 0, yd = 0, attackButton } = inputs;
    player.direction = xd || yd ? getDirection(xd, yd) : player.direction;
    if (attackButton) {
        player.attack = {
            duration: ATTACK_DURATION,
            remaining: ATTACK_DURATION,
        }
        return player
    }
    player.vector = { xd, yd }
    return player
}


const findNpcsHitByPlayerAttack = (npcs: GameCharacter[], attackZone: Rect): GameCharacter[] => {
    // TO DO - check doRectsIntersect works for exact matches
    // MAYBE - use find instead of filter as minor optimisation - don't need to catch every npc on first cycle?
    return npcs.filter(npc => !npc.reeling && doRectsIntersect(attackZone, obstacleToRect(npc)))
}

const handlePlayerAttackHits = (npc: GameCharacter, state: GameState): GameCharacter => {
    console.log('hit', state.cycleNumber, state.player.direction)
    npc.reeling = {
        direction: state.player.direction,
        unitVector: directionToUnitVector(state.player.direction),
        duration: REEL_DURATION,
        remaining: REEL_DURATION,
    }
    npc.health.current = npc.health.current - 1
    return npc
}

export const runCycle = (prevState: GameState, inputs: InputState): GameState => {
    const { player, npcs } = prevState

    updatePlayer(player, inputs)
    progressReelingAndAttack(player)
    const { collidedNpc } = attemptMove(player, prevState)

    if (collidedNpc && !player.reeling) {
        player.reeling = {
            duration: REEL_DURATION / 2,
            remaining: REEL_DURATION / 2,
            direction: 'Up',
            unitVector: toUnitVector({ x: -player.vector.xd, y: -player.vector.yd })
        }
        player.health.current = player.health.current - 1
    }
    // TO DO - how does the application react to player death?

    const attackZone = getAttackZone(player)
    if (attackZone) {
        const hitNpcs = findNpcsHitByPlayerAttack(npcs, attackZone)
        hitNpcs.forEach(npc => handlePlayerAttackHits(npc, prevState))
    }

    npcs.forEach(npc => {
        progressReelingAndAttack(npc)
        attemptMove(npc, prevState)
    })

    return {
        ...prevState,
        cycleNumber: prevState.cycleNumber + 1,
        player,
        npcs: npcs.filter(npc => npc.health.current > 0), // TO DO add a 'dying' state, do not remove until animation finished / body fades
    }
}