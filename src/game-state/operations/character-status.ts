import { GameCharacter, FeedbackEvent } from "../types";


export const progressCharacterStatus = (character: GameCharacter, cycleNumber: number, newEvents: FeedbackEvent[]) => {

    if (character.dying) {
        character.dying.remaining -= 1
        delete character.attack
        return
    }

    if (character.reeling) {
        character.reeling.remaining -= 1
        if (character.reeling.remaining <= 0) {
            newEvents.push({ type: 'reel-end', cycleNumber })
            delete character.reeling
            delete character.attack
        }
        return true
    }

    if (character.attack) {
        character.attack.remaining -= 1
        if (character.attack.remaining <= 0) {
            newEvents.push({ type: 'attack-end', cycleNumber })
            delete character.attack
        }
        return true
    }
    return false
}
