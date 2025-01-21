import { drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";
import { ranger } from "./sprites";


const progressionFrame = ({ duration, remaining }: { duration: number, remaining: number }): number => {
    return Math.round(((duration - remaining) / duration) * 3)
}

const SHOW_HITBOX = true as boolean;

export const drawSceneFunction: DrawToCanvasFunction<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => (canvas) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) { return }
    const drawingMethods = makeDrawingMethods(ctx, viewport)
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
    const { player, obstacles } = state

    ctx.beginPath()
    ctx.clearRect(0, 0, viewport.width, viewport.height)

    obstacles.forEach(({ x, y, width, height }) => {
        drawSprite({
            key: 'MISC',
            fx: 0, fy: 0,
            x,
            y,
            width, height
        })
        if (SHOW_HITBOX) {
            drawingMethods.rect(x, y, width, height)
            ctx.stroke()
        }
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
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: animation === 'attack' ? 2 * player.width : (4 / 3) * player.width,
        center: true,
        height: player.height,
    })

    if (SHOW_HITBOX) {
        drawingMethods.rect(player.x, player.y, player.width, player.height)
        ctx.stroke()
    }
}
