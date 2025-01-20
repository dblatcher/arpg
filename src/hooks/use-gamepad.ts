import { RefObject, useCallback, useEffect } from "react";





export const useGamepad = (gamePadsRef: RefObject<Record<number, Gamepad>>) => {

    const gamepadHandler = useCallback((event: GamepadEvent, connected: boolean) => {
        const gamepad = event.gamepad;
        if (!gamePadsRef.current) {
            return
        }
        // Note:
        // gamepad === navigator.getGamepads()[gamepad.index]

        if (connected) {
            console.log('connected', gamepad)
            gamePadsRef.current[gamepad.index] = gamepad;
        } else {
            console.log('disconnected', gamepad)
            delete gamePadsRef.current[gamepad.index];
        }
    }, [gamePadsRef])


    useEffect(() => {

        const addGamePad = (e: GamepadEvent) => {
            gamepadHandler(e, true);
        }
        const removeGamePad = (e: GamepadEvent) => {
            gamepadHandler(e, false);
        }
        console.log('listening for gamepads')
        window.addEventListener(
            "gamepadconnected",
            addGamePad,
            false,
        );
        window.addEventListener(
            "gamepaddisconnected",
            removeGamePad,
            false,
        );
        return () => {
            window.removeEventListener(
                "gamepadconnected",
                addGamePad,
                false,
            );


            window.removeEventListener(
                "gamepaddisconnected",
                removeGamePad,
                false,
            );
        }

    }, [gamePadsRef, gamepadHandler])

}