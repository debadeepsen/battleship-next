import { SHIP_NAMES } from '@/utils/constants'
import React, { DragEvent, FC, useRef } from 'react'
import { Icon } from '@iconify/react'

type ShipButtonProps = {
  length: number
  onDrag: (event: DragEvent<HTMLDivElement>, length: number) => void
}

const ShipButton: FC<ShipButtonProps> = ({ length, onDrag }) => {
  const label = SHIP_NAMES[length.toString() as keyof typeof SHIP_NAMES]
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = () => {
    // Temporarily enable drag on parent when mouse is down on handle
    if (containerRef.current) {
      containerRef.current.setAttribute('draggable', 'true')
    }
  }

  const handleMouseUpOrLeave = () => {
    // Disable dragging after the drag or if mouse leaves the handle
    if (containerRef.current) {
      containerRef.current.setAttribute('draggable', 'false')
    }
  }

  return (
    <div
      ref={containerRef}
      className='flex px-1 py-1 bg-green-700 text-white text-xs rounded-full h-[24px] items-center'
      style={{ width: `${length * 40}px` }}
      onDragStart={event => onDrag?.(event, length)}
      draggable={false} // initially not draggable
    >
      <div
        className='drag-handle cursor-move rounded-full w-4 h-4 bg-white inline-block mr-1 flex items-center justify-center'
        style={{ flexShrink: 0 }}
        title={`Drag to place ${label} (length ${length})`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <Icon icon='si:drag-indicator-fill' width='16' height='16' style={{color: 'var(--color-green-700)'}} />
      </div>
      {label}
    </div>
  )
}

export default ShipButton
