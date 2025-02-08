import { ViewPort } from "@dblatcher/sprite-canvas"
import { createRef, useLayoutEffect } from "react"
import { useAssets } from "../context/asset-context"
import { useBackdrops } from "../context/backdrop-context"
import { drawSceneFunction } from "../drawing"
import { GameState } from "../game-state"
import { ScrollingBackdrop } from "./ScrollingBackdrop"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {
    const assets = useAssets()
    const backdropUrlList = useBackdrops()
    const [baseBackdropUrl] = backdropUrlList
    const spriteCanvasRef = createRef<HTMLCanvasElement>()

    const renderCanvas = () => {
        drawSceneFunction(gameState, assets, viewPort)(spriteCanvasRef.current)
    }

    useLayoutEffect(renderCanvas, [renderCanvas, spriteCanvasRef])

    const xR = gameState.mapWidth / viewPort.width
    const yR = gameState.mapHeight / viewPort.height

    const backDropUrl = backdropUrlList ? backdropUrlList[Math.floor(gameState.cycleNumber / 10) % backdropUrlList.length] : undefined;

    return (
        <div style={{
            display: 'flex',
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden',
            border: '4px outset red'
        }}>
            <ScrollingBackdrop
                xR={xR}
                yR={yR}
                viewPort={viewPort}
                magnify={magnify}
                url={baseBackdropUrl}
            />
            <ScrollingBackdrop
                xR={xR}
                yR={yR}
                viewPort={viewPort}
                magnify={magnify}
                url={backDropUrl}
            />
            <canvas
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                }}
                width={viewPort.width}
                height={viewPort.height}
                ref={spriteCanvasRef} ></canvas>
        </div>
    )
}