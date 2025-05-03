import { useMemo, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import './App.css'
import { assetParams } from './assets-defs'
import { Game } from './components/Game'
import { SoundToggle } from './components/SoundToggle'
import { TitleScreen } from './components/TitleScreen'
import { WaitingAssetProvider } from './context/WaitingAssetProvider'
import { useBgm } from './hooks/use-bgm'

enum Phase {
  Title, Game
}

function App() {

  const [phase, setPhase] = useState(Phase.Title)
  const soundDeck = useMemo(() => new SoundDeck(), [])


  useBgm(phase === Phase.Title ? 'main-theme' : undefined, false, soundDeck)

  return (
    <WaitingAssetProvider assetParams={assetParams} loadingContent={<p>Loading</p>}>
      {phase === Phase.Title && (
        <TitleScreen startGame={() => setPhase(Phase.Game)} />
      )}
      {phase === Phase.Game && (
        <Game soundDeck={soundDeck} quit={() => setPhase(Phase.Title)} />
      )}
      <SoundToggle soundDeck={soundDeck} />
    </WaitingAssetProvider>
  )
}

export default App
