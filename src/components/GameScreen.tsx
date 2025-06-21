import { ViewPort } from "@dblatcher/sprite-canvas"
import { OverheadBackdropSet, PlatformBackdropSet, useBackdrops } from "../context/backdrop-context"
import { GameState } from "../game-state"
import { ConversationBox } from "./ConversationBox"
import { ScrollingBackdrop } from "./ScrollingBackdrop"
import { SpriteLayerCanvas } from "./SpriteLayerCanvas"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

const PlatformBackdrops = ({
    gameState,
    viewPort,
    magnify = 1,
    backdropSet
}: Props & { backdropSet: PlatformBackdropSet }) => {
    const { platformLayerUrl, backgroundLayers } = backdropSet;

    return <>
        {backgroundLayers.map((layer, index) => (
            <ScrollingBackdrop key={index}
                viewPort={viewPort}
                magnify={magnify}
                parallax={layer.parallax}
                url={layer.url}
                mapWidth={gameState.mapWidth}
                mapHeight={gameState.mapHeight}
            />
        ))}
        <ScrollingBackdrop
            viewPort={viewPort}
            magnify={magnify}
            url={platformLayerUrl}
            mapWidth={gameState.mapWidth}
            mapHeight={gameState.mapHeight}
        />
    </>
}

const OverheadBackdrops = ({ gameState, viewPort, magnify = 1, backdropSet }: Props & { backdropSet: OverheadBackdropSet }) => {

    const { baseTilesUrl, animationTilesUrls } = backdropSet

    //use length +1 so there is an empty frame with the base showing
    const frameNumber = Math.floor(gameState.cycleNumber / 10) % (animationTilesUrls.length + 1);
    const animatedTilesFrameUrl: string | undefined = animationTilesUrls[frameNumber];

    return <>
        <ScrollingBackdrop
            viewPort={viewPort}
            magnify={magnify}
            url={baseTilesUrl}
            mapWidth={gameState.mapWidth}
            mapHeight={gameState.mapHeight}
        />
        <ScrollingBackdrop
            viewPort={viewPort}
            magnify={magnify}
            url={animatedTilesFrameUrl}
            mapWidth={gameState.mapWidth}
            mapHeight={gameState.mapHeight}
        />
    </>
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {
    const backdropSet = useBackdrops()

    return (
        <div style={{
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden',
            // border: '8px inset red'
        }}>
            {backdropSet?.levelType === 'platform' && (
                <PlatformBackdrops {...{ gameState, viewPort, magnify, backdropSet }} />
            )}
            {backdropSet?.levelType === 'overhead' && (
                <OverheadBackdrops {...{ gameState, viewPort, magnify, backdropSet }} />
            )}
            <SpriteLayerCanvas
                gameState={gameState}
                viewPort={viewPort}
            />
            {gameState.interactionAndTarget?.target.interaction?.dialog && (
                <ConversationBox dialog={gameState.interactionAndTarget.target.interaction.dialog} />
            )}
        </div>
    )
}