import { useEffect, useState } from "react"
import { BackdropContext, BackdropProviderProps } from "./backdrop-context"
import { useAssets } from "./asset-context"
import { generateBackdropUrl } from "../drawing"


export const WaitingBackdropProvider = ({ children, loadingContent, initialGameState }: BackdropProviderProps) => {
    const [backdropUrls, setBackdropUrls] = useState<string[] | undefined>(undefined)
    const assets = useAssets()

    useEffect(() => {

        console.log('generating backdrop urls')
        const urlsList = [
            generateBackdropUrl(0)(initialGameState, assets),
            generateBackdropUrl(1)(initialGameState, assets),
            generateBackdropUrl(2)(initialGameState, assets),
            generateBackdropUrl(3)(initialGameState, assets),
        ]
        setBackdropUrls(urlsList)

        return () => {
            console.log('revoking backdrop urls')
            urlsList.forEach(URL.revokeObjectURL)
        }

    }, [setBackdropUrls, assets, initialGameState])

    if (!backdropUrls) {
        return loadingContent
    }
    return <BackdropContext.Provider value={{
        backdropUrls: backdropUrls
    }}>{children}</BackdropContext.Provider>
}