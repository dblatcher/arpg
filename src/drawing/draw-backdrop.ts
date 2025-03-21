import { drawOffScreen, drawSpriteFunc, DrawToCanvasFunction, fullViewPort, GenerateImageUrl, makeDrawingMethods, OffsetDrawMethods, SpriteFrame, ViewPort } from "@dblatcher/sprite-canvas";
import { AssetKey, AssetMap, assetParams } from "../assets-defs";
import { GameState, OverheadLevel, PlatformLevel, Space, Terrain } from "../game-state";
import { TILE_DIMS } from "./constants-and-types";


const STONE: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 5, }
const GRASS: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 0, }
const ROAD: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 4, fy: 0, }
const WATER: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 6, fy: 2, }
const MOSSY_GROUND: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 6, fy: 5 }

const CAVE = {
    topLeft: { key: 'TILES_3', fx: 4, fy: 0 },
    topRight: { key: 'TILES_3', fx: 5, fy: 0 },
    bottomLeft: { key: 'TILES_3', fx: 6, fy: 1 },
    bottomRight: { key: 'TILES_3', fx: 7, fy: 1 },
} satisfies Record<string, SpriteFrame<AssetKey>>

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


const drawOverheadBackdrop = (variant: BackdropVariant, level: OverheadLevel, drawingMethods: OffsetDrawMethods, assets: AssetMap, viewport: ViewPort) => {

    const { ctx } = drawingMethods
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
    const { tileMap } = level

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    ctx.beginPath()

    const drawTile = (frame: SpriteFrame<AssetKey>, x: number, y: number) =>
        drawSprite({
            ...frame,
            x: -1 + (x * TILE_DIMS.width),
            y: -1 + (y * TILE_DIMS.height),
            height: TILE_DIMS.height + 2,
            width: TILE_DIMS.width + 2
        })

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
                    drawTileIfBase(WATER, tileIndex, rowIndex);
                    break
                case Terrain.Waterfall:
                    drawTile(WATERFALL[variant], tileIndex, rowIndex)
                    break;
                case Terrain.Splash:
                    drawTile(SPLASH[variant], tileIndex, rowIndex)
                    break;
                case Terrain.Cave: {
                    const isOnLeft = tileMap[rowIndex]?.[tileIndex + 1]?.terrain === Terrain.Cave
                    const isOnTop = tileMap[rowIndex + 1]?.[tileIndex]?.terrain === Terrain.Cave
                    const frame = isOnTop
                        ? isOnLeft
                            ? CAVE.topLeft
                            : CAVE.topRight
                        : isOnLeft
                            ? CAVE.bottomLeft
                            : CAVE.bottomRight

                    drawTileIfBase(frame, tileIndex, rowIndex)
                    break;
                }
                case Terrain.MossyGround:
                    drawTileIfBase(MOSSY_GROUND, tileIndex, rowIndex);
                    break;
            }
        })
    })

}

const drawPlatformbackdrop = (
    _variant: BackdropVariant,
    level: PlatformLevel,
    drawingMethods: OffsetDrawMethods,
    assets: AssetMap,
    viewport: ViewPort
) => {

    const { ctx } = drawingMethods
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    ctx.beginPath()


    const drawTile = (frame: SpriteFrame<AssetKey>, { x, y, width, height }: Space) =>
        drawSprite({
            ...frame,
            x,
            y,
            height,
            width,
        })

    const { platforms } = level

    platforms.forEach((platform) => {
        drawTile(STONE, platform)
    })

    ctx.beginPath()
    ctx.fillStyle='red'
    drawingMethods.fillText('260', 500, 260)
    drawingMethods.fillText('300-ceiling', 500, 300)
    drawingMethods.fillText('318', 500, 318)
    drawingMethods.fillText('360-floor', 500, 360)
    drawingMethods.fillText('288', 500, 288)
    ctx.stroke()
    ctx.fill()
}

const drawBackdrop = (variant: BackdropVariant): DrawToCanvasFunction<GameState, AssetKey> => (state, assets, viewport = fullViewPort(state)) => {
    return (canvas) => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) { return }
        const level = state.levels[state.currentLevelIndex]
        const drawingMethods = makeDrawingMethods(ctx, viewport)
        switch (level?.levelType) {
            case "overhead":
                return drawOverheadBackdrop(variant, level, drawingMethods, assets, viewport)
            case "platform":
                return drawPlatformbackdrop(variant, level, drawingMethods, assets, viewport)
        }
    }
}

export const generateBackdropUrl = (variant: BackdropVariant): GenerateImageUrl<GameState, AssetKey> =>
    (state, assets, viewport = fullViewPort(state)) => {

        console.time(`gen backdrop url ${variant}`)
        const url = drawOffScreen(drawBackdrop(variant))(state, assets, viewport)
        console.timeEnd(`gen backdrop url ${variant}`)
        return url
    }
