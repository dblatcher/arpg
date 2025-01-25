import { ranger } from "./sprites";
import { GameCharacter, GameState } from "../game-state";
import { AssetKey } from "../assets-defs";
import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";

const progressionFrame = ({ duration, remaining }: { duration: number, remaining: number }): number => {
    return Math.round(((duration - remaining) / duration) * 3)
}

export const drawCharacter = (
    character: GameCharacter,
    state: GameState,
    drawSprite: DrawSpriteFunction<AssetKey>,
    ctx: CanvasRenderingContext2D,
) => {
    const speed = Math.abs(character.vector.xd) + Math.abs(character.vector.yd)
    const animation = (character.health.current <= 0 || character.reeling) ? 'reel' : character.attack ? 'attack' : speed <= 0
        ? 'idle'
        : speed < .6
            ? 'walk'
            : 'run'

    const frameIndex = character.attack
        ? progressionFrame(character.attack)
        : Math.floor(state.cycleNumber / 25) % 4;

    const blink = character.health.current <= 0 || animation === 'reel' && state.cycleNumber % 25 <= 10
    // safari doesn't support filter
    // produces a pinky red on the ranger sprite
    ctx.filter = blink ? "brightness(400%) hue-rotate(310deg) saturate(490%)" : 'none'

    drawSprite({
        key: 'RANGER_IDLE',
        ...ranger.getFrame(animation, character.reeling?.direction ?? character.direction, frameIndex),
        x: character.x + character.width / 2,
        y: character.y + character.height / 2,
        width: animation === 'attack' ? 2 * character.width : (4 / 3) * character.width,
        center: true,
        height: character.height,
    })
    ctx.filter = "none"
}