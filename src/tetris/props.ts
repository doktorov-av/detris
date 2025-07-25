import {GameMode} from "./gameMode.ts";
import React from "react";

export interface GameState {
    score: number;
    level: number;
    isRunning: boolean;
    cellsInARow: number;
    mode: GameMode;
    numRows: number;
}


export interface GameProps {
    initialState? : Partial<GameState>;
    state: GameState;
}