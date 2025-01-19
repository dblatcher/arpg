import { GenericDataMap } from "@dblatcher/sprite-canvas";
import { ReactNode, createContext, useContext } from "react";
import { AssetKey, AssetMap } from "../assets-defs";


type AssetContextProps = {
    assets: AssetMap
}
export type AssetProviderProps = {
    children: ReactNode
    assetParams: GenericDataMap<AssetKey>
    loadingContent?: ReactNode
}

export const AssetContext = createContext<AssetContextProps>({ assets: {} as AssetMap })

export const useAssets = () => useContext(AssetContext).assets