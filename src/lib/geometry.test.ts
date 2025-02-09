import { describe, expect, test } from 'vitest'
import { doRectsIntersect } from './geometry'


/** diagram
 * aaaaaaaaa
 * a       a
 * a       a 
 * a       a 
 * aaaaaaaaa 
 */

describe(doRectsIntersect.name, () => {

    /**
     * aaaaaaaaa
     * a       a
     * a    bbbbbbb
     * a    b  a  b
     * aaaaabaaa  b
     *      b     b
     *      bbbbbbb
     */
    test('returns true when one corner is inside the other rect', () => {
        const rectA = {
            top: 10, left: 10,
            bottom: 50, right: 100
        }
        const rectB = {
            top: 15, left: 15,
            bottom: 60, right: 110
        }

        expect(doRectsIntersect(rectA, rectB)).toBe(true)
        expect(doRectsIntersect(rectB, rectA)).toBe(true)
    })

    /**
     * aaaaaaaaa
     * a       a
     * a       a bbbbb
     * a       a b   b
     * aaaaaaaaa b   b
     *           bbbbb
     *
     */
    test('returns false when no overlap and not aligned or contained on either axis', () => {
        const rectA = {
            top: 10, left: 10,
            bottom: 50, right: 100
        }
        const rectB = {
            top: 15, left: 110,
            bottom: 120, right: 150
        }

        expect(doRectsIntersect(rectA, rectB)).toBe(false)
        expect(doRectsIntersect(rectB, rectA)).toBe(false)
    })


    /**
     * aaaaaaaaa
     * a       a
     * bbbbbbbbb 
     * b       b 
     * baaaaaaab
     * b       b 
     * b       b 
     * b       b 
     * bbbbbbbbb 
     */
    test('returns true when overlapping aligned horizontally', () => {
        const rectA = {
            top: 10, left: 10,
            bottom: 50, right: 100
        }
        const rectB = {
            top: 15, left: 10,
            bottom: 120, right: 100
        }

        expect(doRectsIntersect(rectA, rectB)).toBe(true)
        expect(doRectsIntersect(rectB, rectA)).toBe(true)
    })

    /** 
     * aaaaabbbbbb
     * a    b a  b
     * a    b a  b
     * aaaaabbbbbb
     */
    test('returns true when overlapping aligned vertically', () => {
        const rectA = {
            top: 10, left: 10,
            bottom: 50, right: 100
        }
        const rectB = {
            top: 10, left: 90,
            bottom: 50, right: 150
        }

        expect(doRectsIntersect(rectA, rectB)).toBe(true)
        expect(doRectsIntersect(rectB, rectA)).toBe(true)
    })
})