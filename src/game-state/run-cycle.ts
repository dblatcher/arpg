import { doRectsIntersect } from "../lib/geometry"
import { ATTACK_DURATION } from "./constants"
import { getDirection, spaceToRect } from "./helpers"
import { progressCharacterStatus } from "./operations/character-status"
import { attemptMove } from "./operations/movement"
import { updateNpc } from "./operations/npc-automation"
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "./operations/player-attacks"
import { handlePlayerNpcCollisions } from "./operations/player-damage"
import { FeedbackEvent, GameCharacter, GameState, InputState, FeedbackEventEventType } from "./types"


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
        return
    }
    player.vector = { xd, yd }
    return
}


export const runCycle = (state: GameState, inputs: InputState): GameState => {
    const newEvents: FeedbackEvent[] = []
    const player = structuredClone(state.player)
    const level = structuredClone(state.levels[state.currentLevelIndex])
    const cycleNumber = state.cycleNumber

    const addFeedback = (type: FeedbackEventEventType) => newEvents.push({ type, cycleNumber })

    const playerRect = spaceToRect(player)
    const exit = level.exits.find(exit => doRectsIntersect(spaceToRect(exit), playerRect))
    if (exit) {
        return {
            ...state,
            currentLevelIndex: exit.destination.levelIndex,
            player: { ...player, x: exit.destination.x, y: exit.destination.y }
        }
    }

    const { npcs } = level
    updatePlayer(player, inputs, cycleNumber, newEvents)
    const playerWasReelingAtStart = !!player.reeling
    progressCharacterStatus(player, addFeedback)
    const { collidedNpc } = attemptMove(player, state, true)

    if (collidedNpc) {
        handlePlayerNpcCollisions(player, collidedNpc, playerWasReelingAtStart, addFeedback)
    }
    // TO DO - how does the application react to player death?

    const attackZone = getAttackZone(player)
    if (attackZone) {
        const hitNpcs = findNpcsHitByPlayerAttack(npcs, attackZone)
        hitNpcs.forEach(npc => {
            handlePlayerAttackHits(npc, state)
            addFeedback('npc-hit')
        })
    }

    npcs.forEach(npc => {
        progressCharacterStatus(npc, addFeedback)
        updateNpc(npc, state)
        const { collidesWithPlayer } = attemptMove(npc, state)
        if (collidesWithPlayer) {
            handlePlayerNpcCollisions(player, npc, playerWasReelingAtStart, addFeedback)
        }
    })

    const feedbackEvents = [...state.feedbackEvents, ...newEvents]

    level.npcs = npcs.filter(npc => !npc.dying || npc.dying.remaining > 0)

    return {
        ...state,
        feedbackEvents,
        cycleNumber: cycleNumber + 1,
        player,
        levels: [...state.levels.slice(0, state.currentLevelIndex), level, ...state.levels.slice(state.currentLevelIndex + 1)],
    }
}