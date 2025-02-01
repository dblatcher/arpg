import { drawOffScreen, drawSpriteFunc, DrawToCanvasFunction, fullViewPort, GenerateImageUrl, makeDrawingMethods, SpriteFrame } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState, Terrain } from "../game-state";
import { TILE_SIZE, TILE_DIMS } from "./constants";


const STONE: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 5, }
const GRASS: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 1, fy: 0, }
const GRASS_ALT: SpriteFrame<AssetKey> = { key: 'TILES_1', fx: 7, fy: 2, }
const ROAD: SpriteFrame<AssetKey> = { key: 'TILES_2', fx: 4, fy: 0, }

const drawBackdrop: DrawToCanvasFunction<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => {
    return (canvas) => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewport)
        const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
        const { tileMap } = state

        ctx.clearRect(0, 0, viewport.width, viewport.height)
        ctx.beginPath()
        ctx.fillStyle = "green"
        ctx.fillRect(0, 0, viewport.width, viewport.height)
        ctx.beginPath()

        const drawGrassTile = (x: number, y: number) => drawSprite({ ...GRASS, x: x * TILE_SIZE, y: y * TILE_SIZE, ...TILE_DIMS })
        const drawGrassAltTile = (x: number, y: number) => drawSprite({ ...GRASS_ALT, x: x * TILE_SIZE, y: y * TILE_SIZE, ...TILE_DIMS })
        const drawTile = (frame: SpriteFrame<AssetKey>, x: number, y: number) => drawSprite({ ...frame, x: x * TILE_SIZE, y: y * TILE_SIZE, ...TILE_DIMS })
        const widthInTiles = Math.ceil(viewport.width)
        const heightInTiles = Math.ceil(viewport.height)

        for (let x = 0; x <= widthInTiles; x++) {
            for (let y = 0; y <= heightInTiles; y++) {
                if (Math.random() > .9) {
                    drawGrassAltTile(x, y)
                } else {
                    drawGrassTile(x, y)
                }
            }
        }

        tileMap.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                switch (tile.terrain) {
                    case Terrain.Grass:
                        break
                    case Terrain.Road:
                        drawTile(ROAD, tileIndex, rowIndex);
                        break
                    case Terrain.Stone:
                        drawTile(STONE, tileIndex, rowIndex);
                        break
                }
            })
        })
    }
}

export const generateBackdropUrl: GenerateImageUrl<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => {
    return drawOffScreen(drawBackdrop)(state, assets, viewport)
}