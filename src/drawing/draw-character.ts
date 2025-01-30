import { ranger } from "./sprites";
import { GameCharacter, GameState } from "../game-state";
import { AssetKey } from "../assets-defs";
import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";

const progressionFrame = ({ duration, remaining }: { duration: number, remaining: number }): number => {
    return Math.round(((duration - remaining) / duration) * 3)
}

const PINKY_FLASH = "brightness(400%) hue-rotate(310deg) saturate(490%)";

const getFilter = (cycleNumber: number, { dying, reeling }: GameCharacter): string => {
    const blink = cycleNumber % 25 <= 10;
    if (dying) {
        const { duration, remaining } = dying;
        const percent = 100 * remaining / duration;
        return blink ? `${PINKY_FLASH} opacity(${percent}%)` : `opacity(${percent}%)`
    }
    if (reeling && blink) {
        return PINKY_FLASH
    }
    return 'none'
}

export const drawCharacter = (
    character: GameCharacter,
    state: GameState,
    drawSprite: DrawSpriteFunction<AssetKey>,
    ctx: CanvasRenderingContext2D,
) => {
    const speed = Math.abs(character.vector.xd) + Math.abs(character.vector.yd)
    const animation = (character.dying || character.reeling) ? 'reel' : character.attack ? 'attack' : speed <= 0
        ? 'idle'
        : speed < .6
            ? 'walk'
            : 'run'

    const direction = character.dying ? 'Up' : character.reeling?.direction ?? character.direction

    const frameIndex = character.attack
        ? progressionFrame(character.attack)
        : Math.floor(state.cycleNumber / 25) % 4;

    ctx.filter = getFilter(state.cycleNumber, character)

    drawSprite({
        key: 'RANGER_IDLE',
        ...ranger.getFrame(animation, direction, frameIndex),
        x: character.x + character.width / 2,
        y: character.y + character.height / 2,
        width: animation === 'attack' ? 2 * character.width : (4 / 3) * character.width,
        center: true,
        height: character.height,
    })
    ctx.filter = "none"
}