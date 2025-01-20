import { drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";
import { ranger } from "./sprites";


const progressionFrame = ({ duration, remaining }: { duration: number, remaining: number }): number => {
    return Math.round(((duration - remaining) / duration) * 3)
}

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
    const animation = player.attack ? 'attack' : speed <= 0
        ? 'idle'
        : speed < .6
            ? 'walk'
            : 'run'

    const frameIndex = player.attack
        ? progressionFrame(player.attack)
        : Math.floor(state.cycleNumber / 25) % 4;

    drawSprite({
        key: 'RANGER_IDLE',
        ...ranger.getFrame(animation, player.direction, frameIndex),
        x: player.x,
        y: player.y,
        width: animation === 'attack' ? 60 : 40,
        center: true,
        height: animation === 'attack' ? 70 : 70,
    })

}
