import { Rect, doRectsIntersect } from "../../lib/geometry";
import { REEL_DURATION } from "../constants";
import { directionToUnitVector, obstacleToRect } from "../helpers";
import { GameCharacter, GameState } from "../types";


export const handlePlayerAttackHits = (npc: GameCharacter, state: GameState): GameCharacter => {
    console.log('hit', state.cycleNumber, state.player.direction)
    npc.reeling = {
        direction: state.player.direction,
        unitVector: directionToUnitVector(state.player.direction),
        duration: REEL_DURATION,
        remaining: REEL_DURATION,
    }
    npc.health.current = npc.health.current - 1
    return npc
};

export const findNpcsHitByPlayerAttack = (npcs: GameCharacter[], attackZone: Rect): GameCharacter[] => {
    // TO DO - check doRectsIntersect works for exact matches
    // MAYBE - use find instead of filter as minor optimisation - don't need to catch every npc on first cycle?
    return npcs.filter(npc => !npc.reeling && doRectsIntersect(attackZone, obstacleToRect(npc)))
};


const shiftZoneFromCharacter = (scalar: number, characterDimension: number, zoneDimension: number) => {
    if (scalar === 0) { return 0} 
    if (scalar > 0) { return characterDimension * Math.sign(scalar)} 
    return zoneDimension * Math.sign(scalar)
}

export const getAttackZone = (character: GameCharacter): (Rect & { width: number; height: number} ) | undefined => {
    const { attack, direction } = character
    if (!attack) {
        return undefined
    }
    const attackVector = directionToUnitVector(direction)
    const zoneDims = attackVector.x
        ? { width: character.width * .5, height: character.height }
        : { width: character.width, height: character.height * .5 }
    const zonePos = {
        left: character.x + shiftZoneFromCharacter(attackVector.x, character.width, zoneDims.width),
        top: character.y + shiftZoneFromCharacter(attackVector.y, character.height, zoneDims.height),
    }

    return {
        ...zonePos,
        right: zonePos.left + zoneDims.width,
        bottom: zonePos.top + zoneDims.height,
        ...zoneDims,
    }
}

