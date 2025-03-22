import { hasXOverlap, highestSpaceFirst } from "../helpers";
import { GameCharacter, PlatformLevel } from "../types";

export const getAltitudeAndFloorLevel = (
    character: GameCharacter,
    level: PlatformLevel,
) => {

    const platformsBelow = level.platforms.filter((platform) => platform.y > character.y)

    // TO DO - coyote time?

    const platformsDirectlyUnder = platformsBelow.filter(
        platform => hasXOverlap(character, platform)
    ).sort(highestSpaceFirst)

    const floorLevel = platformsDirectlyUnder.length ? platformsDirectlyUnder[0]?.y : undefined;
    const altitude = floorLevel ? floorLevel - (character.y + character.height) : Infinity
    return { floorLevel, altitude }
}

export const fallOrStayOnGround = (altitude: number, character: GameCharacter) => {
    if (altitude > 0) {
        character.vector.yd += .1
    } else {
        character.vector.yd = Math.min(0, character.vector.yd)
    }
}
