'use client'
import React, { useState } from 'react'
import BattleshipGrid from './GameGrid'
import ShipPlacementGrid from './ShipPlacementGrid'

const Battleship: React.FC = () => {
  const [guesses, setGuesses] = useState<
    Record<string, 'miss' | 'hit' | 'sunk'>
  >({
    B4: 'miss',
    E5: 'hit',
    F5: 'sunk'
  })

  const [ships, set] = useState<any>()

  const handleCellClick = (coord: string) => {
    alert(`You clicked ${coord}`)
  }
  return (
    <div className='flex gap-12'>
      <h1>Battleship Game</h1>
      <BattleshipGrid guesses={guesses} onCellClick={handleCellClick} />
      <div>
        <pre>{JSON.stringify(ships, null, 2)}</pre>
      </div>
      <ShipPlacementGrid onComplete={ships => set(ships)} />
    </div>
  )
}

export default Battleship
