import { getVectorFrom, toNearestCardinalUnitVector, toUnitVector } from "../../lib/geometry";
import { getDirection } from "../helpers";
import { GameCharacter, GameState } from "../types";


const wanderAbout = (npc: GameCharacter, state: GameState) => {
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
}

const chasePlayer = (npc: GameCharacter, state: GameState) => {
    if (state.cycleNumber % 200 === 0) {
        npc.vector = {
            xd: 0, yd: 0
        }
        return
    }

    if (state.cycleNumber % 100 === 10) {
        const unitVector = toNearestCardinalUnitVector(getVectorFrom(npc, state.player))
        npc.vector = {
            xd: unitVector.x,
            yd: unitVector.y,
        }
    }
}

export const updateNpc = (npc: GameCharacter, state: GameState) => {

    if (npc.reeling || npc.dying) {
        return
    }

    if (npc.health.current < npc.health.max) {
        chasePlayer(npc, state)
    } else {
        wanderAbout(npc, state)
    }

    npc.direction = getDirection(npc.vector.xd, npc.vector.yd)
}