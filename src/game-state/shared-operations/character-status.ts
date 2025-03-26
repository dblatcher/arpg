import { GameCharacter, FeedbackEventEventType } from "../types";


export const progressCharacterStatus = (
    character: GameCharacter,
    addFeedback: { (type: FeedbackEventEventType): void }
) => {

    if (character.dying) {
        character.dying.remaining -= 1
        delete character.attack
        return
    }

    if (character.reeling) {
        character.reeling.remaining -= 1
        if (character.reeling.remaining <= 0) {
            addFeedback('reel-end')
            delete character.reeling
            delete character.attack
        }
        return true
    }

    if (character.attack) {
        character.attack.remaining -= 1
        if (character.attack.remaining <= 0) {
            addFeedback('attack-end')
            delete character.attack
        }
        return true
    }
    return false
}
