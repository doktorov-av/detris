import type {Offset} from "./GameProps.ts";
import {CellTuning} from "../tuning/Cells.ts";


export const Moves = {
    get downMove(): Offset {
        return {x: 0, y: CellTuning.shape.height}
    },
    get leftMove(): Offset {
        return {x: -CellTuning.shape.width, y: 0}
    },
    get rightMove(): Offset {
        return {x: -this.leftMove.x, y: 0}
    },
    multiply: (offset: Offset, multiplier: number): Offset => {
        return {
            x: offset.x  * multiplier,
            y: offset.y  * multiplier,
        }
    }

} as const;