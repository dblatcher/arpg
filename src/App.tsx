import './App.css'
import { Game } from './components/Game'
import { WaitingAssetProvider } from './context/WaitingAssetProvider'
import { assetParams } from './assets-defs'
import { useState } from 'react'
import { SoundDeck } from 'sound-deck'

function App() {

  const [soundDeck] = useState(new SoundDeck)

  return (
    <>
      <h1>A rpg</h1>
      <WaitingAssetProvider assetParams={assetParams}>
        <Game soundDeck={soundDeck} />
      </WaitingAssetProvider>
    </>
  )
}

export default App
