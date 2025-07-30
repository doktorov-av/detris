import {Cells, type CellType} from "../cells/CellType.ts";
import {Shapes, type ShapeType} from "../tuning/Shapes.ts";
import type {ShapeProps} from "../shapes/Shape.ts";

export const RandomizeShape = (): ShapeProps => {
    const cells = Object.values(Cells).filter((value) => value != Cells.white)
    let randomIndex = Math.floor(Math.random() * cells.length)
    const randCell = cells[randomIndex]

    const types = Object.keys(Shapes)
    randomIndex = Math.floor(Math.random() * types.length)
    const type = types[randomIndex]

    return {
        type: type as ShapeType,
        cellProps: {
            type: randCell as CellType,
        }
    }
}