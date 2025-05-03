
import { useRef } from "react";
import { useAssets } from "../context/asset-context";
import { plotGraphic } from "../drawing/title-animation";
import { useSchedule } from "../hooks/use-schedule";
import { useWindowSize } from "../hooks/use-window-size";


export const TitleGraphicCanvas = () => {
    const { windowWidth, windowHeight } = useWindowSize()
    const cycle = useRef(0);
    const iteration = useRef(0);
    const assets = useAssets();

    useSchedule(() => {
        const canvasElement = document.querySelector<HTMLCanvasElement>('canvas[data-title-cavas]');
        const mapWidth = Math.min(windowWidth - 50, 400);
        const mapHeight = Math.min(windowHeight - 50, 300);
        plotGraphic(
            { mapWidth, mapHeight, cycleNumber: cycle.current },
            canvasElement,
            assets,
            iteration.current
        )
        cycle.current = cycle.current + 1;
        if (cycle.current > 75) {
            cycle.current = 0
            iteration.current = iteration.current + 1
        }
    }, 50)

    return <canvas data-title-cavas='true'></canvas>
}

