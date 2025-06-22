import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { GameState, Scenery } from "../game-state";
import { scenerySprites } from "./scenery-sprites";



export const drawScenery = (
    sceneryItem: Scenery,
    _state: GameState,
    drawSprite: DrawSpriteFunction<AssetKey>,
) => {

    const { spriteKey } = sceneryItem

    const sprite = scenerySprites[spriteKey];

    drawSprite({
        ...sprite.getFrame('base', 'Down', 0),
        x: sceneryItem.x,
        y: sceneryItem.y,
        width: sceneryItem.width,
        height: sceneryItem.height,
        filter: undefined,
    })
}