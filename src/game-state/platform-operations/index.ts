import { ATTACK_DURATION } from "../constants";
import { progressCharacterStatus } from "../shared-operations/character-status";
import { FeedbackEventEventType, GameCharacter, GameState, InputState, PlatformLevel } from "../types"
import { getAltitudeAndFloorLevel, fallOrStayOnGround } from "./gravity"
import { attemptPlatformMovement } from "./movement"


const handleInputs = (player: GameCharacter, inputs: InputState, addFeedback: { (type: FeedbackEventEventType): void; }) => {

    const { xd, yd, attackButton } = inputs

    if (player.altitude <= 0) { // on ground
        
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

    } else {
        fallOrStayOnGround(player)
    }
}


export const runPlatformLevel = (level: PlatformLevel, state: GameState, player: GameCharacter, inputs: InputState, addFeedback: (type: FeedbackEventEventType) => void) => {
    const { floorLevel } = getAltitudeAndFloorLevel(player, level)

    handleInputs(player, inputs, addFeedback)
    progressCharacterStatus(player, addFeedback)
    attemptPlatformMovement(level, floorLevel, player, true, addFeedback)

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
        const { floorLevel } = getAltitudeAndFloorLevel(npc, level)
        fallOrStayOnGround(npc)
        attemptPlatformMovement(level, floorLevel, npc, false, addFeedback)
    })
}