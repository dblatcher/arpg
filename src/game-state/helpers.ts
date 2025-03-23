import { Direction } from "@dblatcher/sprite-canvas";
import { Rect, XY } from "../lib/geometry";
import { GameState, Space } from "./types";

export const spaceToRect = (o: Space): Rect => ({ top: o.y, left: o.x, bottom: o.y + o.height, right: o.x + o.width })

export const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd) > Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    }
    return yd > 0 ? 'Down' : 'Up'
}
export const directionToUnitVector = (direction: Direction): XY => {
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

export const hasXOverlap = (spaceA: Space, spaceB: Space): boolean => {
    const rightEdge = spaceA.x + spaceA.width;
    return (
        spaceA.x >= spaceB.x && spaceA.x <= (spaceB.x + spaceB.width) ||
        rightEdge >= spaceB.x && rightEdge <= (spaceB.x + spaceB.width) ||
        spaceA.x < spaceB.x && rightEdge > (spaceB.x + spaceB.width)
    )
}
export const hasYOverlap = (spaceA: Space, spaceB: Space): boolean => {
    const bottomEdge = spaceA.y + spaceA.height;
    return (
        spaceA.y >= spaceB.y && spaceA.y <= (spaceB.y + spaceB.height) ||
        bottomEdge >= spaceB.y && bottomEdge <= (spaceB.y + spaceB.height) ||
        spaceA.y < spaceB.y && bottomEdge > (spaceB.y + spaceB.height)
    )
}

export const highestSpaceFirst = (spaceA: Space, spaceB: Space) => spaceA.y - spaceB.y;
export const lowestSpaceFirst = (spaceA: Space, spaceB: Space) => (spaceB.y + spaceB.height) - (spaceA.y + spaceB.height);

export const getLevelType = (state: GameState) => state.levels[state.currentLevelIndex]?.levelType ?? 'overhead'
