import { drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";
import { getAttackZone } from "../game-state/operations/player-attacks";
import { drawCharacter } from "./draw-character";


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

    drawCharacter(player, state, drawSprite, ctx)
    state.npcs.forEach(character => {
        drawCharacter(character, state, drawSprite, ctx)
    })

    if (SHOW_HITBOX) {
        drawingMethods.rect(player.x, player.y, player.width, player.height)

        const attackVector = getAttackZone(player)
        if (attackVector) {
            drawingMethods.rect(attackVector.left, attackVector.top, attackVector.width, attackVector.height)
        }
        ctx.stroke()
    }
}
