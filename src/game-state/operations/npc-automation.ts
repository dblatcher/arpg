import { getDirection } from "../helpers";
import { GameCharacter, GameState } from "../types";

export const updateNpc = (npc: GameCharacter, state: GameState): GameCharacter => {
    if (state.cycleNumber % 200 === 0) {
        switch (Math.floor(Math.random() * 5)) {
            case 0: {
                npc.vector = { xd: .3, yd: 0 };
                break;
            }
            case 1: {
                npc.vector = { xd: -.3, yd: 0 };
                break;
            }
            case 2: {
                npc.vector = { xd: 0, yd: .3};
                break;
            }
            case 3: {
                npc.vector = { xd: 0, yd: -.3 };
                break;
            }
        }
    }
    if (state.cycleNumber % 200 === 50) {
        npc.vector = {
            xd: 0, yd: 0
        }
    }
    npc.direction = getDirection(npc.vector.xd, npc.vector.yd)
    return npc
}