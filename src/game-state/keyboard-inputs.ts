import { InputState } from "./types";

const DIAGONAL_UNIT = Math.cos(45);
export const keyBoardToInputs = (keyboard: Record<string, boolean>): InputState => {

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
    return { xd, yd }
}