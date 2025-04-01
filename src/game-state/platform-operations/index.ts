import { getVectorFrom } from "../../lib/geometry";
import { ATTACK_DURATION } from "../constants";
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "../overhead-operations/player-attacks";
import { progressCharacterStatus } from "../shared-operations/character-status";
import { FeedbackEventEventType, GameCharacter, GameState, InputState, PlatformLevel } from "../types"
import { getAltitudeAndFloorLevel, followGravity } from "./gravity"
import { attemptPlatformMovement } from "./movement"


const handleInputs = (player: GameCharacter, inputs: InputState, addFeedback: { (type: FeedbackEventEventType): void; }) => {

    const { xd, yd, attackButton } = inputs

    if (player.altitude > 0) {
        return
    }

    if (player.attack || player.reeling) {
        return
    }

    if (attackButton) {
        player.vector.xd = 0
        player.attack = {
            duration: ATTACK_DURATION,
            remaining: ATTACK_DURATION,
        }
        addFeedback('attack');
        return
    }

    player.vector.xd = xd ?? 0

    if (!player.attack && yd && yd < 0) {
        if (Math.abs(player.vector.xd) > .5) {
            player.vector.yd = -2
            player.vector.xd = player.vector.xd * 5
        } else {
            player.vector.yd = -3
            player.vector.xd = player.vector.xd * 3
        }
    }

    switch (Math.sign(xd ?? 0)) {
        case -1:
            player.direction = 'Left'
            break
        case 1:
            player.direction = 'Right'
            break
    }
}


export const runPlatformLevel = (level: PlatformLevel, state: GameState, player: GameCharacter, inputs: InputState, addFeedback: (type: FeedbackEventEventType) => void) => {
    const { floorLevel } = getAltitudeAndFloorLevel(player, level)

    handleInputs(player, inputs, addFeedback)
    followGravity(player)
    progressCharacterStatus(player, addFeedback)
    const { collidedNpc } = attemptPlatformMovement(player, level, state, floorLevel, true, addFeedback)

    if (collidedNpc) {
        player.reeling = {
            remaining: 30,
            duration: 30,
            direction: 'Up',
            unitVector: { x: 0, y: 1 }
        }
        player.vector.yd = -2
        player.vector.xd = player.direction === 'Left' ? 1 : -1
        player.health.current = player.health.current - 1
        addFeedback('player-hit')
    }

    if (player.y > state.mapHeight) {
        player.health.current = 0
        player.dying = {
            remaining: 10,
            duration: 10,
            unitVector: { x: 0, y: 1 }
        }
    }

    const { npcs } = level

    const attackZone = getAttackZone(player)
    if (attackZone) {
        const hitNpcs = findNpcsHitByPlayerAttack(npcs, attackZone)



        hitNpcs.forEach(npc => {
            handlePlayerAttackHits(npc, state)
            npc.reeling = {
                remaining: 60,
                duration: 60,
                direction: 'Up',
                unitVector: { x: 0, y: 1 }
            }

            addFeedback('npc-hit')
            const vector = getVectorFrom(player, npc)
            npc.vector.yd = -2
            npc.vector.xd = 1 * Math.sign(vector.x)
            console.log('V', npc.vector)
        })
    }

    npcs.forEach(npc => {
        const { floorLevel } = getAltitudeAndFloorLevel(npc, level)
        progressCharacterStatus(npc, addFeedback)
        followGravity(npc)
        // TO DO - use reeling in attemptPlatformMovement
        attemptPlatformMovement(npc, level, state, floorLevel, false, addFeedback)

        if (npc.altitude <= 0 && npc.vector.xd && !npc.reeling) {
            npc.vector.xd = 0
        }
    })
}