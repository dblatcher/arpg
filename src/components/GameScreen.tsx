import { ViewPort } from "@dblatcher/sprite-canvas"
import { useBackdrops } from "../context/backdrop-context"
import { GameState } from "../game-state"
import { ScrollingBackdrop } from "./ScrollingBackdrop"
import { SpriteLayerCanvas } from "./SpriteLayerCanvas"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {
    const backdropUrlList = useBackdrops()
    const [baseBackdropUrl] = backdropUrlList

    const backDropUrl = backdropUrlList ? backdropUrlList[Math.floor(gameState.cycleNumber / 10) % backdropUrlList.length] : undefined;

    return (
        <div style={{
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden',
            border: '8px inset red'
        }}>
            <ScrollingBackdrop
                xR={gameState.mapWidth / viewPort.width}
                yR={gameState.mapHeight / viewPort.height}
                viewPort={viewPort}
                magnify={magnify}
                url={baseBackdropUrl}
            />
            <ScrollingBackdrop
                xR={gameState.mapWidth / viewPort.width}
                yR={gameState.mapHeight / viewPort.height}
                viewPort={viewPort}
                magnify={magnify}
                url={backDropUrl}
            />
            <SpriteLayerCanvas
                gameState={gameState}
                viewPort={viewPort}
            />
        </div>
    )
}