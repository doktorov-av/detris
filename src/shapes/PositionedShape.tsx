import type {Position} from "../tetris/GameProps.ts";
import React from "react";
import type {ShapeProps} from "./Shape.ts";
import { Shape } from "./Shape.tsx";

export interface PositionedShapeProps {
    shapeProps: ShapeProps;
    position: Position;
    rotation: number;
}

export const PositionedShape: React.FC<PositionedShapeProps> = (props: PositionedShapeProps) => {
    return <div style={{
        position: 'absolute',
        top: `${props.position.y}px`,
        left: `${props.position.x}px`,
        transform: `rotate(${props.rotation}deg)`,
        transformOrigin: 'top left'
    }}>
        <Shape {...props.shapeProps}> </Shape>
    </div>
}