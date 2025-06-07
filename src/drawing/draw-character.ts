import { DrawSpriteFunction } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets-defs";
import { CharacterSpriteKey, GameCharacter, GameState, Level, Traversability } from "../game-state";
import { CharacterAnimation, CharacterSprite } from "./constants-and-types";
import { getLevelType } from "../game-state/helpers";
import { punisher } from "./punisher-sprite";
import { ranger } from "./ranger-sprite";


const characterSprites: Record<CharacterSpriteKey, CharacterSprite> = {
    ranger, punisher
}

const progressionFrame = ({ duration, remaining }: { duration: number, remaining: number }): number => {
    return Math.round(((duration - remaining) / duration) * 3)
}

const PINKY_FLASH = "brightness(400%) hue-rotate(310deg) saturate(490%)";

const getFilter = (cycleNumber: number, { dying, reeling, collisionsOff }: GameCharacter): string | undefined => {
    const blink = cycleNumber % 25 <= 10;
    if (collisionsOff) {
        return blink ? `opacity(${0}%)` : undefined
    }
    if (dying) {
        const { duration, remaining } = dying;
        const percent = 100 * remaining / duration;
        return blink ? `${PINKY_FLASH} opacity(${percent}%)` : `opacity(${percent}%)`
    }
    if (reeling) {
        return blink ? PINKY_FLASH : undefined
    }
    return undefined
}


const getAnimation = (character: GameCharacter, levelType: Level['levelType']): CharacterAnimation => {
    const speed = levelType === 'platform' ? Math.abs(character.vector.xd) : Math.abs(character.vector.xd) + Math.abs(character.vector.yd)

    if (character.dying || character.reeling || character.health.current <= 0) {
        return 'reel'
    }
    if (character.altitude > 0) {
        return Math.abs(character.vector.xd) > 1
            ? 'leap'
            : 'jump'
    }
    if (character.attack) {
        return 'attack'
    }

    if (character.currentTile?.traversability === Traversability.Climb) {
        return speed <= 0 ? 'climbIdle' : 'climbing'
    }

    return speed <= 0
        ? 'idle'
        : speed < .6
            ? 'walk'
            : 'run'

}

export const drawCharacter = (
    character: GameCharacter,
    state: GameState,
    drawSprite: DrawSpriteFunction<AssetKey>,
) => {

    const { spriteFilter = '', spriteKey } = character
    const sprite = characterSprites[spriteKey]
    const animation = getAnimation(character, getLevelType(state))

    const direction = character.dying ? 'Up' : character.reeling?.direction ?? character.direction

    const frameIndex = character.attack
        ? progressionFrame(character.attack)
        : Math.floor(state.cycleNumber / 25) % 4;

    const filter = [spriteFilter, getFilter(state.cycleNumber, character)].flatMap(i => i ? i : []).join(" ")

    drawSprite({
        ...sprite.getFrame(animation, direction, frameIndex),
        x: character.x,
        y: character.y,
        width: character.width,
        height: character.height,
        filter
    })
}