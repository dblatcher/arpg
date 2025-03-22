import { doRectsIntersect } from "../lib/geometry"
import { spaceToRect } from "./helpers"
import { progressCharacterStatus } from "./operations/character-status"
import { attemptMove } from "./operations/movement"
import { updateNpc } from "./operations/npc-automation"
import { updatePlayer } from "./operations/overhead-update-player"
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "./operations/player-attacks"
import { handlePlayerNpcCollisions } from "./operations/player-damage"
import { fallOrStayOnGround, getAltitudeAndFloorLevel } from "./platform-operations/gravity"
import { attemptPlatformMovement } from "./platform-operations/movement"
import { FeedbackEvent, FeedbackEventEventType, GameCharacter, GameState, InputState, PlatformLevel } from "./types"

const runPlatformLevel = (level: PlatformLevel, state: GameState, player: GameCharacter, inputs: InputState) => {

    const { altitude, floorLevel } = getAltitudeAndFloorLevel(player, level)


    if (altitude <= 0) { // on ground
        player.vector.xd = inputs.xd ?? 0
        if (inputs.yd && inputs?.yd < 0) {
            player.vector.yd = -3
            player.vector.xd = player.vector.xd * 3
        }

    } else {
        fallOrStayOnGround(altitude, player)
    }

    attemptPlatformMovement(level, altitude, floorLevel, player)

    if (player.y > state.mapHeight) {
        player.health.current = 0
        player.dying = {
            remaining: 10,
            duration: 10,
            unitVector: { x: 0, y: 1 }
        }
    }

    const { npcs } = level

    npcs.forEach(npc => {
        const { altitude, floorLevel } = getAltitudeAndFloorLevel(npc, level)
        fallOrStayOnGround(altitude, npc)
        attemptPlatformMovement(level, altitude, floorLevel, npc)
    })

}


export const runCycle = (state: GameState, inputs: InputState): GameState => {
    const newEvents: FeedbackEvent[] = []
    const player = structuredClone(state.player)
    const level = structuredClone(state.levels[state.currentLevelIndex])
    const cycleNumber = state.cycleNumber

    const addFeedback = (type: FeedbackEventEventType) => newEvents.push({ type, cycleNumber })

    const playerRect = spaceToRect(player)
    const { npcs } = level

    if (level.levelType === 'platform') {
        runPlatformLevel(level, state, player, inputs)
    } else if (level.levelType === 'overhead') {

        const exit = level.exits.find(exit => doRectsIntersect(spaceToRect(exit), playerRect))
        if (exit) {
            return {
                ...state,
                currentLevelIndex: exit.destination.levelIndex,
                player: { ...player, x: exit.destination.x, y: exit.destination.y }
            }
        }

        updatePlayer(player, inputs, cycleNumber, newEvents)
        const playerWasReelingAtStart = !!player.reeling
        progressCharacterStatus(player, addFeedback)
        const { collidedNpc } = attemptMove(player, level, state, true)
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
            const { collidesWithPlayer } = attemptMove(npc, level, state)
            if (collidesWithPlayer) {
                handlePlayerNpcCollisions(player, npc, playerWasReelingAtStart, addFeedback)
            }
        })
    }

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