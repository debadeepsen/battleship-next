import { GameState } from '../types'

const allCoords = (() => {
  const coords: string[] = []
  const rows = 'ABCDEFGHIJ'
  for (let r = 0; r < 10; r++) {
    for (let c = 1; c <= 10; c++) {
      coords.push(`${rows[r]}${c}`)
    }
  }
  return coords
})()

const getAdjacentCoords = (coord: string): string[] => {
  const rows = 'ABCDEFGHIJ'
  const row = coord[0]
  const col = parseInt(coord.slice(1))

  const rowIndex = rows.indexOf(row)
  const deltas = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // down
    [-1, 0] // up
  ]

  return deltas
    .map(([dr, dc]) => {
      const newRow = rows[rowIndex + dr]
      const newCol = col + dc
      if (newRow && newCol >= 1 && newCol <= 10) {
        return `${newRow}${newCol}`
      }
      return null
    })
    .filter((c): c is string => c !== null)
}

export const chooseNextGuess = (gameState: GameState): string => {
  const guessedSet = new Set(gameState.guesses.map(g => g.coord))
  const hits = gameState.guesses.filter(g => g.result === 'hit')

  // Try adjacent squares if there's a hit
  for (const hit of hits) {
    const adjacent = getAdjacentCoords(hit.coord)
    for (const coord of adjacent) {
      if (!guessedSet.has(coord)) {
        return coord
      }
    }
  }

  // Fallback to random hunting
  const unguessed = allCoords.filter(coord => !guessedSet.has(coord))

  // Simple checkerboard pattern to maximize efficiency
  const prioritized = unguessed.filter(coord => {
    const row = coord.charCodeAt(0) - 65
    const col = parseInt(coord.slice(1)) - 1
    return (row + col) % 2 === 0
  })

  const choices = prioritized.length > 0 ? prioritized : unguessed

  return choices[Math.floor(Math.random() * choices.length)]
}
