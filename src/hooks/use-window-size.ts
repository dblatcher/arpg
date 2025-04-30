import { useEffect, useState } from "react"


export const useWindowSize = () => {

    const [windowWidth, setWindowWidth] = useState(window?.innerWidth ?? 0)
    const [windowHeight, setWindowHeight] = useState(window?.innerHeight ?? 0)

    useEffect(() => {
        const onResize = () => {
            setWindowWidth(window.innerWidth)
            setWindowHeight(window.innerHeight)
        }
        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [setWindowWidth, setWindowHeight])

    return {
        windowHeight,
        windowWidth,
    }
}