import { doRectsIntersect } from "typed-geometry";
import { spaceToRect } from "../helpers";
import { EffectType } from "../interactions";
import { EntityType, GameCharacter, GameState, Level, Scenery, SceneryCondition } from "../types";
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
                    break;
                case EffectType.ToggleCondition: {
                    const effectTarget = effect.ref
                        ? level.scenery.find(i => i.ref === effect.ref)
                        : target.type === EntityType.Scenery ? target : undefined;
                    if (effectTarget) {
                        effectTarget.condition = effectTarget.condition === SceneryCondition.Base ? SceneryCondition.Active : SceneryCondition.Base
                    }
                    break;
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
