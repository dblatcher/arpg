import React, { CSSProperties, memo } from "react";

interface Props {
    current: number;
    max: number;
    style?: CSSProperties
}


const fullHeartClassName = "health-heart"
const emptyHeartClassName = "health-heart  health-heart--empty"

const HealthBarInner: React.FunctionComponent<Props> = ({ current, max, style }) => {
    const hearts: (0 | 1)[] = []
    hearts.length = max
    hearts.fill(1, 0, current)
    hearts.fill(0, current, max)

    return (
        <div style={style} className="ui-panel">
            {hearts.map((value, index) => (
                <span key={index} 
                    className={value === 0 ? emptyHeartClassName : fullHeartClassName}
                    >&hearts;</span>
            ))}
        </div>
    )
}

export const HealthBar = memo<Props>(HealthBarInner, (prev, next) => {
    return prev.current === next.current && prev.max === next.max
})