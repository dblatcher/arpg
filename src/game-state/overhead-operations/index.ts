import { progressCharacterStatus } from "../shared-operations/character-status"
import { FeedbackEventEventType, GameCharacter, GameState, InputState, OverheadLevel } from "../types"
import { findInteractionTarget, handleInteraction } from "./interactions"
import { attemptMove } from "./movement"
import { updateNpc } from "./npc-automation"
import { updatePlayer } from "./overhead-update-player"
import { findNpcsHitByPlayerAttack, getAttackZone, handlePlayerAttackHits } from "./player-attacks"
import { handlePlayerNpcCollisions } from "./player-damage"



export const runOverheadLevel = (
    level: OverheadLevel,
    state: GameState,
    player: GameCharacter,
    inputs: InputState,
    addFeedback: { (event: FeedbackEventEventType): void }
) => {

    const { npcs } = level

    updatePlayer(player, inputs, addFeedback)
    if (inputs.interactDown) {
        const target = findInteractionTarget(player, level);
        if (target) {
            handleInteraction(target)
        }
    }
    const playerWasReelingAtStart = !!player.reeling
    progressCharacterStatus(player, addFeedback, true)
    const { collidedNpc, wasPlayerAndNpcInContact } = attemptMove(player, level, state, true)
    if (collidedNpc) {
        handlePlayerNpcCollisions(player, collidedNpc, playerWasReelingAtStart, wasPlayerAndNpcInContact, addFeedback)
    }
    // TO DO - how does the application react to player death?

    const attackZone = player.attack && getAttackZone(player);
    if (attackZone) {
        // game thinking - do not want to deal with player attacking friendlies
        const hitNpcs = findNpcsHitByPlayerAttack(npcs.filter(npc => !npc.safe), attackZone)
        hitNpcs.forEach(npc => {
            handlePlayerAttackHits(npc, state)
            addFeedback('npc-hit')
        })
    }

    npcs.forEach(npc => {
        progressCharacterStatus(npc, addFeedback)
        updateNpc(npc, state)
        const { collidesWithPlayer } = attemptMove(npc, level, state)
        if (collidesWithPlayer) {
            handlePlayerNpcCollisions(player, npc, playerWasReelingAtStart, undefined, addFeedback)
        }
    })
}
