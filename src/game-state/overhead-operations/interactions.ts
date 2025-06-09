import { doRectsIntersect } from "../../lib/geometry";
import { spaceToRect } from "../helpers";
import { GameCharacter, GameState, Level } from "../types";
import { getAttackZone } from "./player-attacks";

export const findInteractionTarget = (player: GameCharacter, level: Level) => {
    const area = getAttackZone(player);
    const target = level.npcs.find(npc => npc.interaction && doRectsIntersect(area, spaceToRect(npc)))
    return target;
}

export const handleInteraction = (target: GameCharacter, state: GameState) => {
    const { interaction } = target
    if (interaction) {
        state.interactionAndTarget = {
            interaction,
            target
        }
    }
}
