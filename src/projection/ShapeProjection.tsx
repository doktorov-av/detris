import {GridShape} from "../shapes/GridShape.ts";
import React from "react";
import {GridShapeComponent} from "../shapes/GridShapeComponent.tsx";
import {Moves} from "../tetris/Moves.ts";
import {Cells} from "../cells/CellType.ts";

export interface ShapeProjectionProps {
    shapeValidator: (shape: GridShape) => boolean,
    projectedShape: GridShape,
}

export function Project({projectedShape, shapeValidator}: ShapeProjectionProps): GridShape {
    const shape = GridShape.copy(projectedShape);

    while (shapeValidator(shape.moved(Moves.downMove))) {
        shape.move(Moves.downMove);
    }

    return shape;
}

export const ShapeProjection: React.FC<ShapeProjectionProps> = (props: ShapeProjectionProps) => {
    const projectedShape = Project(props)
    projectedShape.setCellProps({
        type: Cells.projected,
    })
    return <GridShapeComponent shape={projectedShape}/>
}