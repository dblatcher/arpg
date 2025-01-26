import { getVectorFrom, toUnitVector } from "../lib/geometry"
import { ATTACK_DURATION, REEL_DURATION } from "./constants"
import { getDirection } from "./helpers"
import { attemptMove } from "./operations/movement"
import { updateNpc } from "./operations/npc-automation"
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "./operations/player-attacks"
import { FeedbackEvent, GameCharacter, GameState, InputState } from "./types"


const progressReelingAndAttack = (character: GameCharacter, cycleNumber: number, newEvents: FeedbackEvent[]) => {
    if (character.reeling) {
        character.reeling.remaining -= 1
        if (character.reeling.remaining <= 0) {
            newEvents.push({ type: 'reel-end', cycleNumber })
            delete character.reeling
            delete character.attack
        }
        return true
    }

    if (character.attack) {
        character.attack.remaining -= 1
        if (character.attack.remaining <= 0) {
            newEvents.push({ type: 'attack-end', cycleNumber })
            delete character.attack
        }
        return true
    }
    return false
}

const updatePlayer = (player: GameCharacter, inputs: InputState, cycleNumber: number, newEvents: FeedbackEvent[]) => {
    if (player.attack || player.reeling) {
        return
    }

    if (player.health.current <= 0) {
        player.vector = { xd: 0, yd: 0 }
        return
    }

    const { xd = 0, yd = 0, attackButton } = inputs;
    player.direction = xd || yd ? getDirection(xd, yd) : player.direction;
    if (attackButton) {
        player.attack = {
            duration: ATTACK_DURATION,
            remaining: ATTACK_DURATION,
        }
        newEvents.push({ type: 'attack', cycleNumber })
        newEvents.push({ type: 'attack2', cycleNumber })
        return
    }
    player.vector = { xd, yd }
    return
}


export const runCycle = (state: GameState, inputs: InputState): GameState => {
    const newEvents: FeedbackEvent[] = []
    const player = structuredClone(state.player)
    const npcs = structuredClone(state.npcs)

    updatePlayer(player, inputs, state.cycleNumber, newEvents)
    progressReelingAndAttack(player, state.cycleNumber, newEvents)
    const { collidedNpc } = attemptMove(player, state)

    if (collidedNpc && !player.reeling) {
        const unitVector = toUnitVector(getVectorFrom(collidedNpc, player))
        player.reeling = {
            duration: REEL_DURATION / 2,
            remaining: REEL_DURATION / 2,
            direction: 'Up',
            unitVector,
        }
        player.health.current = player.health.current - 1
        newEvents.push({ type: 'player-death', cycleNumber: state.cycleNumber })
    }
    // TO DO - how does the application react to player death?

    const attackZone = getAttackZone(player)
    if (attackZone) {
        const hitNpcs = findNpcsHitByPlayerAttack(npcs, attackZone)
        hitNpcs.forEach(npc => handlePlayerAttackHits(npc, state))
    }

    npcs.forEach(npc => {
        progressReelingAndAttack(npc, state.cycleNumber, newEvents)
        updateNpc(npc, state)
        attemptMove(npc, state)
    })

    const feedbackEvents = [...state.feedbackEvents, ...newEvents]

    return {
        ...state,
        feedbackEvents,
        cycleNumber: state.cycleNumber + 1,
        player,
        npcs: npcs.filter(npc => npc.health.current > 0), // TO DO add a 'dying' state, do not remove until animation finished / body fades
    }
}