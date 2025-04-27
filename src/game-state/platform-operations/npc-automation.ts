import { getDirection } from "../helpers";
import { GameCharacter, GameState } from "../types";


const goLeft = (npc: GameCharacter, state: GameState) => {
    if (state.cycleNumber % 10 === 0) {
        npc.vector.xd = 0
    }
    npc.vector.xd = -.2;
}

export const updateNpc = (npc: GameCharacter, state: GameState) => {

    if (npc.reeling || npc.dying || npc.altitude > 0) {
        return
    }

    goLeft(npc, state)

    npc.direction = getDirection(npc.vector.xd, 0)
}