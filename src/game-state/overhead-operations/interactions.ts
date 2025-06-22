import { doRectsIntersect } from "../../lib/geometry";
import { spaceToRect } from "../helpers";
import { EffectType } from "../interactions";
import { EntityType, GameCharacter, GameState, Level, Scenery } from "../types";
import { getAttackZone } from "./player-attacks";

export const findInteractionTarget = (player: GameCharacter, level: Level) => {
    const area = getAttackZone(player);
    const target =
        level.npcs.find(npc => npc.interaction && doRectsIntersect(area, spaceToRect(npc))) ||
        level.scenery.find(item => item.interaction && doRectsIntersect(area, spaceToRect(item)))
    return target;
}


export const handleInteraction = (target: GameCharacter | Scenery, level: Level, state: GameState) => {
    const { interaction } = target;
    if (!interaction) {
        return
    }
    const { effects, dialog } = interaction


    if (effects) {
        effects.forEach(effect => {
            switch (effect.type) {
                case EffectType.Log:
                    console.log(...effect.contents)
                    break;

                case EffectType.ModTargetScenery:
                    if (target.type === EntityType.Scenery) {
                        level.scenery = level.scenery.filter(i => i.id !== target.id);
                        level.scenery.push({ ...target, ...effect.mod });
                    }
            }
        })
    }

    if (dialog) {
        state.interactionAndTarget = {
            interaction,
            target
        }
    }
}
