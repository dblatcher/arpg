import { BaseGameState, Direction } from "@dblatcher/sprite-canvas"
import { XY } from "../lib/geometry"
import { AssetKey } from "../assets-defs"

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
    },
    pointsForKilling?: number
    altitude: number
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
    Grass, Road, Stone, Waterfall, Splash, Water, Cave, MossyGround
}

export type Tile = {
    traversability: Traversability
    terrain: Terrain
}

export type Exit = Space & {
    destination: {
        levelId: string,
        x: number,
        y: number,
    }
}

type LevelBase = {
    id: string,
    exits: Exit[];
    npcs: GameCharacter[];
    mapWidth: number
    mapHeight: number
}

export type OverheadLevel = LevelBase & {
    levelType: 'overhead'
    obstacles: Space[];
    tileMap: Tile[][];
}

export type Platform = Space & {
    blocking?: boolean
}



type PlatformBackdrop = {
    parallax: number,
    filter?: string,
    baseColor?: string,
    images?: Array<{
        assetKey: AssetKey,
        repeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat",
        rectArgs: [number, number, number, number],
        scaleX?: number 
        scaleY?: number 
    }>,
    terrainMap?: (Terrain | undefined)[][]
}

export type PlatformLevel = LevelBase & {
    levelType: 'platform',
    platforms: Platform[];
    backdrops: PlatformBackdrop[];
}

export type Level = OverheadLevel | PlatformLevel

export type GameState = BaseGameState & {
    feedbackEvents: FeedbackEvent[],
    paused: boolean;
    player: GameCharacter;
    currentLevelId: string;
    levels: Level[];
    score: number;
}

export type InputState = {
    xd?: number,
    yd?: number,
    attackButton?: boolean,
}
