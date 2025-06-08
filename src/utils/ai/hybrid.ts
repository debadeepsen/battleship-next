import { GameState, Result } from '../types'

const ROWS = 'ABCDEFGHIJ'
const COLS = 10
const SHIP_LENGTHS = [5, 4, 3, 3, 2]

const toCoord = (r: number, c: number): string => `${ROWS[r]}${c + 1}`
const fromCoord = (coord: string): [number, number] => [
  ROWS.indexOf(coord[0]),
  parseInt(coord.slice(1)) - 1
]

const getAllCoords = (): string[] =>
  Array.from({ length: 100 }, (_, i) => toCoord(Math.floor(i / 10), i % 10))

const getGuessedMap = (guesses: GameState['guesses']): Record<string, Result> =>
  guesses.reduce(
    (map, g) => ((map[g.coord] = g.result), map),
    {} as Record<string, Result>
  )

const getAdjacentCoords = (coord: string): string[] => {
  const [r, c] = fromCoord(coord)
  const deltas = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ]
  return deltas
    .map(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc
      return nr >= 0 && nr < 10 && nc >= 0 && nc < 10 ? toCoord(nr, nc) : null
    })
    .filter((c): c is string => !!c)
}

const chooseByBasicAI = (gameState: GameState): string => {
  const guessed = new Set(gameState.guesses.map(g => g.coord))
  const hits = gameState.guesses.filter(g => g.result === 'hit')

  for (const hit of hits) {
    for (const adj of getAdjacentCoords(hit.coord)) {
      if (!guessed.has(adj)) return adj
    }
  }

  const unguessed = getAllCoords().filter(c => !guessed.has(c))
  const checkerboard = unguessed.filter(c => {
    const [r, col] = fromCoord(c)
    return (r + col) % 2 === 0
  })

  const pool = checkerboard.length ? checkerboard : unguessed
  return pool[Math.floor(Math.random() * pool.length)]
}

const isValidPlacement = (
  r: number,
  c: number,
  len: number,
  horizontal: boolean,
  guessedMap: Record<string, Result>
): boolean => {
  for (let i = 0; i < len; i++) {
    const nr = r + (horizontal ? 0 : i)
    const nc = c + (horizontal ? i : 0)
    if (nr >= 10 || nc >= 10) return false
    const coord = toCoord(nr, nc)
    if (guessedMap[coord] === 'miss' || guessedMap[coord] === 'sunk')
      return false
  }
  return true
}

const getHeatMap = (
  guessedMap: Record<string, Result>
): Record<string, number> => {
  const heat: Record<string, number> = {}
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      for (const len of SHIP_LENGTHS) {
        for (const horizontal of [true, false]) {
          if (!isValidPlacement(r, c, len, horizontal, guessedMap)) continue
          for (let i = 0; i < len; i++) {
            const nr = r + (horizontal ? 0 : i)
            const nc = c + (horizontal ? i : 0)
            const coord = toCoord(nr, nc)
            if (!guessedMap[coord]) {
              heat[coord] = (heat[coord] || 0) + 1
            }
          }
        }
      }
    }
  }
  return heat
}

const chooseByProbability = (gameState: GameState): string => {
  const guessedMap = getGuessedMap(gameState.guesses)
  const heat = getHeatMap(guessedMap)

  const unguessed = getAllCoords().filter(c => !(c in guessedMap))
  let best = ''
  let maxScore = -1

  for (const coord of unguessed) {
    const score = heat[coord] ?? 0
    if (score > maxScore) {
      maxScore = score
      best = coord
    }
  }

  return best || unguessed[Math.floor(Math.random() * unguessed.length)]
}

export const chooseNextGuess = (gameState: GameState): string => {
  const guessedCount = gameState.guesses.length
  const guessedPercent = (guessedCount / 100) * 100

  return guessedPercent < 70
    ? chooseByProbability(gameState)
    : chooseByBasicAI(gameState)
}
