import { getVectorFrom, toNearestCardinalUnitVector } from "../../lib/geometry";
import { directionToVector, getDirection } from "../helpers";
import { GameCharacter, GameState } from "../types";


const wanderAbout = (npc: GameCharacter, state: GameState) => {

    npc.mind.task = 'Wander'

    if (state.cycleNumber % 300 === 0) {
        npc.mind.direction = undefined
        npc.vector = {
            xd: 0, yd: 0
        }
    }
    if (state.cycleNumber % 300 === 100) {
        switch (Math.floor(Math.random() * 5)) {
            case 0: {
                npc.mind.direction = 'Right'
                break;
            }
            case 1: {
                npc.mind.direction = 'Left'
                break;
            }
            case 2: {
                npc.mind.direction = 'Down'
                break;
            }
            case 3: {
                npc.mind.direction = 'Up'
                break;
            }
        }
    }

    if (npc.mind.direction) {
        const vector = directionToVector(npc.mind.direction, .3);
        npc.vector = { xd: vector.x, yd: vector.y};
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

    if (npc.mind.hostile) {
        chasePlayer(npc, state)
    } else if (npc.mind.task === 'Guard') {
        return
    } else {
        wanderAbout(npc, state)
    }

    npc.direction = getDirection(npc.vector.xd, npc.vector.yd)
}