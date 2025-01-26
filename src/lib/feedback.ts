
export const rumble = (gamePad: Gamepad | undefined, params: GamepadEffectParameters & { duration: number }) => {

    // should return early if method not supported 
    const playEffect = gamePad?.vibrationActuator.playEffect;
    if (!playEffect) {
        return
    }

    const paramsWithDefaults: GamepadEffectParameters = {
        strongMagnitude: 1,
        weakMagnitude: .1,
        ...params,
    }
    gamePad?.vibrationActuator.playEffect('dual-rumble', paramsWithDefaults)
}