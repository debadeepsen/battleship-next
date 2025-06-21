'use client'
import React, { useState } from 'react'
// import BattleshipGrid from './GameGrid'
import ShipPlacementGrid from './ShipPlacementGrid'
import { Dialog, DialogProps } from '@mui/material'

const Battleship: React.FC = () => {
  // const [guesses, setGuesses] = useState<
  //   Record<string, 'miss' | 'hit' | 'sunk'>
  // >({
  //   B4: 'miss',
  //   E5: 'hit',
  //   F5: 'sunk'
  // })

  const [ships, set] = useState<any>()
  const [showPlacementModal, setShowPlacementModal] = useState(false)

  // const handleCellClick = (coord: string) => {
  //   alert(`You clicked ${coord}`)
  // }

  const handleClose: DialogProps['onClose'] = (_event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      // Prevent closing on outside click or Esc key
      return
    }
    setShowPlacementModal(false)
  }

  return (
    <div className='flex flex-col gap-12 bg-white dark:bg-zinc-900/70 p-8 rounded-lg shadow-md w-100 max-w-[800px] mx-auto'>
      <h1 className='text-center'>Battleship Game</h1>
      {/* <BattleshipGrid guesses={guesses} onCellClick={handleCellClick} />
      <div>
        <pre>{JSON.stringify(ships, null, 2)}</pre>
      </div> */}
      <button onClick={() => setShowPlacementModal(true)}>New Game</button>

      <Dialog
        open={showPlacementModal}
        onClose={handleClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <ShipPlacementGrid
          onComplete={ships => set(ships)}
          onClose={() => setShowPlacementModal(false)}
        />
      </Dialog>
    </div>
  )
}

export default Battleship
