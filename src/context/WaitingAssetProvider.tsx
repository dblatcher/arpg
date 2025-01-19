import { loadAssets } from "@dblatcher/sprite-canvas"
import { useState, useEffect } from "react"
import { AssetProviderProps, AssetContext } from "./asset-context"
import { AssetMap } from "../assets-defs"


export const WaitingAssetProvider = ({ children, assetParams, loadingContent }: AssetProviderProps) => {
    const [assetMap, setAssetMap] = useState<AssetMap | undefined>(undefined)
    useEffect(() => {
        loadAssets(assetParams).then(setAssetMap)
    }, [setAssetMap, assetParams])

    if (!assetMap) {
        return loadingContent
    }
    return <AssetContext.Provider value={{
        assets: assetMap
    }}>{children}</AssetContext.Provider>
}