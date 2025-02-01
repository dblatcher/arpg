import { Reducer, useCallback, useEffect, useReducer, useRef, useState } from "react"
import { SoundDeck } from "sound-deck"
import { useAssets } from "../context/asset-context"
import { drawSceneFunction, generateBackdropUrl } from "../drawing"
import { FeedbackEvent, GameState, InputState, inputsToInputState, runCycle, } from "../game-state"
import { useGamepad } from "../hooks/use-gamepad"
import { useKeyBoard } from "../hooks/use-keyboard"
import { useSchedule } from "../hooks/use-schedule"
import { runFeedback } from "../lib/feedback"
import { makeInitalState } from "../lib/initial-state"
import { HealthBar } from "./HealthBar"
import { centeredViewPort } from "@dblatcher/sprite-canvas"

interface Props {
    mode?: string
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

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 400;

export const Game = ({ mode, soundDeck }: Props) => {
    const assets = useAssets();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const keyMapRef = useRef<Record<string, boolean>>({})
    const gamePadRef = useRef<Record<number, Gamepad>>({})
    const [state, dispatch] = useReducer<Reducer<GameState, GameStateAction>>(
        myReducer,
        makeInitalState(),
    )
    const [backdropUrl, setBackdropUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        console.log('backdrop generating')
        const url = generateBackdropUrl(makeInitalState(), assets)
        setBackdropUrl(url)
        return () => {
            console.log('revoking backdrop url')
            URL.revokeObjectURL(url)
        }
    }, [setBackdropUrl, assets])

    const drawScene = useCallback(
        (canvas: HTMLCanvasElement | null) => drawSceneFunction(state, assets, centeredViewPort(state.player, VIEW_WIDTH, VIEW_HEIGHT, state))(canvas),
        [state, assets]
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
        drawScene(canvasRef.current)
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

    return <div>
        <h2>Game {mode ?? 'normal'}</h2>
        <button onClick={togglePaused}>{state.paused ? 'resume' : 'pause'}</button>
        <button onClick={reset}>reset</button>
        <div>
            <HealthBar current={state.player.health.current} max={state.player.health.max} />
            <canvas
                style={{
                    border: '5px double black'
                }}
                ref={canvasRef}
                height={VIEW_HEIGHT}
                width={VIEW_WIDTH}></canvas>
        </div>
        <img src={backdropUrl}/>
    </div>

}