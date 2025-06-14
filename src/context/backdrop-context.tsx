import { ReactNode, createContext, useContext } from "react";
import { GameState } from "../game-state";


export type PlatformBackdropSet = {
    levelType: 'platform',
    platformLayerUrl: string,
    backgroundLayers: {
        url: string,
        parallax: number,
    }[]
}
export type OverheadBackdropSet = {
    levelType: 'overhead',
    baseTilesUrl: string,
    animationTilesUrls: string[],
}

export type BackdropContextProps = PlatformBackdropSet | OverheadBackdropSet

export type BackdropProviderProps = {
    children: ReactNode
    loadingContent?: ReactNode
    initialGameState: GameState
    currentLevelId: string
}

export const BackdropContext = createContext<BackdropContextProps>({
    levelType: 'overhead',
    baseTilesUrl: '',
    animationTilesUrls: [],
})

export const useBackdrops = () => useContext(BackdropContext)