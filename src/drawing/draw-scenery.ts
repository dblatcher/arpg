import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { GameState, Scenery } from "../game-state";



export const drawScenery = (
    sceneryItem: Scenery,
    _state: GameState,
    drawSprite: DrawSpriteFunction<AssetKey>,
) => {

    const { image } = sceneryItem


    drawSprite({
        ...image,
        x: sceneryItem.x,
        y: sceneryItem.y,
        width: sceneryItem.width,
        height: sceneryItem.height,
        filter: undefined,
    })
}