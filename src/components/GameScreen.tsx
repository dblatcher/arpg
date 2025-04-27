import { ViewPort } from "@dblatcher/sprite-canvas"
import { useBackdrops } from "../context/backdrop-context"
import { GameState, OverheadLevel, PlatformLevel } from "../game-state"
import { ScrollingBackdrop } from "./ScrollingBackdrop"
import { SpriteLayerCanvas } from "./SpriteLayerCanvas"
import { getCurrentLevel } from "../game-state/helpers"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

const PlatformBackdrops = ({
    gameState,
    viewPort,
    magnify = 1,
    level,
    backdropUrlList }: Props & { level: PlatformLevel, backdropUrlList: string[] }) => {
    const [platformsLayer, ...backgroundLayers] = backdropUrlList;
    return <>
        {backgroundLayers.map((layerUrl, index) => (
            <ScrollingBackdrop key={index}
                viewPort={viewPort}
                magnify={magnify}
                parallax={level.backdrops[index]?.parallax}
                url={layerUrl}
                mapWidth={gameState.mapWidth}
                mapHeight={gameState.mapHeight}
            />
        ))}
        <ScrollingBackdrop
            viewPort={viewPort}
            magnify={magnify}
            url={platformsLayer}
            mapWidth={gameState.mapWidth}
            mapHeight={gameState.mapHeight}
        />
    </>
}

const OverheadBackdrops = ({ gameState, viewPort, magnify = 1, backdropUrlList }: Props & { level: OverheadLevel, backdropUrlList: string[] }) => {
    const [baseBackdropUrl] = backdropUrlList
    const backDropUrl = backdropUrlList ? backdropUrlList[Math.floor(gameState.cycleNumber / 10) % backdropUrlList.length] : undefined;

    return <>
        <ScrollingBackdrop
            viewPort={viewPort}
            magnify={magnify}
            url={baseBackdropUrl}
            mapWidth={gameState.mapWidth}
            mapHeight={gameState.mapHeight}
        />
        <ScrollingBackdrop
            viewPort={viewPort}
            magnify={magnify}
            url={backDropUrl}
            mapWidth={gameState.mapWidth}
            mapHeight={gameState.mapHeight}
        />
    </>
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {
    const backdropUrlList = useBackdrops()
    const level = getCurrentLevel(gameState)

    return (
        <div style={{
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden',
            border: '8px inset red'
        }}>
            {level?.levelType === 'platform' && (
                <PlatformBackdrops {...{ gameState, viewPort, magnify, backdropUrlList, level }} />
            )}
            {level?.levelType === 'overhead' && (
                <OverheadBackdrops {...{ gameState, viewPort, magnify, backdropUrlList, level }} />
            )}
            <SpriteLayerCanvas
                gameState={gameState}
                viewPort={viewPort}
            />
        </div>
    )
}