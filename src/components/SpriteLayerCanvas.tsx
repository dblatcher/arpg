import { ViewPort } from "@dblatcher/sprite-canvas";
import { createRef, useLayoutEffect } from "react";
import { useAssets } from "../context/asset-context";
import { drawSceneFunction } from "../drawing";
import { GameState } from "../game-state";

interface Props {
    gameState: GameState;
    viewPort: ViewPort;
}

export const SpriteLayerCanvas = ({ viewPort, gameState }: Props) => {
    const assets = useAssets();
    const spriteCanvasRef = createRef<HTMLCanvasElement>();

    const renderCanvas = () => {
        drawSceneFunction(gameState, assets, viewPort)(spriteCanvasRef.current);
    };
    useLayoutEffect(renderCanvas, [renderCanvas, spriteCanvasRef]);

    return <canvas
        style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
        }}
        width={viewPort.width}
        height={viewPort.height}
        ref={spriteCanvasRef}></canvas>;

};
