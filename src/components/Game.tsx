import { Reducer, useCallback, useReducer, useRef } from "react"
import { useAssets } from "../context/asset-context"
import { FeedbackEvent, GameState, InputState, } from "../game-state"
import { makeInitalState } from "../lib/initial-state"
import { useSchedule } from "../hooks/use-schedule"
import { drawSceneFunction } from "../drawing"
import { useKeyBoard } from "../hooks/use-keyboard"
import { inputsToInputState } from "../game-state"
import { useGamepad } from "../hooks/use-gamepad"
import { runCycle } from "../game-state"
import { HealthBar } from "./HealthBar"

interface Props {
    mode?: string
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
    type: 'clear-feedback'
}


const myReducer: Reducer<GameState, GameStateAction> = (prevState: GameState, action: GameStateAction) => {
    switch (action.type) {
        case "tick": {
            return runCycle(prevState, action.inputs)
        }
        case 'clear-feedback': {
            return { ...prevState, feedbackEvents: [] }
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

export const Game = ({ mode }: Props) => {
    const assets = useAssets();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const keyMapRef = useRef<Record<string, boolean>>({})
    const gamePadRef = useRef<Record<number, Gamepad>>({})
    const [state, dispatch] = useReducer<Reducer<GameState, GameStateAction>>(
        myReducer,
        makeInitalState(),
    )

    const drawScene = useCallback(
        (canvas: HTMLCanvasElement | null) => drawSceneFunction(state, assets)(canvas),
        [state, assets]
    )

    const togglePaused = () => dispatch({ type: 'pause', value: !state.paused })
    const reset = () => dispatch({ type: 'reset' })

    const handleFeedback = useCallback((feedback: FeedbackEvent[]) => {

        feedback.forEach(event => console.log('handle', event))

        dispatch({ type: 'clear-feedback' })
    }, [dispatch])

    useSchedule(() => {
        if (state.paused) { return }

        const keyMap = keyMapRef.current;
        const gamePadIndex = Number(Object.keys(gamePadRef.current ?? {})[0])
        const gamePad = navigator.getGamepads()[gamePadIndex] ?? undefined
        handleFeedback(state.feedbackEvents)
        const inputState = inputsToInputState(keyMap, gamePad)
        dispatch({
            type: 'tick',
            inputs: inputState,
        })
        drawScene(canvasRef.current)
    }, 10)

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
        <button onClick={togglePaused}>pause</button>
        <button onClick={reset}>reset</button>
        <div>
            <HealthBar current={state.player.health.current} max={state.player.health.max} />
            <canvas
                style={{
                    border: '5px double black'
                }}
                ref={canvasRef}
                height={state.mapHeight}
                width={state.mapWidth}></canvas>
        </div>
    </div>

}