import type {ShapeType} from "../tuning/Shapes.ts";
import type {CellProps} from "../cells/Cell.tsx";

export interface ShapeProps {
    type: ShapeType;
    cellProps?: CellProps;
    initialPos?: ShapeState
}

export interface ShapeState {
    xPos: number;
    yPos: number;
}