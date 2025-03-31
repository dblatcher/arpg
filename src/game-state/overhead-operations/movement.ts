import { translate, doRectsIntersect, XY } from "../../lib/geometry";
import { BASE_REEL_SPEED } from "../constants";
import { spaceToRect } from "../helpers";
import { detectCharacterCollision } from "../shared-operations/character-collisions";
import { GameCharacter, GameState, OverheadLevel } from "../types";


export const attemptMove = (
    character: GameCharacter,
    level: OverheadLevel,
    state: GameState,
    isPlayer = false
): {collidedNpc?: GameCharacter, collidesWithPlayer: boolean } => {

    // game thinking
    // characters don't move while attacking
    // might want to revise that or have other types
    // of attack that involve movement (charge?)
    if (character.attack && !character.reeling) {
        return {
            collidesWithPlayer: false
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
    const collidedObstacle = level.obstacles.find(obstacle => doRectsIntersect(spaceToRect(obstacle), newPositionRect))

    const { collidedNpc, wereNpcsAlreadyInContact, collidesWithPlayer } = detectCharacterCollision({ ...character, ...newPosition }, character, level, state, isPlayer)

    if (!collidedObstacle && !(collidedNpc && !wereNpcsAlreadyInContact) && !collidesWithPlayer) {
        character.x = newPosition.x
        character.y = newPosition.y
    }
    return { collidedNpc, collidesWithPlayer }
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

