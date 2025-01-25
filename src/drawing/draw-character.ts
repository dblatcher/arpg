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
    drawSprite: DrawSpriteFunction<AssetKey>
) => {
    const speed = Math.abs(character.vector.xd) + Math.abs(character.vector.yd)
    const animation = character.reeling ? 'reel' : character.attack ? 'attack' : speed <= 0
        ? 'idle'
        : speed < .6
            ? 'walk'
            : 'run'

    const frameIndex = character.attack
        ? progressionFrame(character.attack)
        : Math.floor(state.cycleNumber / 25) % 4;

    const blink = animation === 'reel' && state.cycleNumber % 30 <= 15
    if (blink) {
        return
    }

    drawSprite({
        key: 'RANGER_IDLE',
        ...ranger.getFrame(animation, character.reeling?.direction ?? character.direction, frameIndex),
        x: character.x + character.width / 2,
        y: character.y + character.height / 2,
        width: animation === 'attack' ? 2 * character.width : (4 / 3) * character.width,
        center: true,
        height: character.height,
    })
}