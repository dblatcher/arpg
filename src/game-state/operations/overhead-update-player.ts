import { ATTACK_DURATION } from "../constants";
import { getDirection } from "../helpers";
import { FeedbackEvent, GameCharacter, InputState } from "../types";


export const updatePlayer = (player: GameCharacter, inputs: InputState, cycleNumber: number, newEvents: FeedbackEvent[]) => {
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
