import { doRectsIntersect } from "typed-geometry";
import { spaceToRect } from "../helpers";
import { GameCharacter, GameState, Level, Space } from "../types";

export const detectCharacterCollision = (
    newPosition: Space,
    character: GameCharacter,
    level: Level,
    state: GameState,
    isPlayer: boolean,
): {
    wereNpcsAlreadyInContact: boolean;
    collidedNpc: GameCharacter | undefined;
    collidesWithPlayer: boolean;
    wasPlayerAndNpcInContact: boolean;
} => {

    if (character.collisionsOff) {
        return {
            wereNpcsAlreadyInContact: false,
            collidedNpc: undefined,
            collidesWithPlayer: false,
            wasPlayerAndNpcInContact: false
        }
    }

    const newPositionRect = spaceToRect(newPosition)
    const ignoreNpcCollisions = !isPlayer && (character.reeling || character.dying)
    const collidedNpc = ignoreNpcCollisions ? undefined : level.npcs.filter(npc => !npc.dying && !npc.collisionsOff).find(npc => npc.id !== character.id && doRectsIntersect(spaceToRect(npc), newPositionRect))
    const wereNpcsAlreadyInContact = !isPlayer && !!collidedNpc && doRectsIntersect(spaceToRect(collidedNpc), spaceToRect(character))
    const collidesWithPlayer = isPlayer ? false : state.player.collisionsOff ? false : doRectsIntersect(spaceToRect(state.player), newPositionRect)
    
    const wasPlayerAndNpcInContact = isPlayer 
        ? !!collidedNpc && doRectsIntersect(spaceToRect(collidedNpc), spaceToRect(character))
        : collidesWithPlayer && doRectsIntersect(spaceToRect(state.player), spaceToRect(character))

    return { wereNpcsAlreadyInContact, collidedNpc, collidesWithPlayer, wasPlayerAndNpcInContact }
}