import React from "react";
import {Shapes} from "../tuning/Shapes.ts";
import type {ShapeProps} from "./Shape.ts";
import {Cell} from "../cells/Cell.tsx";


export class Shape extends React.Component<ShapeProps> {
    constructor(props: ShapeProps) {
        super(props);
    }

    render() {
        const shapeData = Shapes[this.props.type]

        return <div className='inline-block'>
            {
                shapeData.mShape.map((row, iCol) => {
                    return <div className='flex m-auto'>
                        {
                            row.map((opacity, iRow) => {
                                return <div className={`opacity-${opacity}`} key={`shape-cell-${iCol}-${iRow}`} style={{opacity: opacity}}>
                                    <Cell {...this.props.cellProps} key={`cell-${iRow}-${iCol}`}> </Cell>
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>
    }
}