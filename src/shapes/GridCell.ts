import type {Coords, Offset, Position} from "../tetris/GameProps.ts";
import type {CellProps} from "../cells/Cell.tsx";
import {Utils} from "../utils/Utils.ts";

export class GridCell {
    private position: Position;
    private readonly props: CellProps;

    constructor(position: Position, props: CellProps) {
        this.position = position;
        this.props = props;
    }

    public copy(): GridCell {
        return new GridCell(this.position, this.props);
    }

    public move(offset: Offset): this {
        this.position = Utils.offset(this.position, offset)
        return this
    }

    public getGridPosition(): Coords {
        return Utils.toGridCoords(this.position);
    }

    public isAbove(iRow: number): boolean {
        return this.getGridPosition().row < iRow;
    }

    public overlaps(coords: Coords): boolean {
        const gridCoords = this.getGridPosition();
        return gridCoords.row === coords.row && gridCoords.col === coords.col;
    }

    public getProps(): CellProps {
        return this.props;
    }

    public getX(): number {
        return this.position.x;
    }

    public getY(): number {
        return this.position.y;
    }
}