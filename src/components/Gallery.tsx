import {Shapes, type ShapeType} from "../tuning/Shapes.ts";
import {ShapeComponent} from "../shapes/ShapeComponent.tsx";
import {GridShape} from "../shapes/GridShape.ts";
import {Cells} from "../cells/CellType.ts";
import type {CellProps} from "../cells/Cell.tsx";
import React from "react";

export const Gallery: React.FunctionComponent = () => {
    return <ul className='flex gap-5 m-5 sm:scale-100 scale-75' key='shapes-gallery'>
        {
            Object.entries(Shapes).map(([key], index) => {
                const shapeType = key as ShapeType

                // if we want special rendering for any shape :)
                if (shapeType === "LShapeInv") {
                    return <ShapeComponent shape={
                        new GridShape(shapeType, {type: Cells.blue} as CellProps)
                    } key={`showcase-shape-${index}`}/>
                }

                return <ShapeComponent shape={
                    new GridShape(shapeType, {type: Cells.red} as CellProps)
                } key={`showcase-shape-${index}`}/>
            })
        }
    </ul>
}