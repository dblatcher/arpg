import { Reducer, useCallback, useReducer, useRef } from "react"
import { useAssets } from "../context/asset-context"
import { GameState, GameStateAction, InputState, makeInitalState, myReducer } from "../game-state"
import { useSchedule } from "../hooks/use-schedule"
import { drawSceneFunction } from "../drawing"

interface Props {
    mode?: string
}

export const Game = ({ mode }: Props) => {
    const assets = useAssets();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const inputsRef = useRef<InputState>({
        xd: 0,
        yd: .1,
    })
    const [state, dispatch] = useReducer<Reducer<GameState, GameStateAction>>(
        myReducer,
        makeInitalState(),
    )

    const drawScene = useCallback(
        (canvas: HTMLCanvasElement | null) => drawSceneFunction(state, assets)(canvas),
        [state, assets]
    )

    const changeXInput = (xd: number) => {
        const { current: old } = inputsRef;
        inputsRef.current = { ...old, xd }
    }
    const changeYInput = (yd: number) => {
        const { current: old } = inputsRef;
        inputsRef.current = { ...old, yd }
    }

    useSchedule(() => {
        if (state.paused) { return }
        dispatch({ type: 'tick', inputs: inputsRef.current })
        requestAnimationFrame(() => drawScene(canvasRef.current))
    }, 10)

    return <div>
        <h2>Game {mode ?? 'normal'}</h2>
        <button onClick={() => dispatch({ type: 'pause', value: !state.paused })}>pause</button>
        <div>
            <canvas
                style={{
                    border: '5px double black'
                }}
                ref={canvasRef}
                height={state.mapHeight}
                width={state.mapWidth}></canvas>
        </div>


        <button onClick={() => changeYInput(-.2)}>U</button>
        <div>
            <button onClick={() => changeXInput(-.2)}>L</button>
            <button onClick={() => {
                changeXInput(0)
                changeYInput(0)
            }}>-</button>
            <button onClick={() => changeXInput(.2)}>R</button>
        </div>
        <button onClick={() => changeYInput(.2)}>D</button>
    </div>

}