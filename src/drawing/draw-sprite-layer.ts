import { drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameState } from "../game-state";
import { getAttackZone } from "../game-state/overhead-operations/player-attacks";
import { drawCharacter } from "./draw-character";
import { ranger } from "./ranger-sprite";
import { punisher } from "./punisher-sprite";
import { getCurrentLevel } from "../game-state/helpers";


const SHOW_HITBOX = true as boolean;

export const drawSceneFunction: DrawToCanvasFunction<GameState, AssetKey> = (state, assets, viewport = fullViewPort(state)) => (canvas) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) { return }
    const drawingMethods = makeDrawingMethods(ctx, viewport)
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
    const { player } = state
    const level = getCurrentLevel(state)
    if (!level) {
        console.error('no level', state)
        return
    }

    ctx.beginPath()
    ctx.clearRect(0, 0, viewport.width, viewport.height)

    drawCharacter(player, state, ranger, drawSprite)
    level.npcs.forEach(character => {
        drawCharacter(character, state, punisher, drawSprite)
    })

    if (SHOW_HITBOX) {
        level.npcs.forEach(character => {
            drawingMethods.rect(character.x, character.y, character.width, character.height)
        })
        drawingMethods.rect(player.x, player.y, player.width, player.height)
        const attackVector = getAttackZone(player)
        if (attackVector) {
            drawingMethods.rect(attackVector.left, attackVector.top, attackVector.width, attackVector.height)
        }
        ctx.stroke()
    }
}