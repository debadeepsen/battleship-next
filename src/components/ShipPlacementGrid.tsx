import { COLS, ROWS, SHIP_LENGTHS, SHIP_NAMES } from '@/utils/constants'
import React, { DragEvent, Fragment, useRef, useState } from 'react'
import ShipButton from './ShipButton'

type Orientation = 'horizontal' | 'vertical'
type Coord = string
type Ship = { start: Coord; orientation: Orientation; length: number }
type ShipPlacementGridProps = {
  onComplete: (ships: Ship[]) => void
  onClose?: () => void
}

const toCoord = (r: number, c: number): Coord => `${ROWS[r]}${c + 1}`
const fromCoord = (coord: string): [number, number] => [
  ROWS.indexOf(coord[0]),
  parseInt(coord.slice(1)) - 1
]

const getShipCells = (
  start: Coord,
  orientation: Orientation,
  length: number
): Coord[] => {
  const [r, c] = fromCoord(start)
  return Array.from({ length }, (_, i) => {
    const nr = r + (orientation === 'vertical' ? i : 0)
    const nc = c + (orientation === 'horizontal' ? i : 0)
    if (nr >= 10 || nc >= 10) return null
    return toCoord(nr, nc)
  }).filter((c): c is string => !!c)
}

const ShipPlacementGrid = ({ onComplete, onClose }: ShipPlacementGridProps) => {
  const [orientation, setOrientation] = useState<Orientation>('horizontal')
  const [placedShips, setPlacedShips] = useState<Ship[]>([])
  const [dragLength, setDragLength] = useState<number | null>(null)

  const occupiedCells = placedShips.flatMap(ship =>
    getShipCells(ship.start, ship.orientation, ship.length)
  )

  const getRemainingShipLengths = () => {
    const lengths: Array<number | null> = [...SHIP_LENGTHS]
    placedShips.forEach(e => {
      console.log(e, lengths)
      const index = lengths.findIndex(elem => elem === e.length)
      console.log(e, index)
      lengths[index] = null
    })
    return lengths.filter(l => l !== null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, coord: Coord) => {
    e.preventDefault()
    if (!dragLength) return

    const cells = getShipCells(coord, orientation, dragLength)
    if (
      cells.length !== dragLength ||
      cells.some(c => occupiedCells.includes(c))
    )
      return

    const newShip: Ship = { start: coord, orientation, length: dragLength }
    setPlacedShips(prev => [...prev, newShip])
    setDragLength(null)
  }

  const removeShip = (target: Ship) =>
    setPlacedShips(prev => prev.filter(ship => ship !== target))

  const isStartOfShip = (coord: Coord): Ship | null =>
    placedShips.find(ship => ship.start === coord) ?? null

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    length: number
  ) => {
    setDragLength(length)
  }
  const allowDrop = (e: DragEvent) => e.preventDefault()

  return (
    <div className='max-w-[450px] p-4 space-y-4'>
      {/* {SHIP_LENGTHS.filter(
        l =>
          placedShips.filter(s => s.length === l).length <
          SHIP_LENGTHS.filter(s => s === l).length
      ).join(', ')}
      <hr />
      placed: {JSON.stringify(placedShips.map(s => s.length))} */}
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-bold'>Place Your Ships</h2>
        <button onClick={() => onClose?.()}>&times;</button>
      </div>
      <div className='flex flex-col items-start gap-4 w-full'>
        <div className='flex gap-4 items-start'>
          <span className='font-medium'>Orientation:</span>
          <button
            onClick={() =>
              setOrientation(prev =>
                prev === 'horizontal' ? 'vertical' : 'horizontal'
              )
            }
            className='px-3 py-1 bg-gray-200 rounded bg-zinc-500/50 hover:bg-zinc-500/60 text-sm w-24'
          >
            {orientation}
          </button>
        </div>
        <div className='flex flex-wrap gap-2 w-full'>
          {getRemainingShipLengths().map((length, index) => (
            <ShipButton
              key={`${length}-${index}`}
              length={length}
              onDrag={handleDragStart}
            />
          ))}
        </div>
      </div>
      <div className='grid grid-cols-[30px_repeat(10,40px)] relative select-none'>
        <div />
        {COLS.map(col => (
          <div key={col} className='text-center font-bold'>
            {col}
          </div>
        ))}
        {ROWS.split('').map((row, r) => (
          <Fragment key={row}>
            <div className='flex items-center justify-center font-bold'>
              {row}
            </div>
            {COLS.map((_, c) => {
              const coord = toCoord(r, c)
              const occupied = occupiedCells.includes(coord)
              const shipStart = isStartOfShip(coord)
              return (
                <div
                  key={coord}
                  onDrop={e => handleDrop(e, coord)}
                  onDragOver={allowDrop}
                  className={`relative w-10 h-10 border border-gray-400 flex items-center justify-center ${
                    occupied ? 'bg-gray-700' : 'hover:bg-blue-100'
                  }`}
                >
                  {shipStart && (
                    <button
                      onClick={() => removeShip(shipStart)}
                      className='absolute -top-2 -left-2 text-sm bg-red-800 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-700'
                    >
                      &times;
                    </button>
                  )}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
      {placedShips.length === SHIP_LENGTHS.length && (
        <button
          onClick={() => onComplete(placedShips)}
          className='mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
        >
          Confirm Placement
        </button>
      )}
    </div>
  )
}

export default ShipPlacementGrid
