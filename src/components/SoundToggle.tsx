import { ChangeEvent, FunctionComponent, useState } from "react";
import { SoundDeck } from "sound-deck";

interface Props {
    soundDeck: SoundDeck
}


export const SoundToggle: FunctionComponent<Props> = ({ soundDeck }) => {
    const [on, setOn] = useState(soundDeck.isEnabled)
    const handleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
        if (checked) {
            soundDeck.enable()
        } else {
            soundDeck.disable()
        }
        setOn(checked)
    }

    return <div className="sound-toggle">
        <label>
            sound
            <input type="checkbox" checked={on} onChange={handleChange} />
        </label>
    </div>
}