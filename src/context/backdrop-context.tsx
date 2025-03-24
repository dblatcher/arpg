import { ReactNode, createContext, useContext } from "react";
import { GameState } from "../game-state";


type BackdropContextProps = {
    backdropUrls: string[]
}
export type BackdropProviderProps = {
    children: ReactNode
    loadingContent?: ReactNode
    initialGameState: GameState
    currentLevelId: string
}

export const BackdropContext = createContext<BackdropContextProps>({ backdropUrls: [] })

export const useBackdrops = () => useContext(BackdropContext).backdropUrls