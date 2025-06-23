import { Scenery } from "./types"

export type Conversation = { text: string }

export enum EffectType {
    Log,
    ModTargetScenery,
    ToggleCondition,
}

type LogEffect = {
    type: EffectType.Log,
    contents: unknown[]
}

type ModTargetSceneryEffect = {
    type: EffectType.ModTargetScenery,
    mod: Partial<Scenery>,
}

type ToggleTargetConditionEffect = {
    type: EffectType.ToggleCondition
    ref?: string
}

type Effect = LogEffect | ModTargetSceneryEffect | ToggleTargetConditionEffect

export type Interaction = {
    dialog?: Conversation;
    effects?: Effect[];
}