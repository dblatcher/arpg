import { Space, Terrain, Tile, Traversability } from "../game-state";
import { TILE_SIZE } from "../game-state/constants";

const letterToTile = (letter: string): Tile | undefined => {
    switch (letter) {
        case 'r':
            return {
                terrain: Terrain.Road,
                traversability: Traversability.Open
            }
        case 's':
            return {
                terrain: Terrain.Stone,
                traversability: Traversability.Blocking
            }
        case 'm':
            return {
                terrain: Terrain.MossyGround,
                traversability: Traversability.Open
            }
        case 'w':
            return {
                terrain: Terrain.Water,
                traversability: Traversability.Blocking
            }
        case 'f':
            return {
                terrain: Terrain.Waterfall,
                traversability: Traversability.Blocking
            }
        case 'F':
            return {
                terrain: Terrain.Splash,
                traversability: Traversability.Blocking
            }
        case 'c':
            return {
                terrain: Terrain.Cave,
                traversability: Traversability.Open
            }
    }
}

export const stringToTileMap = (input: string, width: number, height: number, defaultTile: Tile = {
    terrain: Terrain.Grass,
    traversability: Traversability.Open
}): Tile[][] => {
    const characterRows = input.split("\n").filter(row => row.length > 0)
    while (characterRows.length < height) {
        characterRows.push(" ")
    }
    const letterGrid = characterRows.map(row => row.padEnd(width, " ").split(''))
    const tileGrid = letterGrid.map(row => row.map((letter) => letterToTile(letter) ?? defaultTile))
    return tileGrid
}

export const stringToBackdropTiles = (input: string, width: number, height: number,): (Terrain | undefined)[][] => {
    const characterRows = input.split("\n").filter(row => row.length > 0)
    while (characterRows.length < height) {
        characterRows.push(" ")
    }
    const letterGrid = characterRows.map(row => row.padEnd(width, " ").split(''))

    const tileGrid = letterGrid.map(row => row.map((letter) => letterToTile(letter)?.terrain))
    return tileGrid

}

export const tileMapToObstacles = (tileMap: Tile[][]): Space[] => {

    const blockedTiles: Space[] = []

    tileMap.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
            if (tile.traversability === Traversability.Blocking) {
                blockedTiles.push({
                    x: tileIndex * TILE_SIZE,
                    y: rowIndex * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                })
            }
        })
    })

    // TO DO - consolodate groups of tiles into larger rectangles to make
    // checking if a space is blocked more efficient
    // OR - have the movement functions use the tileMap to check if a space is
    // open rather than the obstacle array?
    return blockedTiles
}