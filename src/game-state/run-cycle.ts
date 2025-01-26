import { getVectorFrom, toUnitVector } from "../lib/geometry"
import { ATTACK_DURATION, REEL_DURATION } from "./constants"
import { getDirection } from "./helpers"
import { attemptMove } from "./operations/movement"
import { updateNpc } from "./operations/npc-automation"
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "./operations/player-attacks"
import { GameCharacter, GameState, InputState } from "./types"


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


export const runCycle = (prevState: GameState, inputs: InputState): GameState => {
    const { player, npcs } = prevState

    updatePlayer(player, inputs)
    progressReelingAndAttack(player)
    const { collidedNpc } = attemptMove(player, prevState)

    if (collidedNpc && !player.reeling) {
        const unitVector = toUnitVector(getVectorFrom(collidedNpc, player))
        player.reeling = {
            duration: REEL_DURATION / 2,
            remaining: REEL_DURATION / 2,
            direction: 'Up',
            unitVector,
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
        updateNpc(npc, prevState)
        attemptMove(npc, prevState)
    })

    return {
        ...prevState,
        cycleNumber: prevState.cycleNumber + 1,
        player,
        npcs: npcs.filter(npc => npc.health.current > 0), // TO DO add a 'dying' state, do not remove until animation finished / body fades
    }
}