import { GameState, Result } from '../types'

const ROWS = 'ABCDEFGHIJ'
const COLS = 10
const SHIP_LENGTHS = [5, 4, 3, 3, 2] // Carrier, Battleship, Cruiser, Submarine, Destroyer

const toCoord = (row: number, col: number): string => `${ROWS[row]}${col + 1}`
const fromCoord = (coord: string): [number, number] => [
  ROWS.indexOf(coord[0]),
  parseInt(coord.slice(1)) - 1
]

const getAllCoords = (): string[] =>
  Array.from({ length: 10 * 10 }, (_, i) => toCoord(Math.floor(i / 10), i % 10))

const getGuessedMap = (guesses: GameState['guesses']): Record<string, Result> =>
  guesses.reduce((map, g) => {
    map[g.coord] = g.result
    return map
  }, {} as Record<string, Result>)

const isValidPlacement = (
  startRow: number,
  startCol: number,
  length: number,
  isHorizontal: boolean,
  guessedMap: Record<string, Result>
): boolean => {
  for (let i = 0; i < length; i++) {
    const r = startRow + (isHorizontal ? 0 : i)
    const c = startCol + (isHorizontal ? i : 0)
    if (r >= 10 || c >= 10) return false
    const coord = toCoord(r, c)
    if (guessedMap[coord] === 'miss') return false
    if (guessedMap[coord] === 'sunk') return false
  }
  return true
}

const getHeatMap = (
  guessedMap: Record<string, Result>
): Record<string, number> => {
  const heatMap: Record<string, number> = {}
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      for (const len of SHIP_LENGTHS) {
        for (const isH of [true, false]) {
          if (!isValidPlacement(r, c, len, isH, guessedMap)) continue
          for (let i = 0; i < len; i++) {
            const row = r + (isH ? 0 : i)
            const col = c + (isH ? i : 0)
            const coord = toCoord(row, col)
            if (!guessedMap[coord]) {
              heatMap[coord] = (heatMap[coord] || 0) + 1
            }
          }
        }
      }
    }
  }
  return heatMap
}

export const chooseNextGuess = (gameState: GameState): string => {
  const guessedMap = getGuessedMap(gameState.guesses)
  const heatMap = getHeatMap(guessedMap)

  const unguessed = getAllCoords().filter(c => !(c in guessedMap))
  if (unguessed.length === 0) throw new Error('No moves left')

  // Choose the highest probability unguessed square
  let bestCoord = ''
  let maxScore = -1

  for (const coord of unguessed) {
    const score = heatMap[coord] || 0
    if (score > maxScore) {
      maxScore = score
      bestCoord = coord
    }
  }

  // If heat map is blank (e.g. very early game), choose random checkerboard cell
  if (!bestCoord) {
    const checkerboard = unguessed.filter(c => {
      const [r, col] = fromCoord(c)
      return (r + col) % 2 === 0
    })
    const pool = checkerboard.length > 0 ? checkerboard : unguessed
    bestCoord = pool[Math.floor(Math.random() * pool.length)]
  }

  return bestCoord
}
