import React, { CSSProperties, memo } from "react";

interface Props {
    current: number;
    max: number;
    style?: CSSProperties
}

const HealthBarInner: React.FunctionComponent<Props> = ({ current, max, style }) => {
    return (
        <div style={{...style,
            background:'yellow'
        }}>
            HEALTH:
            <span>{current}</span>
            <span>/</span>
            <span>{max}</span>
        </div>
    )
}

export const HealthBar = memo<Props>(HealthBarInner, (prev, next) => {
    return prev.current === next.current && prev.max === next.max
})