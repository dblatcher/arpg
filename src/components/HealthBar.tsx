import React, { memo } from "react";

interface Props {
    current: number;
    max: number;
}

const HealthBarInner: React.FunctionComponent<Props> = ({ current, max }) => {
    return (
        <div>
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