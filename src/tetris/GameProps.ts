import {type GameMode} from "./GameMode.ts";
import {type ShapeProps} from '../shapes/Shape.ts';


export interface Position {
    x: number;
    y: number;
}

export type Offset = Position;

export interface StaticShape {
    shapeProps: ShapeProps;
    position: Position;
}

export interface GameState {
    score: number;
    level: number;
    isRunning: boolean;
    cellsInARow: number;
    mode: GameMode;
    numRows: number;
    activeShape: StaticShape;
    staticShapes: StaticShape[];
}

export interface GameProps {
    initialState? : Partial<GameState>;
    staticShapes?: StaticShape[];
    state: GameState;
}