import { drawOffScreen, drawSpriteFunc, DrawToCanvasFunction, fullViewPort, GenerateImageUrl, makeDrawingMethods, SpriteFrame } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState, Terrain } from "../game-state";
import { TILE_DIMS } from "./constants-and-types";


const STONE: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 5, }
const GRASS: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 0, }
const ROAD: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 4, fy: 0, }

const WATERFALL = [
    { key: 'TILES_3', fx: 7, fy: 0 },
    { key: 'TILES_3', fx: 1, fy: 2 },
    { key: 'TILES_3', fx: 2, fy: 3 },
    { key: 'TILES_2', fx: 5, fy: 5 },
] satisfies SpriteFrame<AssetKey>[];

const SPLASH = [
    { key: 'TILES_3', fx: 7, fy: 0 },
    { key: 'TILES_3', fx: 1, fy: 2 },
    { key: 'TILES_3', fx: 2, fy: 3 },
    { key: 'TILES_3', fx: 0, fy: 4 },
] satisfies SpriteFrame<AssetKey>[];



type BackdropVariant = 0 | 1 | 2 | 3;

const drawBackdrop = (variant: BackdropVariant): DrawToCanvasFunction<GameState, AssetKey> => (state, assets, viewport = fullViewPort(state)) => {
    return (canvas) => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewport)
        const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
        const { tileMap } = state

        if (variant === 0) {
            ctx.clearRect(0, 0, viewport.width, viewport.height)
            ctx.beginPath()
            ctx.fillStyle = "green"
            ctx.fillRect(0, 0, viewport.width, viewport.height)
            ctx.beginPath()
        }

        const drawTile = (frame: SpriteFrame<AssetKey>, x: number, y: number) =>
            drawSprite({ ...frame, x: x * TILE_DIMS.width, y: y * TILE_DIMS.height, ...TILE_DIMS })

        const drawTileIfBase = (frame: SpriteFrame<AssetKey>, x: number, y: number) => {
            if (variant === 0) {
                drawTile(frame, x, y)
            }
        }

        tileMap.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                switch (tile.terrain) {
                    case Terrain.Grass:
                        drawTileIfBase(GRASS, tileIndex, rowIndex)
                        break
                    case Terrain.Road:
                        drawTileIfBase(ROAD, tileIndex, rowIndex);
                        break
                    case Terrain.Stone:
                        drawTileIfBase(STONE, tileIndex, rowIndex);
                        break
                    case Terrain.Water:
                        drawTile(WATERFALL[variant], tileIndex, rowIndex)
                        break;
                    case Terrain.Splash:
                        drawTile(SPLASH[variant], tileIndex, rowIndex)
                        break;
                }
            })
        })

    }
}

export const generateBackdropUrl = (variant: BackdropVariant): GenerateImageUrl<GameState, AssetKey> =>
    (state, assets, viewport = fullViewPort(state)) => {

        console.time(`gen backdrop url ${variant}`)
        const url = drawOffScreen(drawBackdrop(variant))(state, assets, viewport)
        console.timeEnd(`gen backdrop url ${variant}`)
        return url
    }
