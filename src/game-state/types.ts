import { BaseGameState, Direction } from "@dblatcher/sprite-canvas"

export type Obstable = {
    x: number,
    y: number
    width: number
    height: number
}

export type GameCharacter = Obstable & {
    direction: Direction,
    speed: number,
    vector: {
        xd: number,
        yd: number,
    },
    attack?: {
        remaining: number
        duration: number
    }
    reeling? : {
        remaining: number,
        duration: number,
        direction: Direction,
    }
}

export type GameState = BaseGameState & {
    paused: boolean;
    player: GameCharacter;
    obstacles: Obstable[];
    npcs: GameCharacter[];
}

export type InputState = {
    xd?: number,
    yd?: number,
    attackButton?: boolean,
}
