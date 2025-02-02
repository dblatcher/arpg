import { Sprite } from "@dblatcher/sprite-canvas"
import { AssetKey } from "../assets-defs"

export const TILE_SIZE = 40

export const TILE_DIMS = {
    width: TILE_SIZE,
    height: TILE_SIZE
}

export type CharacterAnimation = 'idle' | 'walk' | 'run' | 'attack' | 'run' | 'reel'

export type CharacterSprite = Sprite<AssetKey, CharacterAnimation>
