import React from "react";
import type {GridShape} from "./GridShape.ts";
import {Cell} from "../cells/Cell.tsx";
import {Shapes} from "../tuning/Shapes.ts";

export interface ShapeComponentProps {
    shape: GridShape;
}

export const ShapeComponent: React.FC<ShapeComponentProps> = ({shape}: ShapeComponentProps) => {
    const shapeData = Shapes[shape.getType()].mShape[shape.getVariant()] // use first variant

    return <div className='inline-block'>
        {
            shapeData.map((row, iCol) => {
                return <div className='flex m-auto' key={`shape-${iCol}`}>
                    {
                        row.map((opacity, iRow) => {
                            return <div className={`opacity-${opacity}`} key={`shape-cell-${iCol}-${iRow}`} style={{opacity: opacity}}>
                                <Cell {...shape.getCellProps()} key={`cell-${iRow}-${iCol}`}> </Cell>
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}