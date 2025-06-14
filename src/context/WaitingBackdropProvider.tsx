import { useEffect, useState } from "react"
import { generateBackdropUrl } from "../drawing"
import { GameState } from "../game-state"
import { useAssets } from "./asset-context"
import { BackdropContext, BackdropContextProps, BackdropProviderProps } from "./backdrop-context"


export const WaitingBackdropProvider = ({ children, loadingContent, initialGameState, currentLevelId }: BackdropProviderProps) => {
    const [backdropContext, setBackdropContext] = useState<BackdropContextProps>()
    const assets = useAssets()

    useEffect(() => {
        const level = initialGameState.levels.find(l => l.id === currentLevelId);
        if (!level) {
            throw new Error('no such level')
        }
        const { mapHeight, mapWidth, id } = level;
        const stateAtLevel: GameState = { ...initialGameState, currentLevelId, mapHeight, mapWidth }

        console.log('generating backdrop urls for level', { id, mapWidth, mapHeight })
        const allUrls: string[] = [];

        switch (level.levelType) {
            case "overhead": {
                const baseTilesUrl = generateBackdropUrl(0)(stateAtLevel, assets)
                const animationTilesUrls = [
                    generateBackdropUrl(1)(stateAtLevel, assets),
                    generateBackdropUrl(2)(stateAtLevel, assets),
                    generateBackdropUrl(3)(stateAtLevel, assets),
                ]
                allUrls.push(baseTilesUrl, ...animationTilesUrls);

                setBackdropContext({
                    levelType: 'overhead',
                    baseTilesUrl: baseTilesUrl,
                    animationTilesUrls: animationTilesUrls,
                })
                break;
            }

            case "platform": {
                const platformLayerUrl = generateBackdropUrl(0)(stateAtLevel, assets)
                const layerUrlList = [
                    generateBackdropUrl(1)(stateAtLevel, assets),
                    generateBackdropUrl(2)(stateAtLevel, assets),
                    generateBackdropUrl(3)(stateAtLevel, assets),
                ]
                allUrls.push(platformLayerUrl, ...layerUrlList);

                setBackdropContext({
                    levelType: 'platform',
                    platformLayerUrl: platformLayerUrl,
                    backgroundLayers: layerUrlList.map((url, index) => ({
                        url,
                        parallax: level.backdrops[index]?.parallax
                    }))
                })
                break;
            }
        }

        return () => {
            console.log('revoking backdrop urls', allUrls.length);
            allUrls.forEach(URL.revokeObjectURL);
        }

    }, [setBackdropContext, assets, initialGameState, currentLevelId])

    if (!backdropContext) {
        return loadingContent
    }
    return <BackdropContext.Provider value={backdropContext}>{children}</BackdropContext.Provider>
}