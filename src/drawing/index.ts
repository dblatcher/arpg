import { Direction, drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";
import { ranger } from "./sprites";


const getDirection = (xd: number, yd: number): Direction => {

    if (yd > 0) {
        return 'Down'
    }
    if (yd < 0) {
        return 'Up'
    }

    return xd > 0 ? 'Right' : 'Left'
}

export const drawSceneFunction: DrawToCanvasFunction<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => (canvas) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) { return }

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    const drawingMethods = makeDrawingMethods(ctx, viewport)
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)

    drawSprite({
        key: 'RANGER_IDLE',
        ...ranger.getFrame('walk', getDirection(0,0), Math.floor(state.cycleNumber / 25) % 4),
        x: state.x,
        y: state.y,
    })
}
