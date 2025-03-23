import { hasXOverlap, highestSpaceFirst } from "../helpers";
import { GameCharacter, PlatformLevel } from "../types";

export const getAltitudeAndFloorLevel = (
    character: GameCharacter,
    level: PlatformLevel,
) => {
    const footLevel = character.y + character.height;
    const platformsBelow = level.platforms
        .filter((platform) => platform.y >= footLevel)
        .filter(platform => hasXOverlap(character, platform))
        .sort(highestSpaceFirst);

    // TO DO - coyote time?
    const floorPlatform = platformsBelow.shift()
    const floorLevel = floorPlatform?.y;

    character.altitude = floorLevel ? floorLevel - footLevel : Infinity
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
