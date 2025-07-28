import { Rect, XY, doRectsIntersect, getDistance } from "typed-geometry";
import { REEL_DURATION } from "../constants";
import { directionToUnitVector, getCurrentLevel, spaceToRect } from "../helpers";
import { GameCharacter, GameState } from "../types";


export const handlePlayerAttackHits = (npc: GameCharacter, state: GameState) => {
    npc.health.current = npc.health.current - 1
    if (npc.health.current <= 0) {
        state.score += npc.pointsForKilling ?? 0;
        npc.dying = {
            duration: REEL_DURATION,
            remaining: REEL_DURATION,
            unitVector: directionToUnitVector(state.player.direction),
        }
        return
    }

    // TO DO - belongs in the automation module
    npc.mind.hostile = true;
    if (npc.mind.task === 'Guard') {
        const level = getCurrentLevel(state);
        const otherNearbyGuards = level?.npcs.filter(otherNpc =>
            !otherNpc.safe && otherNpc !== npc && otherNpc.mind.task === 'Guard' && getDistance(otherNpc, npc) < 400
        );
        otherNearbyGuards?.forEach(otherNpc => otherNpc.mind.hostile = true)
    }

    npc.reeling = {
        direction: state.player.direction,
        unitVector: directionToUnitVector(state.player.direction),
        duration: REEL_DURATION,
        remaining: REEL_DURATION,
    }
};

export const findNpcsHitByPlayerAttack = (npcs: GameCharacter[], attackZone: Rect): GameCharacter[] => {
    // MAYBE - use find instead of filter as minor optimisation - don't need to catch every npc on first cycle?
    return npcs.filter(npc => !npc.reeling && !npc.dying && doRectsIntersect(attackZone, spaceToRect(npc)))
};


const shiftZoneFromCharacter = (scalar: number, characterDimension: number, zoneDimension: number) => {
    if (scalar === 0) { return 0 }
    if (scalar > 0) { return characterDimension * Math.sign(scalar) }
    return zoneDimension * Math.sign(scalar)
}

const adjustZoneTop = (attackVector: XY, character: GameCharacter): number => {
    if (!attackVector.x) {
        return 0
    }
    return - character.height * .1
}
const adjustZoneLeft = (attackVector: XY, character: GameCharacter): number => {
    if (!attackVector.y) {
        return 0
    }
    return - character.width * .1
}

export const getAttackZone = (character: GameCharacter): (Rect & { width: number; height: number }) => {
    const { direction } = character
    const attackVector = directionToUnitVector(direction)
    const zoneDims = attackVector.x
        ? { width: character.width * .3, height: character.height * 1.2 }
        : { width: character.width * 1.2, height: character.height * .3 }
    const zonePos = {
        left: character.x + shiftZoneFromCharacter(attackVector.x, character.width, zoneDims.width) + adjustZoneLeft(attackVector, character),
        top: character.y + shiftZoneFromCharacter(attackVector.y, character.height, zoneDims.height) + adjustZoneTop(attackVector, character),
    }

    return {
        ...zonePos,
        right: zonePos.left + zoneDims.width,
        bottom: zonePos.top + zoneDims.height,
        ...zoneDims,
    }
}

