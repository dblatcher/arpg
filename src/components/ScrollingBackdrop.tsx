import { ViewPort } from "@dblatcher/sprite-canvas";

interface Props {
    url?: string;
    viewPort: ViewPort;
    magnify?: number;
    parallax?: number;
    mapWidth: number;
    mapHeight: number;
}



export const ScrollingBackdrop = ({
    url,
    viewPort,
    magnify = 1,
    parallax = 1,
    mapHeight,
    mapWidth,
}: Props) => {
    if (!url) {
        return null;
    }

    const viewportCenterX = viewPort.x + viewPort.width / 2;
    const offcenteredByX = (viewportCenterX - (mapWidth / 2)) / parallax;
    const xOffset = -(offcenteredByX + (mapWidth / 2 - viewPort.width / 2)) * magnify;

    const viewportCenterY = viewPort.y + viewPort.height / 2;
    const offcenteredByY = (viewportCenterY - (mapHeight / 2)) / parallax;
    const yOffset = -(offcenteredByY + (mapHeight / 2 - viewPort.height / 2)) * magnify;


    return <div
        style={{
            position: 'absolute',
            inset: 0,
            width: `${100 * mapWidth / viewPort.width}%`,
            height: `${100 * mapHeight / viewPort.height}%`,
            transform: `translatex(${xOffset}px) translatey(${yOffset}px)`,
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
