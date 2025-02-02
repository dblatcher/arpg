import { translate, doRectsIntersect, XY } from "../../lib/geometry";
import { BASE_REEL_SPEED } from "../constants";
import { spaceToRect } from "../helpers";
import { GameCharacter, GameState } from "../types";


export const attemptMove = (character: GameCharacter, state: GameState): { character: GameCharacter; collidedNpc?: GameCharacter } => {

    // game thinking
    // characters don't move while attacking
    // might want to revise that or have other types
    // of attack that involve movement (charge?)
    if (character.attack && !character.reeling) {
        return {
            character
        }
    }

    const vector = (character.reeling || character.dying)
        ? reelVector(character)
        : {
            x: character.vector.xd * character.speed,
            y: character.vector.yd * character.speed
        }

    const newPosition = translate(character, vector)
    // TO DO - bind new position by edge of map? 
    // detect player walking off to next screen?
    const newPositionRect = spaceToRect({ ...character, ...newPosition })
    const collidedObstacle = state.obstacles.find(obstacle => doRectsIntersect(spaceToRect(obstacle), newPositionRect))
    const collidedNpc = state.npcs.find(npc => npc.id !== character.id && doRectsIntersect(spaceToRect(npc), newPositionRect))
    if (!collidedObstacle && !collidedNpc) {
        character.x = newPosition.x
        character.y = newPosition.y
    }
    return { character, collidedNpc }
};

export const reelVector = (character: GameCharacter): XY => {
    const { reeling, dying } = character
    const reelingOrDying = reeling || dying;
    if (!reelingOrDying) {
        return { x: 0, y: 0 }
    }
    const speed = BASE_REEL_SPEED * (reelingOrDying.remaining) / reelingOrDying.duration
    return {
        x: reelingOrDying.unitVector.x * speed,
        y: reelingOrDying.unitVector.y * speed,
    }
}

