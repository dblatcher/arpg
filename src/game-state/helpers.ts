import { Direction } from "@dblatcher/sprite-canvas";
import { Rect, XY } from "../lib/geometry";
import { Obstable } from "./types";

export const obstacleToRect = (o: Obstable): Rect => ({ top: o.y, left: o.x, bottom: o.y + o.height, right: o.x + o.width })

export const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd) > Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    }
    return yd > 0 ? 'Down' : 'Up'
}
export const directionToUnitVector = (direction: Direction):XY => {
    switch (direction) {
        case "Up":
            return { x: 0, y: -1 }
        case "Down":
            return { x: 0, y: 1 }
        case "Left":
            return { x: -1, y: 0 }
        case "Right":
            return { x: 1, y: 0 }
    }
}
