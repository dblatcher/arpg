import { InputState } from "./types";

const DIAGONAL_UNIT = Math.cos(45);

const digitalKeysToInput = (
    leftKey = false,
    rightKey = false,
    upKey = false,
    downKey = false,
    runKey = false,
) => {
    const xSign = leftKey == rightKey ? 0 : leftKey ? -1 : 1;
    const ySign = upKey == downKey ? 0 : upKey ? -1 : 1;
    // if no input, return empty so previous inputs not overren
    if (!xSign && !ySign) {
        return {}
    }
    const normalisedSpeed = (xSign && ySign ? DIAGONAL_UNIT : 1) * (runKey ? 1 : .5)
    const xd = xSign * normalisedSpeed
    const yd = ySign * normalisedSpeed
    return { xd, yd }
}

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

    return digitalKeysToInput(leftKey, rightKey, upKey, downKey, runKey)
}

// TO DO - figure out how mapping works
//d-pad
// up = 12
// down = 13
// left = 14
// right = 15
// left-shoulder = 4

export const gamepadToInputs = (gamepad?: Gamepad): InputState => {

    if (!gamepad) {
        return {}
    }

    const [leftRight, upDown] = gamepad.axes;
    if (Math.abs(leftRight) > .15 || Math.abs(upDown) > .15) {
        return { xd: leftRight, yd: upDown }
    }

    const [
        leftKey = false,
        rightKey = false,
        upKey = false,
        downKey = false,
        runKey = false,
    ] = [
            gamepad.buttons[14]?.pressed,
            gamepad.buttons[15]?.pressed,
            gamepad.buttons[12]?.pressed,
            gamepad.buttons[13]?.pressed,
            gamepad.buttons[4]?.pressed,
        ]

    return digitalKeysToInput(leftKey, rightKey, upKey, downKey, runKey)
}