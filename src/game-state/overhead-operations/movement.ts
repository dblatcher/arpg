import { translate, doRectsIntersect, XY } from "../../lib/geometry";
import { BASE_REEL_SPEED, TILE_SIZE } from "../constants";
import { spaceToRect } from "../helpers";
import { detectCharacterCollision } from "../shared-operations/character-collisions";
import { GameCharacter, GameState, OverheadLevel, SceneryCondition, Tile, Traversability } from "../types";

const getTile = (character: GameCharacter, level: OverheadLevel): Tile | undefined => {
    const yt = Math.floor((character.y + (character.height / 2)) / TILE_SIZE);
    const xt = Math.floor((character.x + (character.width / 2)) / TILE_SIZE);

    try {
        return level.tileMap[yt][xt];
    } catch {
        return undefined
    }
}

export const attemptMove = (
    character: GameCharacter,
    level: OverheadLevel,
    state: GameState,
    isPlayer = false
): { collidedNpc?: GameCharacter, collidesWithPlayer: boolean, wasPlayerAndNpcInContact: boolean } => {

    // game thinking
    // characters don't move while attacking
    // might want to revise that or have other types
    // of attack that involve movement (charge?)
    if (character.attack && !character.reeling) {
        return {
            collidesWithPlayer: false,
            wasPlayerAndNpcInContact: false,
        }
    }

    const vector = (character.reeling || character.dying)
        ? reelVector(character)
        : {
            x: character.vector.xd * character.speed,
            y: character.vector.yd * character.speed
        }

    const newPosition = translate(character, vector);
    // TO DO - bind new position by edge of map? 
    // detect player walking off to next screen?

    const newPositionRect = spaceToRect({ ...character, ...newPosition });
    const collidedObstacle =
        level.tileObstacles
            .find(obstacle => doRectsIntersect(spaceToRect(obstacle), newPositionRect)) ||
        level.scenery
            .filter(item => item.traversabilityMap[item.condition ?? SceneryCondition.Base] === Traversability.Blocking)
            .find(obstacle => doRectsIntersect(spaceToRect(obstacle), newPositionRect))

    const { collidedNpc, wereNpcsAlreadyInContact, collidesWithPlayer, wasPlayerAndNpcInContact } = detectCharacterCollision({ ...character, ...newPosition }, character, level, state, isPlayer)



    if (!collidedObstacle && !(collidedNpc && !wereNpcsAlreadyInContact) && !(collidesWithPlayer && !wasPlayerAndNpcInContact)) {
        character.x = newPosition.x
        character.y = newPosition.y
        character.currentTile = getTile(character, level);
    }
    return { collidedNpc, collidesWithPlayer, wasPlayerAndNpcInContact }
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

