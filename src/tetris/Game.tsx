import React from 'react';
import './Grid.css';
import {type GameProps, type GameState} from "./props.ts";
import {Modes} from "./GameMode.ts";
import "./Grid.tsx";
import {GameGrid} from "./Grid.tsx";
import {Cells} from "../cells/CellType.ts";
import {Shape} from "../shapes/Shape.tsx";

export class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            isRunning: false,
            cellsInARow: 20,
            numRows: 10,
            mode: Modes.Standard,
            shapesProps: [{type: "LShape", cellProps: {type: Cells.red}, initialPos: {xPos: 100, yPos: 100}}],
            ...props.initialState
        };
    }

    render() {
        return <GameGrid numRows={this.props.state.numRows}
                         numCols={this.state.cellsInARow}>
            <div className='absolute'>
                {this.state.shapesProps.map(props => (
                    <Shape {...props}></Shape>
                ))}
            </div>
        </GameGrid>
    }
}
