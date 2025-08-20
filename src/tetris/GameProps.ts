import {type GameMode} from "./GameMode.ts";
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
    nColumns: number;
    nRows: number;
    mode: GameMode;
    activeShape?: GridShape;
    staticShapes: GridShape[];
    isGameOver: boolean;
}

export interface GameProps {
    staticShapes?: GridShape[];
    moveDelayMs?: number;
    isRunning?: boolean;
    mode?: GameMode;
    nRows?: number;
}