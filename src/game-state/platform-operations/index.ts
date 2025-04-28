import { getVectorFrom } from "../../lib/geometry";
import { ATTACK_DURATION } from "../constants";
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "../overhead-operations/player-attacks";
import { progressCharacterStatus } from "../shared-operations/character-status";
import { AddFeedbackFunc, FeedbackEventEventType, GameCharacter, GameState, InputState, PlatformLevel } from "../types"
import { getAltitudeAndFloorLevel, followGravity } from "./gravity"
import { attemptPlatformMovement } from "./movement"
import { updateNpc } from "./npc-automation";


const handleInputs = (player: GameCharacter, inputs: InputState, addFeedback: { (type: FeedbackEventEventType): void; }) => {

    const { xd, attackButton, jumpButton } = inputs

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

    if (!player.attack && jumpButton) {
        if (Math.abs(player.vector.xd) > .5) {
            player.vector.yd = -2
            player.vector.xd = Math.sign(player.vector.xd) * 2
        } else {
            player.vector.yd = -3
            player.vector.xd = Math.sign(player.vector.xd) * 1
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


const handlePlayerNpcCollision = (player: GameCharacter, collidedNpc: GameCharacter, addFeedback: AddFeedbackFunc) => {
    if (player.reeling || collidedNpc.dying) {
        return
    }
    player.reeling = {
        remaining: 30,
        duration: 30,
        direction: 'Up',
        unitVector: { x: 0, y: 1 }
    }
    player.vector.yd = 2 * Math.sign(player.y - collidedNpc.y);
    player.vector.xd = 1 * Math.sign(player.x - collidedNpc.x);
    player.health.current = player.health.current - 1
    addFeedback('player-hit')
}

export const runPlatformLevel = (level: PlatformLevel, state: GameState, player: GameCharacter, inputs: InputState, addFeedback: AddFeedbackFunc) => {
    const { floorLevel } = getAltitudeAndFloorLevel(player, level)

    handleInputs(player, inputs, addFeedback)
    followGravity(player)
    progressCharacterStatus(player, addFeedback)
    const { collidedNpc } = attemptPlatformMovement(player, level, state, floorLevel, true, addFeedback)

    if (collidedNpc) {
        handlePlayerNpcCollision(player, collidedNpc, addFeedback);
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
        })
    }

    npcs.forEach(npc => {
        const { floorLevel } = getAltitudeAndFloorLevel(npc, level)
        updateNpc(npc,floorLevel, state)
        progressCharacterStatus(npc, addFeedback)
        followGravity(npc)
        // TO DO - use reeling in attemptPlatformMovement
        const { collidesWithPlayer } = attemptPlatformMovement(npc, level, state, floorLevel, false, addFeedback)
        if (collidesWithPlayer) {
            handlePlayerNpcCollision(player, npc, addFeedback)
        }
    })
}