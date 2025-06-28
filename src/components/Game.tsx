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
import { useWindowSize } from "../hooks/use-window-size"
import { SoundToggle } from "./SoundToggle"

interface Props {
    quit: { (): void }
    soundDeck: SoundDeck
}

type GameStateAction = {
    type: 'tick'
    inputs: InputState
    continueStateRef: { current: GameState }
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
            return runCycle(prevState, action.inputs, action.continueStateRef)
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

const calculateMagnification = (windowWidth: number) => {
    if (windowWidth < 600) {
        return 1
    }
    if (windowWidth > 1000) {
        return 1.4
    }
    return 1.2
}

const calculateViewportSize = (windowWidth: number, windowHeight: number, magnify: number) => {
    return {
        width: (windowWidth) / magnify,
        height: (windowHeight) / magnify,
    }
}

export const Game = ({ soundDeck, quit }: Props) => {
    const keyMapRef = useRef<Record<string, boolean>>({})
    const gamePadRef = useRef<Record<number, Gamepad>>({})
    const [initialGameState] = useState(makeInitalState())
    const continueStateRef = useRef(makeInitalState())
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
        const inputState = inputsToInputState(keyMap, getGamepad(), state.previousInput)
        dispatch({
            type: 'tick',
            inputs: inputState,
            continueStateRef,
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

    const isDead = state.player.health.current <= 0
    useBgm(isDead ? undefined : getCurrentLevel(state)?.bgm, state.paused, soundDeck)

    const { windowWidth, windowHeight } = useWindowSize()
    const magnify = calculateMagnification(windowWidth)
    const vpDims = calculateViewportSize(windowWidth, windowHeight, magnify)

    return <div style={{
        position: 'fixed',
        inset: 0
    }}>
        <WaitingBackdropProvider initialGameState={initialGameState} currentLevelId={state.currentLevelId}>
            <GameScreen
                gameState={state}
                viewPort={centeredViewPort(state.player, vpDims.width, vpDims.height, state)}
                magnify={magnify}
            />
            <header style={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%', gap: 5, padding: 3 }}>
                <button className="ui-button" onClick={togglePaused}>{state.paused ? 'resume' : 'pause'}</button>
                <button className="ui-button" onClick={reset}>reset</button>
                <button className="ui-button" onClick={quit}>quit</button>
                <HealthBar
                    current={state.player.health.current}
                    max={state.player.health.max} />
                <ScoreDisplay score={state.score} />
                <SoundToggle soundDeck={soundDeck} corner />
            </header>
        </WaitingBackdropProvider>
    </div>
}
