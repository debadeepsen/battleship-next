import Battleship from '@/components/Battleship'
import ShipVisual from '@/components/ShipVisual'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <ShipVisual length={2} />
      <ShipVisual length={5} />
      <ShipVisual length={3} orientation='vertical' />
      <hr />
      <Battleship />
    </main>
  )
}
