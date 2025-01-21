export type XY = { x: number, y: number }
export type Circle = { x: number, y: number, r: number }
export type Rect = { top: number, left: number, bottom: number, right: number }

export const _90_DEG_LEFT = Math.PI * .5
export const _90_DEG_RIGHT = Math.PI * -.5
export const _360_DEG = Math.PI * 2
export const _DEG = Math.PI / 180

function getVectorX(magnitude: number, direction: number) { return magnitude * Math.sin(direction) }
function getVectorY(magnitude: number, direction: number) { return magnitude * Math.cos(direction) }

export const xy = (x: number, y: number): XY => ({ x, y })
export function getXYVector(magnitude: number, direction: number): XY { return { x: getVectorX(magnitude, direction), y: getVectorY(magnitude, direction) } }

export const getHeading = (vector: XY): number => {
    const { x, y } = vector
    if (x == 0 && y == 0) { return 0; }
    if (y == 0 && x != 0) {
        return x < 0 ? Math.PI * 1.5 : Math.PI * 0.5;
    }
    if (x == 0 && y != 0) {
        return y > 0 ? 0 : Math.PI * 1;
    }
    return (y > 0) ? Math.atan(x / y) : Math.PI + Math.atan(x / y)
}


export const normaliseHeading = (h: number): number => {
    const hr = h % (_360_DEG)
    return hr > 0 ? hr : (_360_DEG) + hr
}
export const getVectorFrom = (p1: XY, p2: XY): XY => ({
    x: p2.x - p1.x,
    y: p2.y - p1.y,
})

export const getHeadingFrom = (p1: XY, p2: XY): number => getHeading(getVectorFrom(p1, p2))

export const translate = (position: XY, vector: XY): XY => ({
    x: position.x + vector.x,
    y: position.y + vector.y,
})

export const translateZ = (position: XY, z: number): XY => ({
    x: position.x + z / 2,
    y: position.y - z
})

export const getDistance = (p1: XY, p2: XY): number => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export const isPointInsideRect = (point: XY, rect: Rect): boolean => {
    const { top, left, bottom, right } = rect
    return !(
        point.y <= top ||
        point.y >= bottom ||
        point.x <= left ||
        point.x >= right
    )
}

const oneVerticalyContainsTheOther = (r1: Rect, r2: Rect): boolean => {
    return (r1.bottom <= r2.bottom && r1.top >= r2.top) || (r2.bottom <= r1.bottom && r2.top >= r1.top)
}
const oneHorizontallyContainsTheOther = (r1: Rect, r2: Rect): boolean => {
    return (r1.right <= r2.right && r1.left >= r2.left) || (r2.right <= r1.right && r2.left >= r1.left)
}

export const doRectsIntersect = (r1: Rect, r2: Rect): boolean => {
    return isPointInsideRect({ x: r1.left, y: r1.top }, r2) ||
        isPointInsideRect({ x: r1.left, y: r1.bottom }, r2) ||
        isPointInsideRect({ x: r1.right, y: r1.top }, r2) ||
        isPointInsideRect({ x: r1.right, y: r1.bottom }, r2) ||
        isPointInsideRect({ x: r2.left, y: r2.top }, r1) ||
        isPointInsideRect({ x: r2.left, y: r2.bottom }, r1) ||
        isPointInsideRect({ x: r2.right, y: r2.top }, r1) ||
        isPointInsideRect({ x: r2.right, y: r2.bottom }, r1) ||
        (oneHorizontallyContainsTheOther(r1, r2) && oneVerticalyContainsTheOther(r1, r2))
}

export const doCircleIntersect = (c1: Circle, c2: Circle): boolean => {
    return getDistance(c1, c2) < c1.r + c2.r
}

export const findClosestAndDistance = <T extends XY,>(list: T[], point: XY): { item?: T, distance: number } => {
    if (list.length === 0) { return { distance: Infinity } }

    const itemsWithDistances = list.map(item => {
        return { item, distance: getDistance(point, item) }
    })

    let [closestSoFar] = itemsWithDistances
    itemsWithDistances.forEach(nextItem => {
        if (closestSoFar.distance > nextItem.distance) {
            closestSoFar = nextItem
        }
    })
    return closestSoFar
}

export const findRotationBetweenHeadings = (start: number, end: number): number => {
    const normalisedStart = normaliseHeading(start)
    const normalisedTarget = normaliseHeading(end)
    let adjustedTarget = normalisedTarget
    if (normalisedStart - normalisedTarget > _360_DEG / 2) {
        adjustedTarget = normalisedTarget + _360_DEG
    } else if (normalisedStart - normalisedTarget < -_360_DEG / 2) {
        adjustedTarget = normalisedTarget - _360_DEG
    }
    return (adjustedTarget - normalisedStart)
}

export const expandRect = (rect: Rect, margin: number): Rect => ({
    top: rect.top - margin,
    bottom: rect.bottom + margin,
    left: rect.left - margin,
    right: rect.right + margin,
})