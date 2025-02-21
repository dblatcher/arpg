import { useEffect, useState } from "react"
import { BackdropContext, BackdropProviderProps } from "./backdrop-context"
import { useAssets } from "./asset-context"
import { generateBackdropUrl } from "../drawing"


export const WaitingBackdropProvider = ({ children, loadingContent, initialGameState, currentLevelIndex }: BackdropProviderProps) => {
    const [backdropUrls, setBackdropUrls] = useState<string[] | undefined>(undefined)
    const assets = useAssets()

    useEffect(() => {

        console.log('generating backdrop urls for level', currentLevelIndex)
        const stateAtLevel = {...initialGameState, currentLevelIndex}
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

    }, [setBackdropUrls, assets, initialGameState, currentLevelIndex])

    if (!backdropUrls) {
        return loadingContent
    }
    return <BackdropContext.Provider value={{
        backdropUrls: backdropUrls
    }}>{children}</BackdropContext.Provider>
}