import { ViewPort } from "@dblatcher/sprite-canvas"
import { useBackdrops } from "../context/backdrop-context"
import { GameState } from "../game-state"
import { ScrollingBackdrop } from "./ScrollingBackdrop"
import { SpriteLayerCanvas } from "./SpriteLayerCanvas"
import { getCurrentLevel } from "../game-state/helpers"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {
    const backdropUrlList = useBackdrops()
    const [baseBackdropUrl] = backdropUrlList

    const level = getCurrentLevel(gameState)
    const backDropUrl = backdropUrlList ? backdropUrlList[Math.floor(gameState.cycleNumber / 10) % backdropUrlList.length] : undefined;

    return (
        <div style={{
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden',
            border: '8px inset red'
        }}>
            {level?.levelType === 'platform' && (
                <>
                    <ScrollingBackdrop
                        viewPort={viewPort}
                        magnify={magnify}
                        parallax={level.backdrops[0]?.parallax}
                        url={backdropUrlList[1]}
                        mapWidth={gameState.mapWidth}
                        mapHeight={gameState.mapHeight}
                    />
                    <ScrollingBackdrop
                        viewPort={viewPort}
                        magnify={magnify}
                        parallax={level.backdrops[1]?.parallax}
                        url={backdropUrlList[2]}
                        mapWidth={gameState.mapWidth}
                        mapHeight={gameState.mapHeight}
                    />
                </>
            )}
            <ScrollingBackdrop
                viewPort={viewPort}
                magnify={magnify}
                url={baseBackdropUrl}
                mapWidth={gameState.mapWidth}
                mapHeight={gameState.mapHeight}
            />
            {level?.levelType === 'overhead' && (
                <ScrollingBackdrop
                    viewPort={viewPort}
                    magnify={magnify}
                    url={backDropUrl}
                    mapWidth={gameState.mapWidth}
                    mapHeight={gameState.mapHeight}
                />
            )}
            <SpriteLayerCanvas
                gameState={gameState}
                viewPort={viewPort}
            />
        </div>
    )
}