import { SHIP_NAMES } from '@/utils/constants'
import React, { FC } from 'react'

type ShipButtonProps = {
  length: number
  index: number
  onDrag: (length: number) => void
}

const ShipButton: FC<ShipButtonProps> = ({ length, index, onDrag }) => {
  const label = SHIP_NAMES[length.toString() as keyof typeof SHIP_NAMES]
  return (
    <div
      draggable
      onDragStart={() => onDrag?.(length)}
      className='cursor-move px-2 py-1 bg-blue-600 text-white text-sm rounded-full'
      title={`Drag to place ${label} (length ${length})`}
      style={{ width: `${length * 40}px` }}
    >
      {label}
    </div>
  )
}

export default ShipButton
