import { Scenery } from "./types"

export type Conversation = { text: string }

export enum EffectType {
    Log,
    ModTargetScenery,
}

type LogEffect = {
    type: EffectType.Log,
    contents: unknown[]
}

type ModTargetSceneryEffect = {
    type: EffectType.ModTargetScenery,
    mod: Partial<Scenery>,
}

type Effect = LogEffect | ModTargetSceneryEffect

export type Interaction = {
    dialog?: Conversation;
    effects?: Effect[];
}