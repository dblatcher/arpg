import { SoundDeck } from "sound-deck";
import { FeedbackEvent } from "../game-state";

const rumble = (gamePad: Gamepad | undefined, params: GamepadEffectParameters & { duration: number }) => {
    // should return early if method not supported 
    const playEffect = gamePad?.vibrationActuator.playEffect;
    if (!playEffect) {
        return
    }
    const paramsWithDefaults: GamepadEffectParameters = {
        strongMagnitude: 1,
        weakMagnitude: .1,
        ...params,
    }
    gamePad?.vibrationActuator.playEffect('dual-rumble', paramsWithDefaults)
}

export const runFeedback = (feedback: FeedbackEvent[], soundDeck: SoundDeck, gamePad?: Gamepad): FeedbackEvent[] => {

    feedback.forEach(event => {
        switch (event.type) {
            case "attack":
                rumble(gamePad, { duration: 200, strongMagnitude: .2 })
                soundDeck.playNoise({ duration: .1, frequency: 1000 }, { volume: .1 })
                break
            case "npc-hit":
                soundDeck.playTone({ duration: .2, frequency: 300, endFrequency: 100, type: 'triangle' }, { volume: .2 })
                break
            case "attack-end":
                break
            case "reel-end":
                break
            case "player-land":
                rumble(gamePad, { duration: 150, strongMagnitude: .8, weakMagnitude: .5 })
                soundDeck.playNoise({ duration: .05, frequency: 300 }, { volume: .1 })
                break
            case "player-hit":
                rumble(gamePad, { duration: 500, strongMagnitude: .8, weakMagnitude: .5 })
                soundDeck.playTone({ duration: .2, frequency: 300, endFrequency: 100, type: 'triangle' }, { volume: .2 })
                break
        }
    })
    // TO DO - may want to defer events - eg 2 npc hit in same cycle, start one next cycle.
    return []
}