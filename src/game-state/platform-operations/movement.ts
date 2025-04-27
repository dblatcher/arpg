import { hasXOverlap, hasYOverlap, lowestSpaceFirst } from "../helpers";
import { detectCharacterCollision } from "../shared-operations/character-collisions";
import { FeedbackEventEventType, GameCharacter, GameState, PlatformLevel, Space } from "../types";

export const attemptPlatformMovement = (
    character: GameCharacter,
    level: PlatformLevel,
    state: GameState,
    floorLevel = Infinity,
    isPlayer: boolean,
    addFeedback: ((type: FeedbackEventEventType) => void),
): { collidedNpc?: GameCharacter, collidesWithPlayer: boolean } => {
    const { platforms } = level
    const { vector } = character
    const afterYMovement: Space = {
        x: character.x,
        y: character.y + vector.yd,
        width: character.width,
        height: character.height,
    }

    // if going up, check for ceilings above
    if (vector.yd < 0) {
        const lowestPlatformAbove = platforms
            .filter(platform => platform.blocking && platform.y < (floorLevel) && hasXOverlap(afterYMovement, platform))
            .sort(lowestSpaceFirst)
            .shift()

        if (lowestPlatformAbove) {
            const ceiling = lowestPlatformAbove.y + lowestPlatformAbove.height
            if (afterYMovement.y < ceiling) { //would pass ceiling
                afterYMovement.y = ceiling
                vector.yd = 0
            }
        }
    }

    // character must not fall through floor
    // when going down
    if (vector.yd > 0) {
        const floorAdjustedForHeight = (floorLevel ?? Infinity) - character.height;
        if (afterYMovement.y > floorAdjustedForHeight) { //would pass floor
            if (isPlayer) {
                addFeedback('player-land')
            }
            vector.yd = 0
            afterYMovement.y = floorAdjustedForHeight
        }
    }
    character.y = afterYMovement.y

    const afterXMovement: Space = {
        x: character.x + vector.xd,
        y: character.y,
        width: character.width,
        height: character.height,
    }

    // are there platforms blocking x movement?
    const platformsBlockingXMovement = platforms
        .filter(platform =>
            platform.blocking &&
            platform.y < floorLevel &&
            hasYOverlap(platform, afterXMovement) &&
            hasXOverlap(platform, afterXMovement)
        )

    const { collidedNpc, wereNpcsAlreadyInContact, collidesWithPlayer } = detectCharacterCollision(afterXMovement, character, level, state, isPlayer)

    if (!platformsBlockingXMovement.length && !(collidedNpc && !wereNpcsAlreadyInContact) && !collidesWithPlayer) {
        character.x = afterXMovement.x
    }

    return { collidedNpc, collidesWithPlayer }
}