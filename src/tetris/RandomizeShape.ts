import {Cells, type CellType} from "../cells/CellType.ts";
import {Shapes, type ShapeType} from "../tuning/Shapes.ts";
import {GridShape} from "../shapes/GridShape.ts";

export const RandomizeShape = (): GridShape => {
    const cells = Object.values(Cells).filter((value) => value != Cells.white)
    let randomIndex = Math.floor(Math.random() * cells.length)
    const randCell = cells[randomIndex]

    const types = Object.keys(Shapes)
    randomIndex = Math.floor(Math.random() * types.length)
    const type = types[randomIndex]

    return new GridShape(type as ShapeType, {
        type: randCell as CellType,
    })
}