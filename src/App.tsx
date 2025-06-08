import { useState } from 'react'
import { SoundDeck } from 'sound-deck'
import './App.css'
import { assetParams } from './assets-defs'
import { Game } from './components/Game'
import { TitleScreen } from './components/TitleScreen'
import { WaitingAssetProvider } from './context/WaitingAssetProvider'

enum Phase {
  Title, Game
}

function App() {
  const [phase, setPhase] = useState(Phase.Title)
  const [soundDeck] = useState(() => new SoundDeck())

  return (
    <WaitingAssetProvider assetParams={assetParams} loadingContent={<p>Loading</p>}>
      {phase === Phase.Title && (
        <TitleScreen startGame={() => setPhase(Phase.Game)} soundDeck={soundDeck} />
      )}
      {phase === Phase.Game && (
        <Game soundDeck={soundDeck} quit={() => setPhase(Phase.Title)} />
      )}
    </WaitingAssetProvider>
  )
}

export default App
