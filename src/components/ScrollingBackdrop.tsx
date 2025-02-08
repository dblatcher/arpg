import { ViewPort } from "@dblatcher/sprite-canvas";

interface Props {
    url?: string;
    viewPort: ViewPort;
    magnify?: number;
    xR: number;
    yR: number;
}


export const ScrollingBackdrop = ({
    url,
    viewPort,
    magnify = 1,
    xR,
    yR
}: Props) => {
    if (!url) {
        return null;
    }

    return <div
        style={{
            position: 'absolute',
            inset: 0,
            width: `${100 * xR}%`,
            height: `${100 * yR}%`,
            transform: `translatex(${-viewPort.x * magnify}px) translatey(${-viewPort.y * magnify}px)`,
        }}
    >
        <div
            style={{
                position: 'absolute',
                inset: 0,
                width: `${100}%`,
                height: `${100}%`,
                backgroundImage: `url("${url}")`,
                backgroundSize: ` ${100}% ${100}%`,
            }}
        ></div>
    </div>
};
