

export const ROWS = 'ABCDEFGHIJ'
export const COLS = Array.from({ length: 10 }, (_, i) => i + 1)
export const SHIP_LENGTHS = [5, 4, 4, 3, 3, 3, 2, 2, 2]

export const SHIP_NAMES = {
    '5': 'Carrier',
    '4': 'Battleship',
    '3': 'Cruiser',
    '2': 'Destroyer',
}