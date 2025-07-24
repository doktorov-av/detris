import React, {useContext} from 'react';
import './game.css';
import {type GameProps, type GameState} from "./props.ts";
import {ModeContext} from "../contexts/Contexts.ts";
import {ModeSchemes} from "../contexts/ModeSchemes.ts";
import {GameMode} from "./gameMode.ts";

export class GameComponent extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            isRunning: false,
            cellsInARow: 20,
            numRows: 10,
            mode: GameMode.Standard,
            ...props.initialState
        };
    }

    render() {
        return <GameGrid numRows={this.props.state.numRows}
                         numCols={this.state.cellsInARow}>
        </GameGrid>
    }
}

interface GameGridProps {
    numRows: number;
    numCols: number;
}

const GameGrid = ({numRows, numCols}: GameGridProps) => {
    // Create a flat array of all cells for grid layout
    const cells = Array(numRows * numCols).fill(null);

    const mode: GameMode = useContext(ModeContext)

    return (
        <div className={`tetris-grid ${ModeSchemes.get(mode)?.gridStyling}`}
             style={{
                 "--cols": numCols,
                 "--rows": numRows
             }}>
            {cells.map((_, index) => {
                const row = Math.floor(index / numCols);
                const col = index % numCols;
                return (
                    <Cell
                        key={`cell-${row}-${col}`}/>
                );
            })}
        </div>
    );
};


export const Cell: React.FC = () => {
    return <div className="cell white" onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) =>
        (e.target as HTMLDivElement).className = 'cell blue'}/>
}

