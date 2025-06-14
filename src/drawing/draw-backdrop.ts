import { drawOffScreen, drawSpriteFunc, DrawSpriteFunction, DrawToCanvasFunction, fullViewPort, GenerateImageUrl, generatePattern, makeDrawingMethods, OffsetDrawMethods, SpriteFrame, ViewPort } from "@dblatcher/sprite-canvas";
import { AssetKey, AssetMap, assetParams } from "../assets-defs";
import { GameState, OverheadLevel, PlatformLevel, Space, Terrain } from "../game-state";
import { TILE_DIMS } from "./constants-and-types";
import { getCurrentLevel } from "../game-state/helpers";
import { GRASS, ROAD, STONE, WATER, WATERFALL, SPLASH, CAVE, MOSSY_GROUND, WOOD, LADDER, BRICKWALL } from "./tile-frames";


type BackdropVariant = 0 | 1 | 2 | 3;

const makeDrawTile = (drawSprite: DrawSpriteFunction<AssetKey>) => (frame: SpriteFrame<AssetKey>, x: number, y: number) =>
    drawSprite({
        ...frame,
        x: -1 + (x * TILE_DIMS.width),
        y: -1 + (y * TILE_DIMS.height),
        height: TILE_DIMS.height + 2,
        width: TILE_DIMS.width + 2
    })


const drawOverheadBackdrop = (variant: BackdropVariant, level: OverheadLevel, drawingMethods: OffsetDrawMethods, assets: AssetMap, viewport: ViewPort) => {
    const { ctx } = drawingMethods
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
    const drawTile = makeDrawTile(drawSprite)
    const drawTileIfBase = (frame: SpriteFrame<AssetKey>, x: number, y: number) => {
        if (variant === 0) {
            drawTile(frame, x, y)
        }
    }

    const { tileMap } = level

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    ctx.beginPath()

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
                case Terrain.Ladder:
                    drawTileIfBase(LADDER, tileIndex, rowIndex);
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
                case Terrain.Wall: 
                    drawTileIfBase(BRICKWALL, tileIndex, rowIndex)
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


const drawPlatformLayer = (
    level: PlatformLevel,
    drawingMethods: OffsetDrawMethods,
    assets: AssetMap,
) => {
    const { ctx, rect } = drawingMethods

    const patternMap = new Map<SpriteFrame<AssetKey>, CanvasPattern | null>()

    const drawPlatform = (frame: SpriteFrame<AssetKey>, { x, y, width, height }: Space) => {
        let pattern: CanvasPattern | null = null
        if (patternMap.has(frame)) {
            pattern = patternMap.get(frame) ?? null
        } else {
            pattern = generatePattern(ctx, frame, assets, assetParams);
            patternMap.set(frame, pattern);
        }
        if (pattern) {
            pattern.setTransform(new DOMMatrix().translateSelf(x, y));
            ctx.fillStyle = pattern
        }
        ctx.beginPath()
        rect(x, y, width, height);
        ctx.fill()
    }

    const { platforms, exits } = level
    platforms.forEach((platform) => {
        drawPlatform(platform.blocking ? STONE : WOOD, platform)
    })
    exits.forEach(({ x, y, width, height }) => {
        ctx.beginPath()
        rect(x, y, width, height)
        ctx.fillStyle = 'black';
        ctx.fill()
    })
}

const drawPlatformbackdrop = (
    variant: BackdropVariant,
    level: PlatformLevel,
    drawingMethods: OffsetDrawMethods,
    assets: AssetMap,
    viewport: ViewPort
) => {

    const { ctx, rect } = drawingMethods
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
    const drawTile = makeDrawTile(drawSprite);

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    ctx.beginPath()

    if (variant === 0) {
        return drawPlatformLayer(level, drawingMethods, assets)
    }

    const backdrop = level.backdrops[variant - 1]
    if (!backdrop) {
        return
    }

    const { baseColor, images = [], filter, terrainMap } = backdrop

    ctx.filter = filter ?? ''

    if (baseColor) {
        ctx.beginPath()
        rect(0, 0, level.mapWidth, level.mapHeight)
        ctx.fillStyle = baseColor
        ctx.fill()
    }

    images.forEach(image => {
        const { rectArgs: rectArgs, assetKey, repeat = null, scaleX = 1, scaleY = 1 } = image
        ctx.beginPath()
        const pattern = ctx.createPattern(assets[assetKey], repeat)
        const [x, y] = rectArgs;
        pattern?.setTransform(new DOMMatrix().translateSelf(x, y).scaleSelf(scaleX, scaleY))
        ctx.fillStyle = pattern ?? '';
        rect(...rectArgs)
        ctx.fill()
    })

    terrainMap?.forEach((row, rowIndex) => {
        row.forEach((terrain, tileIndex) => {
            switch (terrain) {
                case Terrain.Grass:
                    drawTile(GRASS, tileIndex, rowIndex)
                    break
                case Terrain.Road:
                    drawTile(ROAD, tileIndex, rowIndex);
                    break
                case Terrain.Stone:
                    drawTile(STONE, tileIndex, rowIndex);
                    break
                case Terrain.Ladder:
                    drawTile(LADDER, tileIndex, rowIndex);
                    break
                case Terrain.Water:
                    drawTile(WATER, tileIndex, rowIndex);
                    break
                case Terrain.Waterfall:
                    drawTile(WATERFALL[variant], tileIndex, rowIndex)
                    break;
                case Terrain.Splash:
                    drawTile(SPLASH[variant], tileIndex, rowIndex)
                    break;
                case Terrain.Cave: {
                    const isOnLeft = terrainMap[rowIndex]?.[tileIndex + 1] === Terrain.Cave
                    const isOnTop = terrainMap[rowIndex + 1]?.[tileIndex] === Terrain.Cave
                    const frame = isOnTop
                        ? isOnLeft
                            ? CAVE.topLeft
                            : CAVE.topRight
                        : isOnLeft
                            ? CAVE.bottomLeft
                            : CAVE.bottomRight
                    drawTile(frame, tileIndex, rowIndex)
                    break;
                }
                case Terrain.MossyGround:
                    drawTile(MOSSY_GROUND, tileIndex, rowIndex);
                    break;
            }
        })
    });

    ctx.filter = ''
}

const drawBackdrop = (variant: BackdropVariant): DrawToCanvasFunction<GameState, AssetKey> => (state, assets, viewport = fullViewPort(state)) => {
    return (canvas) => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) { return }
        const level = getCurrentLevel(state)
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

