import {GetShapeCellPositions, Shapes, type ShapeType} from "../tuning/Shapes.ts";
import type {Coords, Offset, Position} from "../tetris/GameProps.ts";
import {CellTuning} from "../tuning/Cells.ts";
import type {CellProps} from "../cells/Cell.tsx";
import {Cells} from "../cells/CellType.ts";
import {Utils} from '../utils/Utils';
import {GridCell} from "./GridCell.ts";

export class GridShape {
    private cellPositions: Position[]; // cells positions in grid space
    private variantIndex: number; // current shape variant
    private cellProps: CellProps;
    private readonly type: ShapeType;
    private offset: Offset;

    constructor(type: ShapeType, cellProps?: CellProps, offset?: Offset, variantIndex?: number) {
        this.type = type
        this.cellProps = cellProps ?? {type: Cells.red}
        this.offset = offset ?? {x: 0, y: 0};
        this.variantIndex = variantIndex ?? 0;

        this.cellPositions = GetShapeCellPositions(this.type, this.variantIndex)
    }

    static copy(shape: GridShape): GridShape {
        const newShape = new GridShape(shape.type, shape.cellProps, shape.offset, shape.variantIndex)
        newShape.cellPositions = shape.cellPositions
        return newShape
    }

    static verticalDistance(lhs: GridShape, rhs: GridShape): number {
        return Math.abs(lhs.getGridCoords()[0].row - rhs.getGridCoords()[0].row)
    }

    public next(): this {
        this.variantIndex = this.nextVariant()
        this.cellPositions = GetShapeCellPositions(this.type, this.variantIndex)
        return this
    }

    public move(offset: Offset): this {
        this.offset = Utils.offset(this.offset, offset)
        return this;
    }

    public moved(offset: Offset): GridShape {
        return GridShape.copy(this).move(offset)
    }

    public moveCells(cells: number[], offset: Offset): this {
        for (const i of cells) {
            this.cellPositions[i] = Utils.offset(this.cellPositions[i], offset)
        }
        return this;
    }

    public movedCells(cells: number[], offset: Offset): GridShape {
        return GridShape.copy(this).moveCells(cells, offset)
    }

    public collapse(iRows: number[]): this {
        this.cellPositions = this.cellPositions.filter((v) => {
            const gridCoords = this.toGridCoords(v)
            return !iRows.includes(gridCoords.row)
        })
        return this;
    }

    public collapsed(iRows: number[]): GridShape {
        return GridShape.copy(this).collapse(iRows)
    }

    public isUponRows(iRows: number[]): boolean {
        const gridCoords = this.getGridCoords()
        for (const gridCoord of gridCoords) {
            for (const row of iRows) {
                if (gridCoord.row > row) {
                    return false
                }
            }
        }
        return true
    }

    public isEmpty(): boolean {
        return this.cellPositions.length === 0
    }

    public getGridCoords(): Coords[] {
        return this.getRenderedPositions().map((pos): Coords => {
            return Utils.toGridCoords(pos)
        })
    }

    // returns grid space positions
    public getRenderedPositions(): Position[] {
        return this.cellPositions.map((pos) => {
            return Utils.offset(pos, this.offset)
        })
    }

    private toGridCoords(pos: Position): Coords {
        pos = Utils.offset(pos, this.offset)
        return {
            col: Math.floor(pos.x / CellTuning.shape.width),
            row: Math.floor(pos.y / CellTuning.shape.height)
        }
    }

    public getType(): ShapeType {
        return this.type;
    }

    public getCellProps(): CellProps {
        return this.cellProps
    }

    public getVariant(): number {
        return this.variantIndex;
    }

    public getCells(): GridCell[] {
        return this.getRenderedPositions().map((pos): GridCell => {
            return new GridCell(pos, this.cellProps)
        })
    }

    public getCellsUponRows(iRows: number[]): number[] {
        const result: number[] = []
        this.getGridCoords().forEach((coords, i) => {
            iRows.forEach((row) => {
                if (coords.row < row) {
                    result.push(i)
                }
            })
        })
        return result
    }

    public setCellProps(cellProps: CellProps): void {
        this.cellProps = cellProps
    }

    private maxVariants(): number {
        return Shapes[this.type].mShape.length
    }

    private nextVariant(): number {
        return this.variantIndex + 1 < this.maxVariants() ? this.variantIndex + 1 : 0
    }
}
