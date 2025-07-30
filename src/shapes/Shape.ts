import type {ShapeType} from "../tuning/Shapes.ts";
import type {CellProps} from "../cells/Cell.tsx";
import type { Position } from "../tetris/GameProps.ts";

export interface ShapeProps {
    type: ShapeType;
    cellProps?: CellProps;
    position?: Position;
    rotation?: number;
}