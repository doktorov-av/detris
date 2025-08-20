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
import {Project, ShapeProjection, type ShapeProjectionProps} from "../projection/ShapeProjection.tsx";
import {Moves} from "./Moves.ts";
import {GameOverComponent} from "../components/GameOverComponent.tsx";

const gameDefaults = {
    nRows: 20,
    nColumns: 13,
    intervalMs: 1000,
}

export class Game extends React.Component<GameProps, GameState> {
    private intervalId?: number

    constructor(props: GameProps) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            isRunning: true,
            mode: Modes.Standard,
            staticShapes: [],
            isGameOver: false,
            ...props,
            ...gameDefaults,
        };

        this.state = {
            ...this.state,
            activeShape: new GridShape("TShape").move(this.getStartPosition()),
        }

        this.intervalId = undefined
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    // ~~~~~~~~~~~~~ interface ~~~~~~~~~~~~~ //

    public start() {
        this.intervalId = setInterval(() => {
            this.update()
        }, this.props.moveDelayMs ?? gameDefaults.intervalMs);
    }

    public stop() {
        clearInterval(this.intervalId);
    }

    public restart() {
        this.stop()
        this.setState(prev => {
            return {
                ...prev,
                score: 0,
                level: 1,
                activeShape: undefined,
                staticShapes: [],
                isGameOver: false,
            }
        })
        this.start()
    }

    public appendRow() {
        this.setState(prev => {
            return {
                ...prev,
                nRows: prev.nRows + 1,
            }
        })
    }

    // ~~~~~~~~~~~~~ game logic ~~~~~~~~~~~~~ //

    private moveIfValid(offset: Offset) {
        if (this.isValidMove(offset)) {
            this.moveActive(offset)
        }
    }

    private moveActive(offset: Offset) {
        this.setState((prev) => {
            return {
                ...prev,
                activeShape: prev.activeShape!.moved(offset),
            }
        })
    }

    // moves active shape to static shapes
    private freezeAndSpawn() {
        this.freeze();
        this.spawnActive();
    }

    private nextIfValid() {
        if (this.isValidNext()) {
            this.nextActive()
        }
    }

    private nextActive() {
        this.setState((prev) => {
            return {
                ...prev,
                activeShape: GridShape.copy(prev.activeShape!).next(),
            }
        })
    }

    private projectActive() {
        const projectedShape = Project(this.getActiveProjectionProps());
        this.setState(prev => ({
            ...prev,
            activeShape: projectedShape,
        }), () => {
            this.freezeAndSpawn();
        });
    }

    private spawnActive() {
        this.setState(prev => ({
            ...prev,
            activeShape: RandomizeShape().moved(this.getStartPosition()),
        }), () => {
            this.onSpawn()
        })
    }

    private freeze() {
        const frozenShape = this.state.activeShape!;
        this.setState(prev => ({
            ...prev,
            staticShapes: [...prev.staticShapes, frozenShape],
            activeShape: undefined,
        }), () => {
            this.onFreeze(frozenShape);
        });
    }

    // collapse removes all the cells that exist within given row
    private collapseRows(iRows: number[]) {
        this.setState(prev => {
            return {
                ...prev,
                staticShapes: prev.staticShapes.map((shape) => {
                    return shape.collapsed(iRows);
                }),
            }
        })
    }

    private collapse() {
        const rows = this.getCollapsableRows()
        if (rows.length > 0) {
            this.collapseRows(rows);
        }
    }

    // ~~~~~~~~~~~~~ validators ~~~~~~~~~~~~~ //

    private isValidShape(shape: GridShape): boolean {
        for (const coords of shape.getGridCoords()) {
            // 1. Check boundaries
            const exceedsColumns = coords.col < 0 || coords.col >= this.state.nColumns
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

    private isValidNext(): boolean {
        const activeShape = GridShape.copy(this.state.activeShape!)
        activeShape.next()
        return this.isValidShape(activeShape)
    }

    private isValidMove(offset: Offset): boolean {
        const activeShape = GridShape.copy(this.state.activeShape!)
        activeShape.move(offset)
        return this.isValidShape(activeShape)
    }

    private checkGameOver(frozenShape: GridShape) {
        const isOver = this.exceedsGrid(frozenShape)
        if (isOver) {
            this.setState({isGameOver: true}, () => {
                this.onGameOver();
            });
        }
    }

    private exceedsGrid(shape: GridShape): boolean {
        for (const coords of shape.getGridCoords()) {
            const exceedsColumns = coords.col < 0 || coords.col > this.state.nColumns
            const exceedsRows = coords.row < 0 || coords.row > this.getNumRows()

            if (exceedsColumns || exceedsRows) {
                return true;
            }
        }
        return false;
    }

    // ~~~~~~~~~~~~~ events ~~~~~~~~~~~~~ //

    handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.repeat || !this.isRunning() || !this.state.activeShape) {
            return
        }

        if (ev.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }

        switch (ev.key) {
            case 'ArrowDown':
                this.moveIfValid(Moves.downMove)
                break;
            case 'ArrowLeft':
                this.moveIfValid(Moves.leftMove)
                break;
            case 'ArrowRight':
                this.moveIfValid(Moves.rightMove)
                break;
            case 'R':
            case 'r':
                this.nextIfValid()
                break;
            case ' ':
                this.projectActive();
                break;
        }
    }

    protected update() {
        if (!this.isRunning()) {
            return
        }

        if (this.state.activeShape === undefined) {
            this.spawnActive()
        }

        if (!this.isValidMove(Moves.downMove)) {
            this.freezeAndSpawn()
        } else {
            this.moveActive(Moves.downMove)
        }
    }

    public componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
        this.start()
    }

    public componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.stop()
    }

    protected onFreeze(frozenShape: GridShape) {
        this.checkGameOver(frozenShape);
        this.collapse()
    }

    protected onSpawn() {
        return
    }

    protected onGameOver() {
        clearInterval(this.intervalId)
    }

    // ~~~~~~~~~~~~~ getters ~~~~~~~~~~~~~ //

    public getStaticShapes(): GridShape[] {
        return Array.from([...this.state.staticShapes, ...this.props.staticShapes ?? []])
    }

    public getNumRows(): number {
        return this.state.nRows
    }

    public getProjectionProps(shape: GridShape): ShapeProjectionProps {
        return {
            projectedShape: shape,
            shapeValidator: (shape: GridShape) => this.isValidShape(shape),
        } as ShapeProjectionProps
    }

    public getActiveProjectionProps(): ShapeProjectionProps {
        return this.getProjectionProps(this.state.activeShape!)
    }

    public getStartPosition(): Position {
        return {x: (Math.floor(this.state.nColumns / 2) - 1) * CellTuning.shape.width, y: -CellTuning.shape.height * 2}
    }

    // getCollapsableRows returns rows indexes that can be collapsed
    public getCollapsableRows(): number[] {
        const rows = new Array<number>()
        const rowCounts = new Map<number, number>()

        this.state.staticShapes.forEach((shape: GridShape) => {
            const coords = shape.getGridCoords()
            coords.map(({row}) => {
                if (rowCounts.has(row)) {
                    rowCounts.set(row, rowCounts.get(row)! + 1)
                } else {
                    rowCounts.set(row, 1)
                }
            })
        })
        rowCounts.forEach((rowCount, iRow) => {
            if (rowCount >= this.state.nColumns) {
                rows.push(iRow)
            }
        })

        return rows
    }

    public isRunning(): boolean {
        return (this.props.isRunning ?? true) && !this.isGameOver()
    }

    public isGameOver(): boolean {
        return this.state.isGameOver
    }

    public render() {
        return <div>
            {this.isGameOver() &&
                <GameOverComponent></GameOverComponent>
            }
            <GameGrid nrows={this.getNumRows()} ncols={this.state.nColumns}>
                {
                    this.getStaticShapes().map((shape, index) => (
                        <GridShapeComponent shape={shape} key={`static-shape-${index}`}/>
                    ))
                }
                {this.state.activeShape &&
                    <GridShapeComponent shape={this.state.activeShape} key={'active-shape'}/>
                }
                {this.state.activeShape &&
                    <ShapeProjection {...this.getActiveProjectionProps()}/>
                }
            </GameGrid>
        </div>
    }
}
