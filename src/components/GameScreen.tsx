import { createRef, useEffect, useLayoutEffect, useState } from "react"
import { drawSceneFunction, generateBackdropUrl } from "../drawing"
import { useAssets } from "../context/asset-context"
import { GameState } from "../game-state"
import { ViewPort } from "@dblatcher/sprite-canvas"

interface Props {
    initialGameState: GameState,
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, initialGameState, viewPort, magnify = 1 }: Props) => {
    const assets = useAssets()
    const spriteCanvasRef = createRef<HTMLCanvasElement>()
    const [backdropUrl, setBackdropUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        console.log('generating backdrop url')
        const url = generateBackdropUrl(initialGameState, assets)
        setBackdropUrl(url)
        return () => {
            console.log('revoking backdrop url')
            URL.revokeObjectURL(url)
        }
    }, [initialGameState, assets])

    const renderCanvas = () => {
        drawSceneFunction(gameState, assets, viewPort)(spriteCanvasRef.current)
    }

    useLayoutEffect(renderCanvas, [renderCanvas, spriteCanvasRef])

    const xR = gameState.mapWidth / viewPort.width
    const yR = gameState.mapHeight / viewPort.height

    return (
        <div style={{
            display: 'flex',
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden',
            border: '4px outset red'
        }}>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${100 * xR}%`,
                    height: `${100 * yR}%`,
                    transform: `translatex(${-viewPort.x * magnify}px) translatey(${-viewPort.y * magnify}px)`,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: `${100}%`,
                        height: `${100}%`,
                        backgroundImage: backdropUrl ? `url("${backdropUrl}")` : undefined,
                        backgroundSize: ` ${100}% ${100}%`,
                    }}
                ></div>
            </div>
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