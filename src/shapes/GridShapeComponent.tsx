import React from "react";
import type {GridShape} from "./GridShape.ts";
import {Cell} from "../cells/Cell.tsx";

export interface GridShapeComponentProps {
    shape: GridShape;
}

export const GridShapeComponent: React.FC<GridShapeComponentProps> = ({shape}: GridShapeComponentProps) => {
    const cellPositions = shape.getRenderedPositions()

    return cellPositions.map((position, i) => {
        return <div className='absolute' style={{top: position.y, left: position.x}} key={`grid-cell-${i}`}>
            <Cell {...shape.getCellProps()}> </Cell>
        </div>
    })
}