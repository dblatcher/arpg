import { Interaction } from "../game-state";

interface Props {
    interaction: Interaction
}



export const ConversationBox = ({ interaction }: Props) => {

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
        <p className="ui-text">{interaction.text}</p>
    </div>

}
