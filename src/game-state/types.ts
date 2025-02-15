import { BaseGameState, Direction } from "@dblatcher/sprite-canvas"
import { XY } from "../lib/geometry"

export type Space = {
    x: number,
    y: number
    width: number
    height: number
}

export type GameCharacter = Space & {
    id: number,
    direction: Direction;
    speed: number;
    vector: {
        xd: number;
        yd: number;
    },
    attack?: {
        remaining: number;
        duration: number;
    }
    dying?: {
        remaining: number;
        duration: number;
        unitVector: XY;
    }
    reeling?: {
        remaining: number;
        duration: number;
        direction: Direction;
        unitVector: XY;
    }
    health: {
        max: number;
        current: number;
    }
}

export type FeedbackEventEventType = 'attack' | 'npc-hit' | 'attack-end' | 'reel-end' | 'player-hit'
export type FeedbackEvent = {
    type: FeedbackEventEventType;
    cycleNumber: number;
}

export enum Traversability {
    Open, Blocking
}

export enum Terrain {
    Grass, Road, Stone, Waterfall, Splash, Water
}

export type Tile = {
    traversability: Traversability
    terrain: Terrain
}

export type GameState = BaseGameState & {
    feedbackEvents: FeedbackEvent[],
    paused: boolean;
    player: GameCharacter;
    obstacles: Space[];
    npcs: GameCharacter[];
    tileMap: Tile[][];
}

export type InputState = {
    xd?: number,
    yd?: number,
    attackButton?: boolean,
}
