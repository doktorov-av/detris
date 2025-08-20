import {GetShapeCellPositions, Shapes, type ShapeType} from "../tuning/Shapes.ts";
import type {Coords, Offset, Position} from "../tetris/GameProps.ts";
import {CellTuning} from "../tuning/Cells.ts";
import type {CellProps} from "../cells/Cell.tsx";
import {Cells} from "../cells/CellType.ts";
import {Utils} from '../utils/Utils';

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
        return new GridShape(shape.type, shape.cellProps, shape.offset, shape.variantIndex)
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

    public getGridCoords(): Coords[] {
        return this.getRenderedPositions().map((pos): Coords => ({
            col: Math.floor(pos.x / CellTuning.shape.width),
            row: Math.floor(pos.y / CellTuning.shape.height)
        }))
    }

    // returns grid space positions
    public getRenderedPositions(): Position[] {
        return this.cellPositions.map((pos) => {
            return Utils.offset(pos, this.offset)
        })
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
