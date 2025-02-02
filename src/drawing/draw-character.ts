import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { GameCharacter, GameState } from "../game-state";
import { CharacterSprite } from "./constants-and-types";

const progressionFrame = ({ duration, remaining }: { duration: number, remaining: number }): number => {
    return Math.round(((duration - remaining) / duration) * 3)
}

const PINKY_FLASH = "brightness(400%) hue-rotate(310deg) saturate(490%)";

const getFilter = (cycleNumber: number, { dying, reeling }: GameCharacter): string | undefined => {
    const blink = cycleNumber % 25 <= 10;
    if (dying) {
        const { duration, remaining } = dying;
        const percent = 100 * remaining / duration;
        return blink ? `${PINKY_FLASH} opacity(${percent}%)` : `opacity(${percent}%)`
    }
    if (reeling && blink) {
        return PINKY_FLASH
    }
    return undefined
}

export const drawCharacter = (
    character: GameCharacter,
    state: GameState,
    sprite: CharacterSprite,
    drawSprite: DrawSpriteFunction<AssetKey>,
    baseFilter?: string,
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

    const filter = [baseFilter, getFilter(state.cycleNumber, character) ].flatMap(i => i ? i : []).join(" ")

    drawSprite({
        ...sprite.getFrame(animation, direction, frameIndex),
        x: character.x,
        y: character.y,
        width: character.width,
        height: character.height,
        filter
    })
}