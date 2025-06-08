import { SoundDeck } from "sound-deck";
import { useBgm } from "../hooks/use-bgm";
import { SoundToggle } from "./SoundToggle";
import { TitleGraphicCanvas } from "./TitleGraphicCanvas";
import "./TitleScreen.css";

interface Props {
    startGame: { (): void }
    soundDeck: SoundDeck
}




export const TitleScreen = ({ startGame, soundDeck }: Props) => {

    useBgm('main-theme', false, soundDeck)

    return (
        <main className="title-screen">
            <div className="canvas-frame">
                <TitleGraphicCanvas />
            </div>
            <div className="title-contents">
                <h1>Title Screen</h1>
                <button className="ui-button" onClick={startGame}>start</button>
            </div>
            <SoundToggle soundDeck={soundDeck} corner />
        </main>
    )
}