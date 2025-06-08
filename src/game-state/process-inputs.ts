import { InputState } from "./types";

const DIAGONAL_UNIT = Math.cos(45);

type ButtonState = Omit<InputState, 'xd' | 'yd'>

const digitalKeysToInput = (
    leftKey = false,
    rightKey = false,
    upKey = false,
    downKey = false,
    runKey = false,
    buttons: ButtonState
): InputState => {
    const xSign = leftKey == rightKey ? 0 : leftKey ? -1 : 1;
    const ySign = upKey == downKey ? 0 : upKey ? -1 : 1;
    if (!xSign && !ySign) {
        return buttons
    }
    const normalisedSpeed = (xSign && ySign ? DIAGONAL_UNIT : 1) * (runKey ? 1 : .5)
    const xd = xSign * normalisedSpeed
    const yd = ySign * normalisedSpeed
    return { xd, yd, ...buttons }
}

// TO DO - figure out how mapping works
//d-pad
// up = 12
// down = 13
// left = 14
// right = 15
// left-shoulder = 4


export const inputsToInputState = (keyboard: Record<string, boolean>, gamepad?: Gamepad, previousInput?: InputState): InputState => {

    const [
        leftKey = false,
        rightKey = false,
        upKey = false,
        downKey = false,
        runKey = false,
        attackButton = false,
        jumpButton = false,
        interactButton = false,
    ] = [
            keyboard['KeyA'] || gamepad?.buttons[14]?.pressed,
            keyboard['KeyD'] || gamepad?.buttons[15]?.pressed,
            keyboard['KeyW'] || gamepad?.buttons[12]?.pressed,
            keyboard['KeyS'] || gamepad?.buttons[13]?.pressed,
            keyboard['ShiftLeft'] || gamepad?.buttons[4]?.pressed,
            keyboard['KeyJ'] || gamepad?.buttons[1]?.pressed,
            keyboard['KeyK'] || gamepad?.buttons[0]?.pressed,
            keyboard['KeyL'] || gamepad?.buttons[3]?.pressed,
        ]

    const interactDown = interactButton && !previousInput?.interactButton;
    const buttons: ButtonState = { attackButton, jumpButton, interactButton, interactDown }

    if (gamepad?.axes) {
        const [leftRight, upDown] = gamepad.axes.map(value => Math.abs(value) <= .15 ? 0 : value);
        if (Math.abs(leftRight) || Math.abs(upDown)) {
            return { xd: leftRight, yd: upDown, ...buttons }
        }
    }

    return digitalKeysToInput(leftKey, rightKey, upKey, downKey, runKey, buttons)
}

