
import { BaseGameState, drawSpriteFunc, DrawSpriteFunction, fullViewPort, generatePattern, makeDrawingMethods, SpriteFrame } from "@dblatcher/sprite-canvas";
import { AssetKey, AssetMap, assetParams } from "../assets-defs";

const SWING: SpriteFrame<AssetKey> = { key: 'RANGER_ATTACK', fx: 2, fy: 0 };
const GUARD: SpriteFrame<AssetKey> = { key: 'RANGER_ATTACK', fx: 1, fy: 0 };
const LEAP: SpriteFrame<AssetKey> = { key: 'RANGER_RUN', fx: 3, fy: 3 };

function zoomyFigure(
    x: number,
    y: number,
    spriteFrame: SpriteFrame<AssetKey>,
    frameNumber: number,
    ctx: CanvasRenderingContext2D,
    pattern: CanvasPattern | null,
    drawSprite:
        DrawSpriteFunction<AssetKey>
) {

    const zoomSize = (50 + frameNumber) / 2;
    const opacity = 1 - (frameNumber / 75);

    ctx.filter = `opacity(${opacity.toFixed(2)})`;
    pattern?.setTransform(
        new DOMMatrix()
            .scaleSelf(zoomSize / 25, zoomSize / 25)
            .translateSelf(
                -frameNumber / 2,
                -frameNumber / 2
            )
    );
    ctx.beginPath();
    if (pattern) {
        ctx.fillStyle = pattern;
    }
    ctx.arc(x, y, zoomSize * .75, 0, Math.PI * 2);
    ctx.fill();
    drawSprite({ ...spriteFrame, x, y, center: true, width: zoomSize, height: zoomSize });
}


export const plotGraphic = (baseState: BaseGameState, canvasElement: HTMLCanvasElement | null, assets: AssetMap, iteration: number) => {
    const ctx = canvasElement?.getContext('2d');
    if (!canvasElement || !ctx) {
        return
    }
    canvasElement.height = baseState.mapHeight
    canvasElement.width = baseState.mapWidth

    const drawingMethods = makeDrawingMethods(ctx, fullViewPort(baseState));
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams);
    const cloudPattern = generatePattern(ctx, { key: 'CLOUDS' }, assets, assetParams);
    const stonePattern = generatePattern(ctx, { key: 'TILES_2', fx: 4, fy: 0 }, assets, assetParams);

    ctx.fillRect(0, 0, baseState.mapWidth, baseState.mapHeight)

    ctx.beginPath()
    if (cloudPattern) {
        cloudPattern.setTransform(new DOMMatrix().scale(1, 2).translate(baseState.cycleNumber + 75 * iteration))
        ctx.fillStyle = cloudPattern
    }

    ctx.fillRect(0, 0, baseState.mapWidth, baseState.mapHeight)

    const figureFrame1 = [SWING, GUARD, LEAP][iteration % 3];
    const figureFrame2 = [SWING, GUARD, LEAP][(iteration + 1) % 3];
    zoomyFigure(baseState.mapWidth - 75, 45, figureFrame1, baseState.cycleNumber, ctx, stonePattern, drawSprite);
    zoomyFigure(75, baseState.mapHeight - 45, figureFrame2, baseState.cycleNumber, ctx, stonePattern, drawSprite);
}
