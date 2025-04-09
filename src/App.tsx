import './App.css'
import { Game } from './components/Game'
import { WaitingAssetProvider } from './context/WaitingAssetProvider'
import { assetParams } from './assets-defs'
import { useMemo, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import { useBgm } from './hooks/use-bgm'
import { SoundToggle } from './components/SoundToggle'

enum Phase {
  Title, Game
}

function App() {

  const [phase, setPhase] = useState(Phase.Title)
  const soundDeck = useMemo(() => new SoundDeck(), [])

  const handleStart = () => {
    setPhase(Phase.Game)
  }

  useBgm(phase === Phase.Title ? 'main-theme' : undefined, false, soundDeck)

  return (
    <>
      {phase === Phase.Title && (
        <h1>Title Screen</h1>
      )}
      <SoundToggle soundDeck={soundDeck} />
      <WaitingAssetProvider assetParams={assetParams} loadingContent={<p>Loading</p>}>
        {phase === Phase.Game && (
          <Game soundDeck={soundDeck} quit={() => setPhase(Phase.Title)} />
        )}
        {phase === Phase.Title && (
          <button onClick={handleStart}>start</button>
        )}
      </WaitingAssetProvider>
    </>
  )
}

export default App
