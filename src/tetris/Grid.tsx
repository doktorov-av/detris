import React, {useContext} from "react";
import {ModeContext} from "../contexts/Contexts.ts";
import {ModeSchemes} from "../tuning/ModeSchemes.ts";
import {Cell} from "../cells/Cell.tsx";
import type {GameMode} from "./GameMode.ts";
import './Grid.css'
import styled from "styled-components";


interface GridProps {
    $nRows: number;
    $nColumns: number;
}

const Grid = styled.div<GridProps>`
    position: relative;
    display: grid;
    grid-template-rows: repeat(${props => props.$nRows}, 1fr);
    grid-template-columns: repeat(${props => props.$nColumns}, 1fr);
`

interface GameGridProps {
    nRows: number;
    nColumns: number;
    children: React.ReactNode;
}

export const GameGrid: React.FC<GameGridProps> = ({nRows, nColumns, children}: GameGridProps) => {
    // Create a flat array of all cells for grid layout
    const cells = Array(nRows * nColumns).fill(null);
    const mode: GameMode = useContext(ModeContext)

    return (
        <div className={`flex m-auto tetris-grid-container overflow-clip ${ModeSchemes.get(mode)?.gridStyling}`}>
            <Grid $nColumns={nColumns} $nRows={nColumns}>
                {cells.map((_, index) => {
                    const row = Math.floor(index / nColumns);
                    const col = index % nColumns;
                    return (
                        <Cell key={`grid-cell-${row}-${col}`}/>
                    );
                })}
                {children}
            </Grid>
        </div>
    );
};