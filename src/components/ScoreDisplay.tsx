import React, { CSSProperties, memo } from "react";

interface Props {
    score: number;
    style?: CSSProperties
}

const ScoreDisplayInner: React.FunctionComponent<Props> = ({ score, style }) => {

    return (
        <div style={style} className="ui-panel">
            <span>{score}</span>
        </div>
    )
}

export const ScoreDisplay = memo<Props>(ScoreDisplayInner, (prev, next) => {
    return prev.score === next.score
})