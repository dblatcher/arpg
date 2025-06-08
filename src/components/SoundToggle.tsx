import { ChangeEvent, FunctionComponent, useState } from "react";
import { SoundDeck } from "sound-deck";

interface Props {
    soundDeck: SoundDeck
    corner?: boolean
}


export const SoundToggle: FunctionComponent<Props> = ({ soundDeck, corner }) => {
    const [on, setOn] = useState(soundDeck.isEnabled)
    const handleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
        if (checked) {
            soundDeck.enable()
        } else {
            soundDeck.disable()
        }
        setOn(checked)
    }

    const className = corner ? 'sound-toggle sound-toggle--corner' : 'sound-toggle';

    return <label className={className}>
        <span className="ui-text">sound</span>
        <input type="checkbox" checked={on} onChange={handleChange} />
    </label>

}