import { Conversation } from "../game-state";

interface Props {
    dialog: Conversation
}



export const ConversationBox = ({ dialog }: Props) => {

    return <div
        className="ui-panel"
        style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1em 2em',
            borderRadius: '10px',
        }}>
        <p className="ui-text">{dialog.text}</p>
    </div>

}
