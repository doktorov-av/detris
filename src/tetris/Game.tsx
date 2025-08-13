import React from 'react';
import './Grid.css';
import {type GameProps, type GameState, type Offset, type Position} from "./GameProps.ts";
import {Modes} from "./GameMode.ts";
import "./Grid.tsx";
import {GameGrid} from "./Grid.tsx";
import {CellTuning} from "../tuning/Cells.ts";
import {RandomizeShape} from "./RandomizeShape.ts";
import {GridShape} from "../shapes/GridShape.ts";
import {GridShapeComponent} from "../shapes/GridShapeComponent.tsx";
import {Grid} from "@mantine/core";

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
            activeShape: new GridShape("TShape").move(startPosition),
            staticShapes: [],
            ...props
        };
        this.intervalId = 0
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    private isValidMove(offset: Offset): boolean {
        let activeShape = GridShape.copy(this.state.activeShape as GridShape)
        activeShape.move(offset)
        return this.isValidShape(activeShape)
    }

    moveIfValid(offset: Offset) {
        if (this.isValidMove(offset)) {
            this.moveActive(offset)
        }
    }

    moveActive(offset: Offset) {
        this.setState((prev) => {
            return {
                ...prev,
                activeShape: GridShape.copy(prev.activeShape as GridShape).move(offset),
            }
        })
    }

    spawnActive() {
        this.setState(prev => ({
            ...prev,
            activeShape: RandomizeShape().move(startPosition),
        }))
    }

    // moves active shape to static shapes
    freezeActive() {
        this.setState(prevState => {
            const activeShape = prevState.activeShape as GridShape

            return {
                ...prevState,
                staticShapes: [...prevState.staticShapes, activeShape],
                activeShape: undefined
            }
        })
    }

    nextIfValid() {
        if (this.isValidNext()) {
            this.nextActive()
        }
    }

    isValidNext(): boolean {
        const activeShape = GridShape.copy(this.state.activeShape as GridShape)
        activeShape.next()
        return this.isValidShape(activeShape)
    }

    nextActive() {
        this.setState((prev) => {
            return {
                ...prev,
                activeShape: GridShape.copy(prev.activeShape as GridShape).next(),
            }
        })
    }

    private isValidShape(shape: GridShape): boolean {
        for (const coords of shape.getGridCoords()) {
            // 1. Check boundaries
            const exceedsColumns = coords.col < 0 || coords.col >= this.state.ncols
            const exceedsRows = coords.row >= this.getNumRows()

            if (exceedsColumns || exceedsRows) {
                return false;
            }

            // allow negative rows for initial shapes above grid
            if (coords.row < 0)
                continue;

            // 2. Check collisions with static shapes
            for (const staticShape of this.state.staticShapes) {
                for (const staticCoords of staticShape.getGridCoords()) {
                    if (staticCoords.row == coords.row && staticCoords.col == coords.col) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    handleKeyDown(ev: KeyboardEvent) {
        if (ev.repeat || !this.props.isRunning || !this.state.activeShape) {
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
                this.nextIfValid()
                break;
        }
    }


    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (!this.isRunning()) {
                return
            }

            if (this.state.activeShape === undefined) {
                return;
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

    getStaticShapes(): GridShape[] {
        return Array.from([...this.state.staticShapes, ...this.props.staticShapes ?? []])
    }

    getNumRows() : number {
        return this.props.nrows ?? gameDefaults.nRows
    }

    isRunning(): boolean {
        return this.props.isRunning ?? false
    }

    render() {
        return <GameGrid nrows={this.getNumRows()} ncols={this.state.ncols}>
            {
                this.getStaticShapes().map((shape, index) => (
                    <GridShapeComponent shape={shape} key={`static-shape-${index}`}/>
                ))
            }
            {
                this.state.activeShape && <GridShapeComponent shape={this.state.activeShape as GridShape}/>
            }

        </GameGrid>
    }
}
