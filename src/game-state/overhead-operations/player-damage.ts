import { toUnitVector, getVectorFrom } from "../../lib/geometry";
import { REEL_DURATION } from "../constants";
import { getDirection } from "../helpers";
import { GameCharacter, FeedbackEventEventType } from "../types";


export const handlePlayerNpcCollisions = (
    player: GameCharacter,
    collidedNpc: GameCharacter,
    playerWasReelingAtStart: boolean,
    wasPlayerAndNpcInContact: boolean | undefined,
    addFeedback: { (type: FeedbackEventEventType): void }
) => {

    if (collidedNpc.dying || player.reeling) {
        return
    }

    if (collidedNpc.safe) {
        const unitVector = toUnitVector(getVectorFrom(player, collidedNpc))
        const direction = getDirection(unitVector.x, unitVector.y)

        if (collidedNpc.mind.task === 'Wander') {
            collidedNpc.mind.direction = direction
        }
        if (wasPlayerAndNpcInContact) {
            collidedNpc.reeling = {
                duration: REEL_DURATION / 3,
                remaining: REEL_DURATION / 3,
                direction: direction,
                unitVector: { x: unitVector.x, y: unitVector.y }
            }
        }
        return
    }

    const unitVector = toUnitVector(getVectorFrom(collidedNpc, player))
    player.reeling = {
        duration: REEL_DURATION / 2,
        remaining: REEL_DURATION / 2,
        direction: 'Up',
        unitVector,
    }

    collidedNpc.reeling = {
        duration: REEL_DURATION / 2,
        remaining: REEL_DURATION / 2,
        direction: collidedNpc.direction,
        unitVector: { x: -unitVector.x, y: -unitVector.y }
    }
    // if the player was reeling at the start of the cycle, make them reel again,
    // but do not take another point of health
    if (!playerWasReelingAtStart) {
        player.health.current = player.health.current - 1
        addFeedback('player-hit')
    }
}
