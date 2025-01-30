import { GameCharacter, GameState } from "../game-state";

const standardNpc = (x: number, y: number): GameCharacter => (
    {
        direction: 'Down',
        x, y,
        width: 40,
        height: 40,
        speed: .75,
        vector: {
            xd: 0, yd: 0
        },
        health: {
            max: 3,
            current: 3,
        },
    }
)

export const makeInitalState = (): GameState => ({
    feedbackEvents: [],
    player: {
        direction: 'Down',
        x: 300, y: 50,
        width: 40,
        height: 40,
        speed: 1,
        vector: {
            xd: 0, yd: 0
        },
        health: {
            max: 10,
            current: 10
        }
    },
    obstacles: [
        {
            x: 370,
            y: 30,
            width: 30,
            height: 100,
        },
        {
            x: 80,
            y: 140,
            width: 60,
            height: 30,
        },
        {
            x: 60,
            y: 240,
            width: 60,
            height: 30,
        },
    ],
    npcs: [
        standardNpc(20,100),
        standardNpc(65,100),
        standardNpc(165,160),
        standardNpc(150,200),
    ],
    mapHeight: 600,
    mapWidth: 600,
    cycleNumber: 0,
    paused: false,
})
