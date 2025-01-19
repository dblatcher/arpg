import { RefObject, useEffect } from "react"

type KeyMap = Record<string, boolean>

type KeyboardCommand = {
    key: string | string[]
    handler: { (event: KeyboardEvent): void }
}

const shouldIgnore = (event: KeyboardEvent) => {
    const { activeElement } = document
    if (activeElement) {
        if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
            return true
        }
        if (['Space', 'Enter'].includes(event.key) && activeElement.tagName !== 'BODY') {
            return true
        }
    }
    return false
}

export const useKeyBoard = (commands: KeyboardCommand[], keyMapRef: RefObject<KeyMap>) => {
    return useEffect(() => {
        const handleKeypress = (event: KeyboardEvent) => {
            if (shouldIgnore(event)) {
                return
            }
            const handlers = commands.filter(({ key }) => 
                typeof key === 'string' 
                    ? key === event.key 
                    : key.includes(event.key)).map(command => command.handler)
            handlers.forEach(handler => handler(event))
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!keyMapRef.current) {
                return
            }
            if (keyMapRef.current?.[event.code]) {
                return // key already down - don't trigger event again
            }
            keyMapRef.current[event.code] = true
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            delete keyMapRef.current?.[event.code]
        }

        window.addEventListener('keypress', handleKeypress)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keypress', handleKeypress)
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [commands, keyMapRef])
}