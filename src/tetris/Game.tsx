import React from 'react';
import './Grid.css';
import {type GameProps, type GameState, type Offset, type Position, type StaticShape} from "./GameProps.ts";
import {Modes} from "./GameMode.ts";
import "./Grid.tsx";
import {GameGrid} from "./Grid.tsx";
import {Shape} from "../shapes/Shape.tsx";
import {CellTuning} from "../tuning/Cells.ts";
import { Cells } from '../cells/CellType.ts';
import {Shapes} from "../tuning/Shapes.ts";

const downMove: Offset = {x: 0, y: CellTuning.shape.height}
const startPosition: Position = { x: 8 * CellTuning.shape.width, y: - CellTuning.shape.height * 2}

export class Game extends React.Component<GameProps, GameState> {
    private intervalId: number

    constructor(props: GameProps) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            isRunning: true,
            cellsInARow: 20,
            numRows: 10,
            mode: Modes.Standard,
            activeShape: {
                shapeProps: {type: 'TShape', cellProps: { type: Cells.blue }},
                position: startPosition
            },
            staticShapes: [],
            ...props.initialState
        };
        this.intervalId = 0
    }

    isValidMove(offset: Offset): boolean {
        // Get the active shape's data
        const activeShapeType = this.state.activeShape.shapeProps.type;
        const shapeData = Shapes[activeShapeType];
        const currentPos = this.state.activeShape.position;

        // Calculate proposed new position
        const newPos = {
            x: currentPos.x + offset.x,
            y: currentPos.y + offset.y
        };

        // Convert position to grid coordinates
        const cellWidth = CellTuning.shape.width;
        const cellHeight = CellTuning.shape.height;

        // Check each cell in the shape's matrix
        for (let row = 0; row < shapeData.mShape.length; row++) {
            for (let col = 0; col < shapeData.mShape[row].length; col++) {
                // Skip empty cells (opacity 0)
                if (shapeData.mShape[row][col] === 0) continue;

                // Calculate this cell's position in the grid
                const cellX = newPos.x + col * cellWidth;
                const cellY = newPos.y + row * cellHeight;

                // Convert to grid coordinates (column and row indices)
                const gridCol = Math.floor(cellX / cellWidth);
                const gridRow = Math.floor(cellY / cellHeight);

                // 1. Check boundaries
                if (gridCol < 0 || gridCol >= this.state.cellsInARow ||
                    gridRow >= this.state.numRows) {
                    return false;
                }

                // Allow shapes to be above the grid (for initial placement)
                if (gridRow < 0) continue;

                // 2. Check collision with static shapes
                for (const staticShape of this.getStaticShapes()) {
                    const staticType = staticShape.shapeProps.type;
                    const staticData = Shapes[staticType];
                    const staticPos = staticShape.position;

                    // Check each cell in the static shape
                    for (let sRow = 0; sRow < staticData.mShape.length; sRow++) {
                        for (let sCol = 0; sCol < staticData.mShape[sRow].length; sCol++) {
                            // Skip empty cells
                            if (staticData.mShape[sRow][sCol] === 0) continue;

                            // Calculate static cell's position
                            const staticCellX = staticPos.x + sCol * cellWidth;
                            const staticCellY = staticPos.y + sRow * cellHeight;

                            // Convert to grid coordinates
                            const staticGridCol = Math.floor(staticCellX / cellWidth);
                            const staticGridRow = Math.floor(staticCellY / cellHeight);

                            // Check if positions match
                            if (gridCol === staticGridCol && gridRow === staticGridRow) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    componentDidUpdate(_prevProps: Readonly<GameProps>, _prevState: Readonly<GameState>, _snapshot?: any) {
        this.state = {
            ...this.state,
            ...this.props.state
        }
    }

    moveIfValid(offset: Offset) {
        if (this.isValidMove(offset)) {
            this.moveActive(offset)
        }
    }

    moveActive(offset: Offset) {
        this.setState((prevState) => {
            return {
                ...prevState,
                activeShape: {
                    ...prevState.activeShape,
                    position: {
                        x: prevState.activeShape.position.x + offset.x,
                        y: prevState.activeShape.position.y + offset.y
                    }
                }
            }
        })
    }

    handleKeyDown(ev: KeyboardEvent) {
        if (ev.repeat || !this.state.isRunning) {
            return
        }

        switch (ev.key) {
            case 'ArrowDown':
                this.moveIfValid(downMove)
                break;
            case 'ArrowLeft':
                this.moveIfValid({x: - CellTuning.shape.width, y: 0})
                break;
            case 'ArrowRight':
                this.moveIfValid({x: + CellTuning.shape.width, y: 0})
                break;
        }
    }

    freezeActive() {
        this.setState(prevState => {
            return {
                ...prevState,
                staticShapes: [...prevState.staticShapes, prevState.activeShape],
                activeShape: {
                    shapeProps: {type: 'TShape', cellProps: { type: Cells.blue }},
                    position: startPosition
                },
            }
        })
    }

    getStaticShapes(): StaticShape[] {
        return [...this.state.staticShapes, ...this.props.staticShapes ?? []]
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (!this.state.isRunning) {
                return
            }

            if (!this.isValidMove(downMove)) {
                this.freezeActive()
            } else {
                this.moveActive(downMove)
            }
        }, 1000)

        document.addEventListener('keydown', (e) => this.handleKeyDown(e) , true);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
        document.removeEventListener('keydown', (e) => this.handleKeyDown(e) , true);
    }

    render() {
        return <GameGrid numRows={this.props.state.numRows}
                         numCols={this.state.cellsInARow}>
                {this.getStaticShapes().map((props, index) => (
                    <div className='absolute' style={{
                        left: `${props.position?.x}px`,
                        top: `${props.position?.y}px`}
                    }>
                        <Shape {...props.shapeProps} key={`SGS-${index}`}></Shape>
                    </div>
                ))}
            <div className='absolute' style={{
                left: `${this.state.activeShape.position.x}px`,
                top: `${this.state.activeShape.position.y}px`}
            }>
                <Shape {...this.state.activeShape.shapeProps} ></Shape>
            </div>
        </GameGrid>
    }
}
