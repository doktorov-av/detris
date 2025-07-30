import React, {useContext} from "react";
import {ModeContext} from "../contexts/Contexts.ts";
import {ModeSchemes} from "../tuning/ModeSchemes.ts";
import {Cell} from "../cells/Cell.tsx";
import type {GameMode} from "./GameMode.ts";
import './Grid.css'
import styled from "styled-components";

interface GameGridProps {
    nrows: number;
    ncols: number;
    children: React.ReactNode;
}

interface GridProps {
    nrows: number;
    ncols: number;
}

const Grid = styled.div<GridProps>`
    position: relative;
    display: grid;
    grid-template-rows: repeat(${props => props.nrows}, 1fr);
    grid-template-columns: repeat(${props => props.ncols}, 1fr);
`

export const GameGrid: React.FC<GameGridProps> = ({nrows, ncols, children}: GameGridProps) => {
    // Create a flat array of all cells for grid layout
    const cells = Array(nrows * ncols).fill(null);
    const mode: GameMode = useContext(ModeContext)

    return (
        <div className={`flex m-auto tetris-grid-container overflow-clip ${ModeSchemes.get(mode)?.gridStyling}`}>
            <Grid ncols={ncols} nrows={ncols}>
                {cells.map((_, index) => {
                    const row = Math.floor(index / ncols);
                    const col = index % ncols;
                    return (
                        <Cell key={`grid-cell-${row}-${col}`}/>
                    );
                })}
                {children}
            </Grid>
        </div>
    );
};