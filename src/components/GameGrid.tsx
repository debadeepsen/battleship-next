import { FC, Fragment } from 'react'

type CellStatus = 'empty' | 'miss' | 'hit' | 'sunk'

interface BattleshipGridProps {
  guesses: Record<string, CellStatus>
  onCellClick?: (coord: string) => void
}

const ROWS = 'ABCDEFGHIJ'
const COLS = Array.from({ length: 10 }, (_, i) => i + 1)

const statusColors: Record<CellStatus, string> = {
  empty: 'bg-white',
  miss: 'bg-blue-200',
  hit: 'bg-yellow-400',
  sunk: 'bg-red-600'
}

const BattleshipGrid: FC<BattleshipGridProps> = ({ guesses, onCellClick }) => {

  return (
    <div className='inline-block'>
      <div className='grid grid-cols-[30px_repeat(10,40px)]'>
        {/* Column labels */}
        <div />
        {COLS.map(col => (
          <div key={col} className='text-center font-bold'>
            {col}
          </div>
        ))}

        {/* Rows */}
        {ROWS.split('').map(row => (
          <Fragment key={row}>
            <div className='flex items-center justify-center font-bold'>
              {row}
            </div>
            {COLS.map(col => {
              const coord = `${row}${col}`
              const status = guesses[coord] || 'empty'
              const base =
                'w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer'
              const classes = `${base} ${statusColors[status]}`

              return (
                <div
                  key={coord}
                  className={classes}
                  onClick={() => onCellClick?.(coord)}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default BattleshipGrid
