import {type GameMode} from "./GameMode.ts";
import type {PositionedShapeProps} from "../shapes/PositionedShape.tsx";


export interface Position {
    x: number;
    y: number;
}

export type Offset = Position;

export interface GameState {
    score: number;
    level: number;
    isRunning: boolean;
    ncols: number;
    mode: GameMode;
    activeShape?: PositionedShapeProps;
    staticShapes: PositionedShapeProps[];
}

export interface GameProps {
    staticShapes?: PositionedShapeProps[];
    moveDelayMs?: number;
    isRunning?: boolean;
    mode?: GameMode;
    nrows?: number;
}