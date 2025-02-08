import { Sprite } from "@dblatcher/sprite-canvas"
import { AssetKey } from "../assets-defs"
import { TILE_SIZE } from "../game-state/constants"

export const TILE_DIMS = {
    width: TILE_SIZE,
    height: TILE_SIZE
}

export type CharacterAnimation = 'idle' | 'walk' | 'run' | 'attack' | 'run' | 'reel'

export type CharacterSprite = Sprite<AssetKey, CharacterAnimation>
