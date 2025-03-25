import { doRectsIntersect } from "../lib/geometry"
import { getCurrentLevel, rectMiddleSlice, spaceToRect } from "./helpers"
import { runOverheadLevel } from "./overhead-operations"
import { runPlatformLevel } from "./platform-operations"
import { Exit, FeedbackEvent, FeedbackEventEventType, GameCharacter, GameState, InputState, Level } from "./types"



const handleExits = (level: Level, player: GameCharacter, state: GameState): GameState | undefined => {
    const playerRect = spaceToRect(player)
    const findExit = level.levelType === 'platform'
        ? (exit: Exit) => player.altitude === 0 && doRectsIntersect(spaceToRect(exit), rectMiddleSlice(playerRect))
        : (exit: Exit) => doRectsIntersect(spaceToRect(exit), playerRect)

    const exit = level.exits.find(findExit)
    if (!exit) {
        return undefined
    }
    const newLevel = state.levels.find(level => level.id === exit.destination.levelId)
    if (!newLevel) {
        console.error(`no level ${exit.destination.levelId}`)
        return undefined
    }

    return {
        ...state,
        mapHeight: newLevel.mapHeight,
        mapWidth: newLevel.mapWidth,
        currentLevelId: newLevel.id,
        player: {
            ...player,
            x: exit.destination.x,
            y: exit.destination.y,
            vector: { xd: 0, yd: 0 },
            altitude: 0,
        }
    }
}


export const runCycle = (state: GameState, inputs: InputState): GameState => {
    const newEvents: FeedbackEvent[] = []
    const player = structuredClone(state.player)
    const level = structuredClone(getCurrentLevel(state))
    if (!level) {
        console.error('NO LEVEL')
        return state
    }
    const cycleNumber = state.cycleNumber
    const addFeedback = (type: FeedbackEventEventType) => newEvents.push({ type, cycleNumber })

    const { npcs } = level

    const levelChangeState = handleExits(level, player, state);
    if (levelChangeState) {
        return levelChangeState
    }

    if (level.levelType === 'platform') {
        runPlatformLevel(level, state, player, inputs, addFeedback)
    } else if (level.levelType === 'overhead') {
        runOverheadLevel(level, state, player, inputs, addFeedback)
    }

    const feedbackEvents = [...state.feedbackEvents, ...newEvents]
    level.npcs = npcs.filter(npc => !npc.dying || npc.dying.remaining > 0)
    const currentLevelIndex = state.levels.findIndex(l => l.id === state.currentLevelId)

    return {
        ...state,
        feedbackEvents,
        cycleNumber: cycleNumber + 1,
        player,
        levels: [...state.levels.slice(0, currentLevelIndex), level, ...state.levels.slice(currentLevelIndex + 1)],
    }
}