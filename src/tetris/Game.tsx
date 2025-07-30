import React from 'react';
import './Grid.css';
import {type GameProps, type GameState, type Offset, type Position, type PositionedShapeProps} from "./GameProps.ts";
import {Modes} from "./GameMode.ts";
import "./Grid.tsx";
import {GameGrid} from "./Grid.tsx";
import {CellTuning} from "../tuning/Cells.ts";
import {Cells} from '../cells/CellType.ts';
import {Shapes, type ShapeType} from "../tuning/Shapes.ts";
import {RandomizeShape} from "./RandomizeShape.ts";
import {PositionedShape} from "../shapes/PositionedShape.tsx";

const downMove: Offset = {x: 0, y: CellTuning.shape.height}
const rightMove: Offset = {x: CellTuning.shape.width, y: 0}
const leftMove: Offset = {x: -rightMove.x, y: 0}
const startPosition: Position = {x: 8 * CellTuning.shape.width, y: -CellTuning.shape.height * 2}

const gameDefaults = {
    nRows: 20,
    intervalMs: 1000,
}

export class Game extends React.Component<GameProps, GameState> {
    private intervalId: number

    constructor(props: GameProps) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            isRunning: true,
            ncols: 20,
            mode: Modes.Standard,
            activeShape: {
                shapeProps: {type: 'TShape', cellProps: {type: Cells.blue}},
                position: startPosition,
                rotation: 90,
            },
            staticShapes: [],
            ...props
        };
        this.intervalId = 0
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    isValidMove(offset: Offset): boolean {
        if (this.state.activeShape === undefined)
            return false

        const activeShape = this.state.activeShape as PositionedShapeProps

        // Get the active shape's data
        const activeShapeType: ShapeType = activeShape.shapeProps.type;
        const shapeData = Shapes[activeShapeType];
        const currentPos = activeShape.position;

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
                if (gridCol < 0 || gridCol >= this.state.ncols ||
                    gridRow >= this.getNumRows()) {
                    return false;
                }

                // Allow shapes to be above the grid (for initial placement)
                if (gridRow < 0) continue;

                // 2. Check collision with static shapes
                for (const staticShape of this.getStaticShapes()) {
                    const staticType: ShapeType = staticShape.shapeProps.type;
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

    isValidRotation(degree: number) {
        // TODO: implement rotation check logic
        return true
    }

    moveIfValid(offset: Offset) {
        if (this.isValidMove(offset)) {
            this.moveActive(offset)
        }
    }

    moveActive(offset: Offset) {
        this.setState((prevState) => {
            if (prevState.activeShape === undefined) {
                return prevState
            }

            const activeShape = prevState.activeShape as PositionedShapeProps

            return {
                ...prevState,
                activeShape: {
                    ...activeShape,
                    position: {
                        x: activeShape.position.x + offset.x,
                        y: activeShape.position.y + offset.y
                    }
                }
            }
        })
    }

    handleKeyDown(ev: KeyboardEvent) {
        if (ev.repeat || !this.state.isRunning || !this.state.activeShape) {
            return
        }

        switch (ev.key) {
            case 'ArrowDown':
                this.moveIfValid(downMove)
                break;
            case 'ArrowLeft':
                this.moveIfValid(leftMove)
                break;
            case 'ArrowRight':
                this.moveIfValid(rightMove)
                break;
            case 'R':
            case 'r':
                if (this.isValidRotation(90)) {
                    this.rotateActive(90)
                }
                break;
        }
    }

    spawnActive() {
        this.setState(prev => ({
            ...prev,
            activeShape: {
                shapeProps: RandomizeShape(),
                rotation: 0,
                position: startPosition
            }
        }))
    }

    // moves active shape to static shapes
    freezeActive() {
        this.setState(prevState => {
            if (prevState.activeShape === undefined) {
                return prevState
            }

            const activeShape = prevState.activeShape as PositionedShapeProps

            return {
                ...prevState,
                staticShapes: [...prevState.staticShapes, activeShape],
                activeShape: undefined
            }
        })
    }

    rotateActive(degree: number) {
        this.setState((prev) => {
            if (prev.activeShape === undefined) {
                return prev
            }

            console.log('rotated!')
            const activeShape = prev.activeShape as PositionedShapeProps

            return {
                ...prev,
                activeShape: {
                    ...activeShape,
                    rotation: Game.normalizeAngle(activeShape.rotation + degree),
                }
            }
        })
    }

    static normalizeAngle(angle: number): number {
        angle = (angle + 180) % 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle - 180;
    }


    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (!this.state.isRunning) {
                return
            }

            if (!this.isValidMove(downMove)) {
                this.freezeActive()
                this.spawnActive()
            } else {
                this.moveActive(downMove)
            }
        }, this.props.moveDelayMs ?? gameDefaults.intervalMs)

        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    getStaticShapes(): PositionedShapeProps[] {
        return Array.from([...this.state.staticShapes, ...this.props.staticShapes ?? []])
    }

    getNumRows() : number {
        return this.props.nrows ?? gameDefaults.nRows
    }

    render() {
        return <GameGrid nrows={this.getNumRows()} ncols={this.state.ncols}>
            {
                this.getStaticShapes().map((props, index) => (
                    <PositionedShape {...props} key={`static-shape-${index}`}/>
                ))
            }
            {
                this.state.activeShape && <PositionedShape {...this.state.activeShape as PositionedShapeProps}/>
            }

        </GameGrid>
    }
}
