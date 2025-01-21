import { Reducer, useCallback, useReducer, useRef } from "react"
import { useAssets } from "../context/asset-context"
import { GameState, InputState, makeInitalState, } from "../game-state"
import { useSchedule } from "../hooks/use-schedule"
import { drawSceneFunction } from "../drawing"
import { useKeyBoard } from "../hooks/use-keyboard"
import { inputsToInputState } from "../game-state"
import { useGamepad } from "../hooks/use-gamepad"
import { runCycle } from "../game-state/run-cycle"

interface Props {
    mode?: string
}

type GameStateAction = {
    type: 'tick'
    inputs: InputState
} | {
    type: 'pause',
    value: boolean,
}


const myReducer: Reducer<GameState, GameStateAction> = (prevState: GameState, action: GameStateAction) => {
    switch (action.type) {
        case "tick": {
            return runCycle(prevState, action.inputs)
        }
        case "pause":
            return {
                ...prevState,
                paused: action.value,
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

    useSchedule(() => {
        if (state.paused) { return }
        const gamePadIndex = Number(Object.keys(gamePadRef.current ?? {})[0])
        const gamePad = navigator.getGamepads()[gamePadIndex] ?? undefined
        dispatch({
            type: 'tick',
            inputs: inputsToInputState(keyMapRef.current, gamePad),
        })
        requestAnimationFrame(() => {
            drawScene(canvasRef.current)
        })
    }, 10)

    useKeyBoard([
        {
            key: 'p',
            handler: togglePaused,
        }
    ], keyMapRef)

    useGamepad(gamePadRef)

    return <div>
        <h2>Game {mode ?? 'normal'}</h2>
        <button onClick={togglePaused}>pause</button>
        <div>
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