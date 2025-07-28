import { Direction } from "@dblatcher/sprite-canvas";
import { Rect, XY } from "typed-geometry";
import { GameState, Space } from "./types";

export const spaceToRect = (o: Space): Rect => ({ top: o.y, left: o.x, bottom: o.y + o.height, right: o.x + o.width })

export const rectMiddleSlice = (rect: Rect) => {
    const width = rect.right - rect.left
    return {
        ...rect,
        left: rect.left + width / 2,
        right: rect.right - width / 2,
    }
}

export const getDirection = (xd: number, yd: number): Direction => {
    if (Math.abs(xd) > Math.abs(yd)) {
        return xd > 0 ? 'Right' : 'Left'
    }
    return yd > 0 ? 'Down' : 'Up'
}
export const directionToVector = (direction: Direction, distance: number): XY => {
    switch (direction) {
        case "Up":
            return { x: 0, y: -distance }
        case "Down":
            return { x: 0, y: distance }
        case "Left":
            return { x: -distance, y: 0 }
        case "Right":
            return { x: distance, y: 0 }
    }
}
export const directionToUnitVector = (direction: Direction): XY => directionToVector(direction, 1);

export const leftEdgeOf = (space: Space, width = 2): Space => ({
    x: space.x,
    y: space.y,
    height: space.height,
    width,
})
export const rightEdgeOf = (space: Space, width = 2): Space => ({
    x: space.x + space.width - width,
    y: space.y,
    height: space.height,
    width,
})

export const middleOf = (space: Space, proportion = .5): Space => ({
    x: space.x + (space.width * ((1 - proportion) / 2)),
    y: space.y,
    height: space.height,
    width: space.width * proportion,
})

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

export const getCurrentLevel = (state: GameState) => state.levels.find(l => l.id === state.currentLevelId);
export const getLevelType = (state: GameState) => getCurrentLevel(state)?.levelType ?? 'overhead';

export const toUnitVector = (xy: XY): XY => {
    const magnitude = Math.sqrt((xy.x ** 2) + (xy.y ** 2))
    return {
        x: xy.x / magnitude,
        y: xy.y / magnitude,
    }
}

export const toNearestCardinalUnitVector = (xy: XY): XY => {
    if (Math.abs(xy.x) > Math.abs(xy.y)) {
        return Math.sign(xy.x) < 0 ? { x: -1, y: 0 } : { x: 1, y: 0 }
    }
    return Math.sign(xy.y) < 0 ? { y: -1, x: 0 } : { y: 1, x: 0 }
}
