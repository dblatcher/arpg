import { drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";
import { ranger } from "./sprites";


export const drawSceneFunction: DrawToCanvasFunction<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => (canvas) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) { return }

    ctx.clearRect(0, 0, viewport.width, viewport.height)
    const drawingMethods = makeDrawingMethods(ctx, viewport)
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)

    const { player } = state

    drawSprite({
        key: 'MISC',
        fx: 0, fy: 0,
        x: 30,
        y: 100,
    })

    const speed = Math.abs(player.vector.xd) + Math.abs(player.vector.yd)
    const animation = speed <= 0
        ? 'idle'
        : speed < .6
            ? 'walk'
            : 'run'

    drawSprite({
        key: 'RANGER_IDLE',
        ...ranger.getFrame(animation, player.direction, Math.floor(state.cycleNumber / 25) % 4),
        x: player.x,
        y: player.y,
    })

}
