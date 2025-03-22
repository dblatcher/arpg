import { hasXOverlap, hasYOverlap, lowestSpaceFirst } from "../helpers";
import { GameCharacter, PlatformLevel, Space } from "../types";

export const attemptPlatformMovement = (level: PlatformLevel, _altitude: number, floorLevel = Infinity, character: GameCharacter) => {
    const { platforms } = level
    const afterYMovement: Space = {
        x: character.x,
        y: character.y + character.vector.yd,
        width: character.width,
        height: character.height,
    }

    // if going up, check for ceilings above
    if (character.vector.yd < 0) {
        const lowestPlatformAbove = platforms
            .filter(platform => platform.y < (floorLevel) && hasXOverlap(afterYMovement, platform))
            .sort(lowestSpaceFirst)
            .shift()

        if (lowestPlatformAbove) {
            const ceiling = lowestPlatformAbove.y + lowestPlatformAbove.height
            const wouldHitCeiling = afterYMovement.y < ceiling
            if (wouldHitCeiling) {
                afterYMovement.y = ceiling
                character.vector.yd = 0
            }
        }
    }

    // character must not fall through floor
    const floorAdjustedForHeight = (floorLevel ?? Infinity) - character.height;
    if (afterYMovement.y > floorAdjustedForHeight) {
        afterYMovement.y = floorAdjustedForHeight
    }
    character.y = afterYMovement.y

    const afterXMovement: Space = {
        x: character.x + character.vector.xd,
        y: character.y,
        width: character.width,
        height: character.height,
    }

    // are there platforms blocking x movement?
    const platformsBlockingXMovement = platforms
        .filter(platform =>
            platform.y < floorLevel &&
            hasYOverlap(platform, afterXMovement) &&
            hasXOverlap(platform, afterXMovement)
        )

    if (!platformsBlockingXMovement.length) {
        character.x = afterXMovement.x
    }
}