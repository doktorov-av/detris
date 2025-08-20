// shapes and their variants
import {CellTuning} from "./Cells.ts";
import type {Position} from "../tetris/GameProps.ts";

export const Shapes = {
    'FlatShape': {
        mShape: [
            [
                [1, 1, 1, 1],
            ],
            [
                [0, 1],
                [0, 1],
                [0, 1],
                [0, 1]
            ]
        ]
    },
    'TShape': {
        mShape: [
            [
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ]
        ]
    },
    'LShape': {
        mShape: [
            [
                [0, 0, 1],
                [1, 1, 1]
            ],
            [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
            ],
            [
                [1, 1, 1],
                [1, 0, 0],
            ],
            [
                [0, 1, 1],
                [0, 0, 1],
                [0, 0, 1],
            ]
        ]
    },
    'LShapeInv': {
        mShape: [
            [
                [1, 0, 0],
                [1, 1, 1]
            ],
            [
                [1, 1, 0],
                [1, 0, 0],
                [1, 0, 0],
            ],
            [
                [1, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 1],
                [0, 0, 1],
                [0, 1, 1],
            ]
        ]
    },
    'Cube': {
        mShape: [
            [
                [1, 1],
                [1, 1]
            ]
        ]
    }
} as const;

export type ShapeType = keyof typeof Shapes;

export function GetShapeCellPositions(type: ShapeType, variant: number): Position[] {
    const shapeVariant = Shapes[type].mShape[variant]
    const result = new Array<Position>
    for (let iRow = 0; iRow < shapeVariant.length; iRow++) {
        for (let iCol = 0; iCol < shapeVariant[iRow].length; iCol++) {
            if (shapeVariant[iRow][iCol] === 0)
                continue;

            result.push({
                x: iCol * CellTuning.shape.width,
                y: iRow * CellTuning.shape.height,
            })
        }
    }
    return result
}