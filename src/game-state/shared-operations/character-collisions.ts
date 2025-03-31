import { doRectsIntersect } from "../../lib/geometry";
import { spaceToRect } from "../helpers";
import { GameCharacter, GameState, Level, Space } from "../types";

export const detectCharacterCollision = (
    newPosition: Space,
    character: GameCharacter,
    level: Level,
    state: GameState,
    isPlayer: boolean,
) => {
  
    const newPositionRect = spaceToRect(newPosition)
    const ignoreNpcCollisions = !isPlayer && (character.reeling || character.dying)
    const collidedNpc = ignoreNpcCollisions ? undefined : level.npcs.filter(npc => !npc.dying).find(npc => npc.id !== character.id && doRectsIntersect(spaceToRect(npc), newPositionRect))
    const wereNpcsAlreadyInContact = !isPlayer && !!collidedNpc && doRectsIntersect(spaceToRect(collidedNpc), spaceToRect(character))
    const collidesWithPlayer = isPlayer ? false : doRectsIntersect(spaceToRect(state.player), newPositionRect)

    return { wereNpcsAlreadyInContact, collidedNpc, collidesWithPlayer }
}