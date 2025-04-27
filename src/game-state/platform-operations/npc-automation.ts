import { Direction } from "@dblatcher/sprite-canvas";
import { getCurrentLevel, getDirection, hasXOverlap, leftEdgeOf, rightEdgeOf } from "../helpers";
import { GameCharacter, GameState, PlatformLevel } from "../types";


const otherWay = (direction: Direction): Direction => direction === 'Left' ? 'Right' : 'Left'

const platformAhead = (direction: Direction, npc: GameCharacter, floorLevel: number | undefined, level: PlatformLevel) => {
    const edge = direction === 'Left' ? leftEdgeOf(npc) : rightEdgeOf(npc)
    return level.platforms
        .filter(platform => platform.y === floorLevel)
        .find(platform => hasXOverlap(platform, edge))
}


const goBackAndForwards = (npc: GameCharacter, floorLevel: number | undefined, level: PlatformLevel) => {
    const direction = npc.mind.direction ?? 'Left';
    if (!platformAhead(direction, npc, floorLevel, level) || npc.mind.blocked) {
        npc.vector.xd = 0;
        npc.mind.direction = otherWay(direction);
        return
    }
    npc.vector.xd = direction === 'Left' ? -.3 : .3;
}

export const updateNpc = (npc: GameCharacter, floorLevel: number | undefined, state: GameState) => {
    const level = getCurrentLevel(state);
    if (level?.levelType !== 'platform') {
        return
    }
    if (npc.reeling || npc.dying || npc.altitude > 0) {
        return
    }

    goBackAndForwards(npc, floorLevel, level)

    npc.direction = getDirection(npc.vector.xd, 0)
}