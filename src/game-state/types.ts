import { BaseGameState, Direction, SpriteFrame } from "@dblatcher/sprite-canvas"
import { XY } from "../lib/geometry"
import { AssetKey } from "../assets-defs"
import { SongKey } from "../lib/songs"
import { Interaction } from "./interactions"

export type Space = {
    x: number,
    y: number
    width: number
    height: number
}

export enum EntityType {
    Player,
    NPC,
    Scenery,
}

export type NpcTask = 'Guard' | 'Wander'

export type CharacterState = {
    hostile?: boolean;
    direction?: Direction;
    blocked?: boolean;
    task?: NpcTask;
}

export type CharacterSpriteKey = "ranger" | "punisher"



export type GameCharacter = Space & {
    type: EntityType.NPC | EntityType.Player,
    id: number,
    direction: Direction;
    spriteKey: CharacterSpriteKey;
    spriteFilter?: string;
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
    collisionsOff?: {
        remaining: number;
    }
    health: {
        max: number;
        current: number;
    },
    safe?: boolean,
    pointsForKilling?: number
    altitude: number;
    mind: CharacterState;
    currentTile?: Tile;
    interaction?: Interaction;
}

export type FeedbackEventEventType = 'attack' | 'npc-hit' | 'attack-end' | 'reel-end' | 'player-hit' | 'player-land' | 'death'
export type FeedbackEvent = {
    type: FeedbackEventEventType;
    cycleNumber: number;
}
export type AddFeedbackFunc = { (type: FeedbackEventEventType): void }

export enum Traversability {
    Open, Blocking, Climb
}

export enum Terrain {
    Grass, Road, Stone, Waterfall, Splash, Water, Cave, MossyGround, Ladder,
    Wall, WoodFloor,
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
    mapWidth: number;
    mapHeight: number;
    bgm?: SongKey;
    scenery: Scenery[];
}

export type Scenery = Space & {
    type: EntityType.Scenery,
    traversability: Traversability,
    image: SpriteFrame<AssetKey>,
    interaction?: Interaction,
}

export type OverheadLevel = LevelBase & {
    levelType: 'overhead'
    tileObstacles: Space[];
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
    deathReset?: { countDown: number }
    previousInput?: InputState;
    interactionAndTarget?: {
        interaction: Interaction,
        target: GameCharacter | Scenery,
    };
}

export type InputState = {
    xd?: number,
    yd?: number,
    attackButton?: boolean,
    jumpButton?: boolean,
    interactButton?: boolean,
    interactDown?: boolean,
}
