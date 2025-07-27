import React, {useContext} from "react";
import {ModeContext} from "../contexts/Contexts.ts";
import {ModeSchemes} from "../tuning/ModeSchemes.ts";
import {Cell} from "../cells/Cell.tsx";
import type {GameMode} from "./GameMode.ts";
import './Grid.css'

interface GameGridProps {
    numRows: number;
    numCols: number;
}

export const GameGrid: React.FC<GameGridProps> = ({numRows, numCols}: GameGridProps) => {
    // Create a flat array of all cells for grid layout
    const cells = Array(numRows * numCols).fill(null);
    const mode: GameMode = useContext(ModeContext)

    return (
        <div className='flex m-auto'>
            <div className={`tetris-grid ${ModeSchemes.get(mode)?.gridStyling}`}
                 style={{
                     "--cols": numCols,
                     "--rows": numRows
                 }}>
                {cells.map((_, index) => {
                    const row = Math.floor(index / numCols);
                    const col = index % numCols;
                    return (
                        <Cell key={`cell-${row}-${col}`}/>
                    );
                })}
            </div>
        </div>
    );
};