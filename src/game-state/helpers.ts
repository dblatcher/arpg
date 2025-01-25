import { Direction } from "@dblatcher/sprite-canvas";
import { Rect } from "../lib/geometry";
import { Obstable } from "./types";

export const obstacleToRect = (o: Obstable): Rect => ({ top: o.y, left: o.x, bottom: o.y + o.height, right: o.x + o.width })

export const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd) > Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    }
    return yd > 0 ? 'Down' : 'Up'
}
export const directionToUnitVector = (direction: Direction) => {
    switch (direction) {
        case "Up":
            return { xd: 0, yd: -1 }
        case "Down":
            return { xd: 0, yd: 1 }
        case "Left":
            return { xd: -1, yd: 0 }
        case "Right":
            return { xd: 1, yd: 0 }
    }
}
