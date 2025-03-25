import { FeedbackEventEventType, GameCharacter, GameState, InputState, PlatformLevel } from "../types"
import { getAltitudeAndFloorLevel, fallOrStayOnGround } from "./gravity"
import { attemptPlatformMovement } from "./movement"


export const runPlatformLevel = (level: PlatformLevel, state: GameState, player: GameCharacter, inputs: InputState, addFeedback: (type: FeedbackEventEventType) => void) => {
    const { floorLevel } = getAltitudeAndFloorLevel(player, level)

    if (player.altitude <= 0) { // on ground
        player.vector.xd = inputs.xd ?? 0
        if (inputs.yd && inputs?.yd < 0) {
            if (Math.abs(player.vector.xd) > .5) {
                player.vector.yd = -2
                player.vector.xd = player.vector.xd * 5
            } else {
                player.vector.yd = -3
                player.vector.xd = player.vector.xd * 3
            }
        }

        switch (Math.sign(inputs.xd ?? 0)) {
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