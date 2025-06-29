import { drawSpriteFunc, DrawToCanvasFunction, fullViewPort, makeDrawingMethods } from "@dblatcher/sprite-canvas";
import { AssetKey, assetParams } from "../assets-defs";
import { GameCharacter, GameState, Scenery } from "../game-state";
import { getCurrentLevel } from "../game-state/helpers";
import { getAttackZone } from "../game-state/overhead-operations/player-attacks";
import { drawCharacter } from "./draw-character";
import { drawScenery } from "./draw-scenery";


const SHOW_HITBOX = true as boolean;
const FAINT_PLAYER_OVER_SCENERY = true as boolean;

enum PlotType {
    GameCharacter,
    Scenery,
}

type SpritePlot = { type: PlotType.GameCharacter, item: GameCharacter } | { type: PlotType.Scenery, item: Scenery }

const byBase = (a: SpritePlot, b: SpritePlot) => (a.item.y + a.item.height) - (b.item.y + b.item.height);
const byFlatFirst = (a: SpritePlot, b: SpritePlot) => (a.item.drawFlat ? 0 : 1) - (b.item.drawFlat ? 0 : 1);

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

    const toPlot: SpritePlot[] = [
        { type: PlotType.GameCharacter, item: player },
        ...level.npcs.map((item): SpritePlot => ({ type: PlotType.GameCharacter, item })),
        ...level.scenery.map((item): SpritePlot => ({ type: PlotType.Scenery, item })),
    ];

    toPlot.sort(byBase).sort(byFlatFirst).forEach(({ type, item }) => {
        switch (type) {
            case PlotType.GameCharacter:
                drawCharacter(item, state, drawSprite)
                break;
            case PlotType.Scenery:
                drawScenery(item, state, drawSprite)
                break;
        }
    })

    if (FAINT_PLAYER_OVER_SCENERY) {
        drawCharacter({ ...player, spriteFilter: 'opacity(.25)' }, state, drawSprite);
    }

    if (SHOW_HITBOX) {
        level.npcs.forEach(character => {
            drawingMethods.rect(character.x, character.y, character.width, character.height)
        })
        drawingMethods.rect(player.x, player.y, player.width, player.height)
        const attackVector = player.attack && getAttackZone(player)
        if (attackVector) {
            drawingMethods.rect(attackVector.left, attackVector.top, attackVector.width, attackVector.height)
        }
        ctx.stroke()
    }
}