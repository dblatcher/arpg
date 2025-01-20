import { BaseGameState, Direction } from "@dblatcher/sprite-canvas"

export type GameCharacter = {
    x: number,
    y: number,
    direction: Direction,
    vector: {
        xd: number,
        yd: number,
    },
    attack?: {
        remaining: number
        duration: number
    }
}

export type GameState = BaseGameState & {
    paused: boolean,
    player: GameCharacter
}

export type InputState = {
    xd?: number,
    yd?: number,
    attackButton?: boolean,
}
