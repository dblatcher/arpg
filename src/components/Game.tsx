import { centeredViewPort } from "@dblatcher/sprite-canvas"
import { Reducer, useCallback, useReducer, useRef, useState } from "react"
import { SoundDeck } from "sound-deck"
import { FeedbackEvent, GameState, InputState, inputsToInputState, runCycle, } from "../game-state"
import { useGamepad } from "../hooks/use-gamepad"
import { useKeyBoard } from "../hooks/use-keyboard"
import { useSchedule } from "../hooks/use-schedule"
import { runFeedback } from "../lib/feedback"
import { makeInitalState } from "../lib/initial-state"
import { GameScreen } from "./GameScreen"
import { HealthBar } from "./HealthBar"
import { WaitingBackdropProvider } from "../context/WaitingBackdropProvider"
import { ScoreDisplay } from "./ScoreDisplay"
import { useBgm } from "../hooks/use-bgm"
import { getCurrentLevel } from "../game-state/helpers"

interface Props {
    quit: { (): void }
    soundDeck: SoundDeck
}

type GameStateAction = {
    type: 'tick'
    inputs: InputState
} | {
    type: 'pause',
    value: boolean,
} | {
    type: 'reset'
} | {
    type: 'set-feedback',
    events: FeedbackEvent[]
}


const myReducer: Reducer<GameState, GameStateAction> = (prevState: GameState, action: GameStateAction) => {
    switch (action.type) {
        case "tick": {
            return runCycle(prevState, action.inputs)
        }
        case 'set-feedback': {
            return { ...prevState, feedbackEvents: action.events }
        }
        case "pause":
            return {
                ...prevState,
                paused: action.value,
            }
        case "reset": {
            return makeInitalState()
        }
    }
}

const VIEW_WIDTH = 450;
const VIEW_HEIGHT = 400;

export const Game = ({ soundDeck, quit }: Props) => {
    const keyMapRef = useRef<Record<string, boolean>>({})
    const gamePadRef = useRef<Record<number, Gamepad>>({})
    const [initialGameState] = useState(makeInitalState())
    const [state, dispatch] = useReducer<Reducer<GameState, GameStateAction>>(
        myReducer,
        initialGameState,
    )

    const getGamepad = useCallback(() => {
        const gamePadIndex = Number(Object.keys(gamePadRef.current ?? {})[0])
        return navigator.getGamepads()[gamePadIndex] ?? undefined
    }, [gamePadRef])

    const handleFeedback = useCallback((feedback: FeedbackEvent[]) => {
        const remainingFeedback = runFeedback(feedback, soundDeck, getGamepad())
        dispatch({ type: 'set-feedback', events: remainingFeedback })
    }, [dispatch, getGamepad, soundDeck])

    useSchedule(() => {
        if (state.paused) { return }
        handleFeedback(state.feedbackEvents)
        const keyMap = keyMapRef.current;
        const inputState = inputsToInputState(keyMap, getGamepad())
        dispatch({
            type: 'tick',
            inputs: inputState,
        })
    }, 10)


    const togglePaused = () => dispatch({ type: 'pause', value: !state.paused })
    const reset = () => dispatch({ type: 'reset' })

    useKeyBoard([
        {
            key: 'p',
            handler: togglePaused,
        },
        {
            key: 'o',
            handler: reset,
        },
    ], keyMapRef)

    useGamepad(gamePadRef)

    useBgm(getCurrentLevel(state)?.bgm, state.paused, soundDeck)

    return <div>
        <header style={{ display: 'flex' }}>
            <button onClick={togglePaused}>{state.paused ? 'resume' : 'pause'}</button>
            <button onClick={reset}>reset</button>
            <button onClick={quit}>quit</button>
        </header>
        <div style={{ position: 'relative' }}>
            <WaitingBackdropProvider initialGameState={initialGameState} currentLevelId={state.currentLevelId}>
                <GameScreen
                    gameState={state}
                    viewPort={centeredViewPort(state.player, VIEW_WIDTH, VIEW_HEIGHT, state)}
                    magnify={1.2}
                />
                <HealthBar
                    style={{
                        position: 'absolute',
                        left: 10,
                        top: 10
                    }}
                    current={state.player.health.current}
                    max={state.player.health.max} />
                <ScoreDisplay score={state.score} style={{
                    position: 'absolute',
                    right: 10,
                    top: 10
                }} />
            </WaitingBackdropProvider>
        </div>
    </div>

}