import React, {useContext} from "react";
import {ModeContext} from "../contexts/Contexts.ts";
import {ModeSchemes} from "../tuning/ModeSchemes.ts";
import {Cell} from "../cells/Cell.tsx";
import type {GameMode} from "./GameMode.ts";
import './Grid.css'
import styled from "styled-components";

interface GameGridProps {
    numRows: number;
    numCols: number;
    children: React.ReactNode;
}

const Grid = styled.div<{numRows: number, numCols: number}>`
    position: relative;
    display: grid;
    grid-template-rows: repeat(${props => props.numRows}, 1fr);
    grid-template-columns: repeat(${props => props.numCols}, 1fr);
`

export const GameGrid: React.FC<GameGridProps> = ({numRows, numCols, children}: GameGridProps) => {
    // Create a flat array of all cells for grid layout
    const cells = Array(numRows * numCols).fill(null);
    const mode: GameMode = useContext(ModeContext)

    return (
        <div className={`flex m-auto tetris-grid-container overflow-clip ${ModeSchemes.get(mode)?.gridStyling}`}>
            <Grid numCols={numCols} numRows={numRows}>
                {cells.map((_, index) => {
                    const row = Math.floor(index / numCols);
                    const col = index % numCols;
                    return (
                        <Cell key={`grid-cell-${row}-${col}`}/>
                    );
                })}
                {children}
            </Grid>
        </div>
    );
};