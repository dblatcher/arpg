import { TitleGraphicCanvas } from "./TitleGraphicCanvas";
import "./TitleScreen.css";

interface Props {
    startGame: { (): void }
}




export const TitleScreen = ({ startGame }: Props) => {

    return (
        <main className="title-screen">
            <div className="canvas-frame">
                <TitleGraphicCanvas />
            </div>
            <div className="title-contents">
                <h1>Title Screen</h1>
                <button onClick={startGame}>start</button>
            </div>
        </main>
    )
}