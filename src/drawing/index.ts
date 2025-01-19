import { DrawToCanvasFunction, fullViewPort, makeDrawingMethods, drawSpriteFunc } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";


export const drawSceneFunction: DrawToCanvasFunction<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => (canvas) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        return
    }

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    const drawingMethods = makeDrawingMethods(ctx, viewport)
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)

    drawSprite({
        key: 'MISC',
        x: state.x,
        y: state.y,
        fx: 0, fy: 0,
    })
}
