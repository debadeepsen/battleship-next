import React from 'react'
import classNames from 'classnames'

interface ShipVisualProps {
  length: number
  orientation?: 'horizontal' | 'vertical'
  color?: string
}

const ShipVisual: React.FC<ShipVisualProps> = ({
  length,
  orientation = 'horizontal',
  color = 'bg-gray-700'
}) => {
  const cellSize = 40
  const shipStyle = {
    width:
      orientation === 'horizontal'
        ? `${length * (cellSize - 1)}px`
        : `${cellSize}px`,
    height:
      orientation === 'horizontal' ? `${cellSize - 1}px` : `${length * cellSize}px`
  }

  return (
    <div
      className={classNames('relative flex items-center justify-center', color)}
      style={shipStyle}
    >
      {/* Body */}
      <div
        className='absolute inset-0 z-0'
        style={{
          borderRadius:
            orientation === 'horizontal' ? `20px 0 0 20px` : `20px 20px 0 0`,
          backgroundColor: 'inherit'
        }}
      />

      {/* Arrow tip */}
      <div
        className={classNames('absolute z-10', {
          'right-0 top-0 bottom-0 my-auto w-0 h-0 border-t-[20px] border-b-[20px] border-l-[20px] border-t-transparent border-b-transparent border-l-inherit':
            orientation === 'horizontal',
          'bottom-0 left-0 right-0 mx-auto w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-inherit':
            orientation === 'vertical'
        })}
      />

      {/* Fill div to maintain layout */}
      <div
        className='w-full h-full z-0'
        style={{
          borderRadius:
            orientation === 'horizontal' ? `20px 0 0 20px` : `20px 20px 0 0`,
          backgroundColor: 'inherit'
        }}
      ></div>
    </div>
  )
}

export default ShipVisual
