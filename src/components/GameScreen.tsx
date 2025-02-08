import { createRef, useEffect, useLayoutEffect, useState } from "react"
import { drawSceneFunction, generateBackdropUrl } from "../drawing"
import { useAssets } from "../context/asset-context"
import { GameState } from "../game-state"
import { ViewPort } from "@dblatcher/sprite-canvas"
import { ScrollingBackdrop } from "./ScrollingBackdrop"

interface Props {
    initialGameState: GameState,
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, initialGameState, viewPort, magnify = 1 }: Props) => {
    const assets = useAssets()
    const spriteCanvasRef = createRef<HTMLCanvasElement>()
    const [backdropUrlList, setBackdropUrlList] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        console.log('generating backdrop urls')
        const urlsList = [
            generateBackdropUrl(0)(initialGameState, assets),
            generateBackdropUrl(1)(initialGameState, assets),
            generateBackdropUrl(2)(initialGameState, assets),
            generateBackdropUrl(3)(initialGameState, assets),
        ]
        setBackdropUrlList(urlsList)

        return () => {
            console.log('revoking backdrop urls')
            urlsList.forEach(URL.revokeObjectURL)
        }
    }, [initialGameState, assets])

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
                url={backdropUrlList?.[0]}
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