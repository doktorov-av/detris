import React from 'react';
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
import {GridCell} from "../shapes/GridCell.ts";
import {GridCellComponent} from "../shapes/GridCellComponent.tsx";
import './Game.css'
import {StatEntry} from "../components/StatEntry.tsx";
import {Stats} from "../components/Stats.tsx";
import {isDebug} from "../application/Application.ts";

export class Game extends React.Component<GameProps, GameState> {
    private intervalId?: number
    private animationTimeout?: number
    private readonly initialState: GameState
    private touchStartX = 0;
    private touchStartY = 0;
    private lastTouchStartTime: number | null = null;

    constructor(props: GameProps) {
        super(props);
        this.state = {
            score: 0,
            level: 1,
            clearedRowsCount: 0,
            isGameOver: false,
            cells: [],
            clearingRows: [],
            nRows: 20,
            nColumns: 10,
            moveDelayMs: 1000,
            disappearTimeoutMs: 500,
            mode: Modes.Standard,
            isRunning: true,
            ...props,
        };

        this.state = {
            ...this.state,
            activeShape: RandomizeShape().move(this.getStartPosition()),
        }

        this.intervalId = undefined
        this.animationTimeout = undefined
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.initialState = this.state
    }

    // ~~~~~~~~~~~~~ interface ~~~~~~~~~~~~~ //

    public start() {
        if (this.props.onStart) {
            this.props.onStart();
        }
        this.intervalId = setInterval(() => {
            this.update()
        }, this.state.moveDelayMs);
    }

    public switchPause() {
        this.setState((prev) => ({
            ...prev,
            isRunning: !prev.isRunning,
        }))
    }

    public stop() {
        clearInterval(this.intervalId);
    }

    public restart() {
        this.stop()
        this.setState(() => {
            return this.initialState
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
            score: prev.score + GridShape.verticalDistance(prev.activeShape!, projectedShape) * 2 * this.state.level,
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
            cells: [...prev.cells, ...prev.activeShape!.getCells()],
            activeShape: undefined,
        }), () => {
            this.onFreeze(frozenShape);
        });
    }

    private collapseCompleteRows() {
        const rowCounts = new Map<number, number>();

        // Count cells in each row
        this.state.cells.forEach(cell => {
            const row = cell.getGridPosition().row;
            rowCounts.set(row, (rowCounts.get(row) ?? 0) + 1);
        });

        // Find complete rows
        const completeRows: number[] = [];
        rowCounts.forEach((count, row) => {
            if (count >= this.state.nColumns) {
                completeRows.push(row);
            }
        });

        if (completeRows.length > 0) {
            this.setState(prev => ({
                ...prev,
                clearingRows: completeRows,
            }), () => {
                clearTimeout(this.animationTimeout);
                this.animationTimeout = window.setTimeout(() => {
                    this.collapseRows(completeRows);
                }, this.state.disappearTimeoutMs);
            })
        }
    };

    private collapseRows(rowsToCollapse: number[]) {
        this.setState(prev => {
            // Filter out cells in completed rows
            const remainingCells = prev.cells.filter(
                cell => !rowsToCollapse.includes(cell.getGridPosition().row)
            );

            // Move cells above the collapsed rows down
            const updatedCells = remainingCells.map(cell => {
                const cellRow = cell.getGridPosition().row;
                const rowsAboveCollapsed = rowsToCollapse.filter(row => row > cellRow).length;

                if (rowsAboveCollapsed > 0) {
                    return cell.copy().move(Moves.multiply(Moves.downMove, rowsAboveCollapsed))
                }

                return cell;
            });

            return {
                ...prev,
                cells: updatedCells,
                clearedRowsCount: prev.clearedRowsCount + rowsToCollapse.length,
                clearingRows: [],
                score: prev.score + this.getLineClearScore(rowsToCollapse.length),
            }
        }, () => {
            this.onCollapsed()
        })
    };

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

            // 2. Check collisions with cells
            for (const cell of this.state.cells) {
                if (cell.overlaps(coords)) {
                    return false;
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
        if (ev.repeat || !this.isRunning() || this.state.activeShape === undefined) {
            return
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
            default:
                return;
        }

        ev.preventDefault();
    }

    private readonly handleTouchStart = (e: React.TouchEvent) => {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;



        if (this.lastTouchStartTime !== undefined && e.timeStamp - this.lastTouchStartTime! <= 300) {
            this.projectActive()
            return;
        }

        this.lastTouchStartTime = e.timeStamp;
    };

    private readonly handleTouchMove = (e: React.TouchEvent) => {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        const diffX = touchX - this.touchStartX;
        const diffY = touchY - this.touchStartY;

        // Minimum swipe distance to trigger an action
        const minSwipeDistance = 30;

        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                this.moveIfValid(Moves.rightMove);
            } else {
                this.moveIfValid(Moves.leftMove);
            }
            this.touchStartX = touchX;
            this.touchStartY = touchY;
        }

        if (diffY > minSwipeDistance) {
            this.moveIfValid(Moves.downMove);
            this.touchStartY = touchY;
        }
    };

    private readonly handleTouchEnd = (e: React.TouchEvent) => {
        if (!this.touchStartX || !this.touchStartY) return;
        e.preventDefault();

        const touchX = e.changedTouches[0].clientX;
        const touchY = e.changedTouches[0].clientY;

        const diffX = touchX - this.touchStartX;
        const diffY = touchY - this.touchStartY;

        // Minimum swipe distance to trigger an action
        const minSwipeDistance = 10;

        // Check if it's a quick swipe up
        if (diffY < -minSwipeDistance && Math.abs(diffY) > Math.abs(diffX)) {
            this.nextIfValid();
        }

        // Check if it's a quick swipe down
        if (diffY > minSwipeDistance && Math.abs(diffY) > Math.abs(diffX)) {
            this.projectActive();
        }

        this.touchStartX = 0;
        this.touchStartY = 0;
    };


    protected update() {
        if (!this.isRunning()) {
            return
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
        window.clearTimeout(this.animationTimeout)
        this.stop()
    }

    protected onFreeze(frozenShape: GridShape) {
        this.checkGameOver(frozenShape);
        this.collapseCompleteRows()
    }

    protected onSpawn() {
        return
    }

    protected onGameOver() {
        if (this.props.onGameOver) {
            this.props.onGameOver();
        }
        clearInterval(this.intervalId)
    }

    protected onCollapsed() {
        // check if we can level-up
        if (this.state.clearedRowsCount >= 5 * this.state.level) {
            this.setState(prev => ({
                ...prev,
                level: prev.level + 1,
            }), () => {
                this.onLevelUp()
            })
        }
    }

    protected onLevelUp() {
        this.setState(prev => ({
            ...prev,
            moveDelayMs: Math.max(this.initialState.moveDelayMs - (970 / 20) * prev.level, this.getMinUpdateMs()),
            disappearTimeoutMs: Math.max(this.initialState.disappearTimeoutMs - (500 / 20) * prev.level, 0),
        }), () => {
            this.stop()
            this.start()
        })
    }

    // ~~~~~~~~~~~~~ getters ~~~~~~~~~~~~~ //

    public getCells(): GridCell[] {
        return this.state.cells
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

    public getLineClearScore(numRows: number): number {
        if (numRows <= 0) {
            throw new Error("amount of cleared rows must be greater than 0")
        }
        if (numRows > this.state.nRows) {
            throw new Error(`amount of cleared rows must be less than ${this.state.nRows}`)
        }

        const rawScore = () => {
            // wow! all rows cleared
            if (numRows === this.state.nRows) {
                return numRows * 200;
            }

            // handle 1 - 3 rows cleared
            switch (numRows) {
                case 1:
                    return 40;
                case 2:
                    return 100;
                case 3:
                    return 300;
                default:
                    break
            }

            // 4-nRows cleared! good job!
            return numRows * 120;
        }
        return rawScore() * this.state.level
    }

    public getMinUpdateMs(): number {
        return 10
    }

    public isRunning(): boolean {
        return this.state.isRunning && !this.isGameOver() && this.state.activeShape !== undefined
    }

    public isGameOver(): boolean {
        return this.state.isGameOver
    }

    private isClearing(row: number): boolean {
        return this.state.clearingRows.includes(row)
    }

    public render() {
        return <div className='flex'>
            <div
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                style={{touchAction: 'none'}}
            >
                <GameGrid nRows={this.getNumRows()} nColumns={this.state.nColumns}>
                    {
                        this.getCells().map((cell, index) => {
                            const row = cell.getGridPosition().row
                            return (<GridCellComponent
                                cell={cell}
                                key={`static-cell-${index}`}
                                className={this.isClearing(row) ? 'clearing' : ''}
                            />)
                        })
                    }
                    {this.state.activeShape &&
                        <GridShapeComponent shape={this.state.activeShape} key={'active-shape'}/>
                    }
                    {this.state.activeShape &&
                        <ShapeProjection {...this.getActiveProjectionProps()}/>
                    }
                </GameGrid>
            </div>
            <Stats>
                <StatEntry>
                    Score: {this.state.score}
                </StatEntry>
                <StatEntry>
                    Level: {this.state.level}
                </StatEntry>
                <StatEntry>
                    Cleared: {this.state.clearedRowsCount}
                </StatEntry>
                {isDebug() &&
                    <StatEntry>
                        Delay: {this.state.moveDelayMs}
                    </StatEntry>
                }
                {isDebug() &&
                    <StatEntry>
                        Timeout: {this.state.disappearTimeoutMs}
                    </StatEntry>
                }
            </Stats>
        </div>
    }
}
