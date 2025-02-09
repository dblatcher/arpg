import { toUnitVector, getVectorFrom } from "../../lib/geometry";
import { REEL_DURATION } from "../constants";
import { GameCharacter, FeedbackEventEventType } from "../types";


export const handlePlayerNpcCollisions = (
    player: GameCharacter,
    collidedNpc: GameCharacter,
    playerWasReelingAtStart: boolean,
    addFeedback: { (type: FeedbackEventEventType): void }
) => {

    if (collidedNpc.dying || player.reeling) {
        return
    }

    const unitVector = toUnitVector(getVectorFrom(collidedNpc, player))
    player.reeling = {
        duration: REEL_DURATION / 2,
        remaining: REEL_DURATION / 2,
        direction: 'Up',
        unitVector,
    }
    // if the player was reeling at the start of the cycle, make them reel again,
    // but do not take another point of health
    if (!playerWasReelingAtStart) {
        player.health.current = player.health.current - 1
        addFeedback('player-hit')
    }
}
