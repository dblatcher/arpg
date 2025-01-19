import { useEffect } from "react"


const determineInterval = (newTime: number, lastExecutionTime: number, delay: number): number => {
    const timeSinceLast = newTime - lastExecutionTime
    const timeToWait = Math.max(delay ?? 0 - timeSinceLast, 1)
    return timeToWait
}

export function useSchedule(callback: () => void, delay: number | null) {

    // Set up the interval.
    useEffect(() => {
        let timeoutId: number | undefined = undefined
        let lastExecutionTime = Date.now()

        const schedule = async (interval: number) => {
            const newTime = Date.now()
            timeoutId = window.setTimeout(() => {
                callback()
                if (typeof delay === 'number') {
                    schedule(determineInterval(newTime, lastExecutionTime, delay))
                    lastExecutionTime = newTime
                }

            }, interval)
        }

        if (typeof delay === 'number') {
            schedule(delay)
        }

        return () => {
            if (typeof timeoutId === 'number') {
                clearInterval(timeoutId)
            }
        }

    }, [delay, callback])
}