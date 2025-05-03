
import { generatePattern } from "@dblatcher/sprite-canvas";
import { useRef } from "react";
import { AssetMap, assetParams } from "../assets-defs";
import { useAssets } from "../context/asset-context";
import { useSchedule } from "../hooks/use-schedule";

const plotGraphic = (canvasElement: HTMLCanvasElement | null, assets: AssetMap, frame: number) => {
    const ctx = canvasElement?.getContext('2d');
    if (!canvasElement || !ctx) {
        return
    }
    canvasElement.height = 200
    canvasElement.width = 200
    const pattern1 = generatePattern(ctx, { key: 'TILES_2', fx: 6, fy: 2 }, assets, assetParams);
    ctx.beginPath()
    if (pattern1) {
        ctx.fillStyle = pattern1
    }
    ctx.fillRect(0, 0, 200, 200)


    const pattern2 = generatePattern(ctx, { key: 'TILES_2', fx: 2, fy: 2 }, assets, assetParams);


    pattern2?.setTransform(
        new DOMMatrix()
            .scaleSelf((50 + frame) / 50, (50 + frame) / 50)
            .translateSelf(
                -frame / 2,
                -frame / 2,
            )
    )

    ctx.beginPath()
    ctx.filter = "contrast(.5)";
    if (pattern2) {
        ctx.fillStyle = pattern2
    }

    ctx.arc(100, 100, 50 + frame, 0, Math.PI * 2 * frame / 75)
    ctx.fill();
    ctx.stroke();
}


export const TitleGraphicCanvas = () => {
    const frame = useRef(0)
    const assets = useAssets();

    useSchedule(() => {
        const canvasElement = document.querySelector<HTMLCanvasElement>('canvas[data-title-cavas]');
        plotGraphic(canvasElement, assets, frame.current)
        frame.current = frame.current + 1;
        if (frame.current > 75) {
            frame.current = 0
        }
    }, 50)

    return <canvas data-title-cavas='true'></canvas>
} 