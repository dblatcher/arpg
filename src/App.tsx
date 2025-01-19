import './App.css'
import { Game } from './components/Game'
import { WaitingAssetProvider } from './context/WaitingAssetProvider'
import { assetParams } from './assets-defs'

function App() {

  return (
    <>
      <h1>A rpg</h1>
      <WaitingAssetProvider assetParams={assetParams}>
        <Game />
      </WaitingAssetProvider>
    </>
  )
}

export default App
