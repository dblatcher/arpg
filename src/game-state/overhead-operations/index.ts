import { OverheadLevel, GameState, GameCharacter, InputState, FeedbackEventEventType } from "../types"
import { progressCharacterStatus } from "../shared-operations/character-status"
import { attemptMove } from "./movement"
import { updateNpc } from "./npc-automation"
import { updatePlayer } from "./overhead-update-player"
import { getAttackZone, findNpcsHitByPlayerAttack, handlePlayerAttackHits } from "./player-attacks"
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
    const playerWasReelingAtStart = !!player.reeling
    progressCharacterStatus(player, addFeedback)
    const { collidedNpc } = attemptMove(player, level, state, true)
    if (collidedNpc) {
        handlePlayerNpcCollisions(player, collidedNpc, playerWasReelingAtStart, addFeedback)
    }
    // TO DO - how does the application react to player death?

    const attackZone = getAttackZone(player)
    if (attackZone) {
        const hitNpcs = findNpcsHitByPlayerAttack(npcs, attackZone)
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
            handlePlayerNpcCollisions(player, npc, playerWasReelingAtStart, addFeedback)
        }
    })
}
