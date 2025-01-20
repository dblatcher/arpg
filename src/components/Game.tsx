import { Reducer, useCallback, useReducer, useRef } from "react"
import { useAssets } from "../context/asset-context"
import { GameState, GameStateAction, InputState, makeInitalState, myReducer } from "../game-state"
import { useSchedule } from "../hooks/use-schedule"
import { drawSceneFunction } from "../drawing"
import { useKeyBoard } from "../hooks/use-keyboard"
import { keyBoardToInputs } from "../game-state/keyboard-inputs"

interface Props {
    mode?: string
}


export const Game = ({ mode }: Props) => {
    const assets = useAssets();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const keyMapRef = useRef<Record<string, boolean>>({})
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
        // to do - gamepad state
        dispatch({
            type: 'tick', inputs: {
                ...keyBoardToInputs(keyMapRef.current)
            }
        })
        requestAnimationFrame(() => drawScene(canvasRef.current))
    }, 10)

    useKeyBoard([
        {
            key: 'p',
            handler: togglePaused,
        }
    ], keyMapRef)

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