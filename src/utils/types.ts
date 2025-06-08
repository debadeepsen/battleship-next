export type Result = 'hit' | 'miss' | 'sunk'

export type GameState = {
  guesses: Array<{
    coord: string
    result: Result
  }>
}