import { getDirection } from "../helpers";
import { GameCharacter, GameState } from "../types";

export const updateNpc = (npc: GameCharacter, state: GameState) => {

    if (npc.reeling || npc.dying) {
        return
    }

    if (state.cycleNumber % 300 === 0) {
        npc.vector = {
            xd: 0, yd: 0
        }
    }
    if (state.cycleNumber % 300 === 100) {
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
                npc.vector = { xd: 0, yd: .3 };
                break;
            }
            case 3: {
                npc.vector = { xd: 0, yd: -.3 };
                break;
            }
        }
    }
    npc.direction = getDirection(npc.vector.xd, npc.vector.yd)
}