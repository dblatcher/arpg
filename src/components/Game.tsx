import { Reducer, useCallback, useReducer, useRef } from "react"
import { useAssets } from "../context/asset-context"
import { GameState, GameStateAction, InputState, makeInitalState, myReducer } from "../game-state"
import { useSchedule } from "../hooks/use-schedule"
import { drawSceneFunction } from "../drawing"
import { useKeyBoard } from "../hooks/use-keyboard"

interface Props {
    mode?: string
}

const DIAGONAL_UNIT = Math.cos(45);
const updateInputsByKeyboard = (inputState: InputState, keyboard: Record<string, boolean>): InputState => {

    const [
        leftKey = false,
        rightKey = false,
        upKey = false,
        downKey = false,
        runKey = false,
    ] = [
            keyboard['KeyA'],
            keyboard['KeyD'],
            keyboard['KeyW'],
            keyboard['KeyS'],
            keyboard['ShiftLeft'],
        ]


    const xSign = leftKey == rightKey ? 0 : leftKey ? -1 : 1;
    const ySign = upKey == downKey ? 0 : upKey ? -1 : 1;

    const normalisedSpeed = (xSign && ySign ? DIAGONAL_UNIT : 1) * (runKey ? 1 : .5)

    const xd = xSign * normalisedSpeed 
    const yd = ySign * normalisedSpeed
    return { ...inputState, xd, yd }
}

export const Game = ({ mode }: Props) => {
    const assets = useAssets();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const inputsRef = useRef<InputState>({
        xd: 0,
        yd: .1,
    })
    const keyMapRef = useRef<Record<string, boolean>>({})
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
    const togglePaused = () => dispatch({ type: 'pause', value: !state.paused })

    useSchedule(() => {
        if (state.paused) { return }
        inputsRef.current = updateInputsByKeyboard(inputsRef.current, keyMapRef.current)
        dispatch({ type: 'tick', inputs: inputsRef.current })
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