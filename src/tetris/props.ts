import {type GameMode} from "./GameMode.ts";
import {type ShapeProps} from '../shapes/Shape.ts';


export interface GameState {
    score: number;
    level: number;
    isRunning: boolean;
    cellsInARow: number;
    mode: GameMode;
    numRows: number;
    shapes: ShapeProps[];
}


export interface GameProps {
    initialState? : Partial<GameState>;
    state: GameState;
}