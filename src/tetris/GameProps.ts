import {type GameMode} from "./GameMode.ts";
import type {PositionedShapeProps} from "../shapes/PositionedShape.tsx";
import {GridShape} from "../shapes/GridShape.ts";


export interface Position {
    x: number;
    y: number;
}

export type Offset = Position;

export interface Coords {
    row: number;
    col: number;
}

export interface GameState {
    score: number;
    level: number;
    ncols: number;
    mode: GameMode;
    activeShape?: GridShape;
    staticShapes: GridShape[];
}

export interface GameProps {
    staticShapes?: GridShape[];
    moveDelayMs?: number;
    isRunning?: boolean;
    mode?: GameMode;
    nrows?: number;
}