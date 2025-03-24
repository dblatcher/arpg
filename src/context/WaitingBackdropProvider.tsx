import { useEffect, useState } from "react"
import { BackdropContext, BackdropProviderProps } from "./backdrop-context"
import { useAssets } from "./asset-context"
import { generateBackdropUrl } from "../drawing"
import { GameState } from "../game-state"


export const WaitingBackdropProvider = ({ children, loadingContent, initialGameState, currentLevelId }: BackdropProviderProps) => {
    const [backdropUrls, setBackdropUrls] = useState<string[] | undefined>(undefined)
    const assets = useAssets()

    useEffect(() => {
        const level = initialGameState.levels.find(l => l.id === currentLevelId);
        if (!level) {
            throw new Error('no such level')
        }
        const { mapHeight: height, mapWidth: width, id } = level;
        const stateAtLevel: GameState = { ...initialGameState, currentLevelId, mapHeight: height, mapWidth: width }

        console.log('generating backdrop urls for level', { id, width, height },)
        const urlsList = [
            generateBackdropUrl(0)(stateAtLevel, assets),
            generateBackdropUrl(1)(stateAtLevel, assets),
            generateBackdropUrl(2)(stateAtLevel, assets),
            generateBackdropUrl(3)(stateAtLevel, assets),
        ]
        setBackdropUrls(urlsList)

        return () => {
            console.log('revoking backdrop urls')
            urlsList.forEach(URL.revokeObjectURL)
        }

    }, [setBackdropUrls, assets, initialGameState, currentLevelId])

    if (!backdropUrls) {
        return loadingContent
    }
    return <BackdropContext.Provider value={{
        backdropUrls: backdropUrls
    }}>{children}</BackdropContext.Provider>
}