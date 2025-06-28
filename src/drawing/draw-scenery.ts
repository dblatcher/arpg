import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { GameState, Scenery, SceneryCondition } from "../game-state";
import { scenerySprites } from "./scenery-sprites";
import { SceneryAnimation } from "./constants-and-types";



export const drawScenery = (
    sceneryItem: Scenery,
    state: GameState,
    drawSprite: DrawSpriteFunction<AssetKey>,
) => {

    const { spriteKey, spriteFilter= '' } = sceneryItem

    const sprite = scenerySprites[spriteKey];
    const animation:SceneryAnimation = sceneryItem.condition === SceneryCondition.Active ? 'active':'base'

     const frameIndex = Math.floor(state.cycleNumber / 25) % animation.length;

    drawSprite({
        ...sprite.getFrame(animation, 'Down', frameIndex),
        x: sceneryItem.x,
        y: sceneryItem.y,
        width: sceneryItem.width,
        height: sceneryItem.height,
        filter: spriteFilter,
    })
}