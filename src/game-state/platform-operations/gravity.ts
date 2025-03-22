import { hasXOverlap, highestSpaceFirst } from "../helpers";
import { GameCharacter, PlatformLevel } from "../types";

export const getAltitudeAndFloorLevel = (
    character: GameCharacter,
    level: PlatformLevel,
) => {
    const platformsBelow = level.platforms.filter((platform) => platform.y > character.y)

    // TO DO - coyote time?
    const platformsDirectlyUnder = platformsBelow
        .filter(platform => hasXOverlap(character, platform))
        .sort(highestSpaceFirst)

    const floorLevel = platformsDirectlyUnder.length ? platformsDirectlyUnder[0]?.y : undefined;
    character.altitude = floorLevel ? floorLevel - (character.y + character.height) : Infinity
    return { floorLevel }
}

export const fallOrStayOnGround = (character: GameCharacter) => {
    if (character.altitude > 0) {
        character.vector.yd += .1 // gravity pulling downwards
        if (character.vector.xd) {
            // air resistance slowing lateral movement
            const newAbs = Math.max(0, Math.abs(character.vector.xd) - .01)
            character.vector.xd = newAbs * Math.sign(character.vector.xd)
        }
    } else {
        character.vector.yd = Math.min(0, character.vector.yd)
    }
}
