import React from "react";
import {Shapes} from "../tuning/Shapes.ts";
import type {ShapeProps, ShapeState} from "./Shape.ts";
import {Cell} from "../cells/Cell.tsx";


export class Shape extends React.Component<ShapeProps, ShapeState> {
    constructor(props: ShapeProps) {
        super(props);
        this.state = {
            xPos: 0,
            yPos: 0,
            ...this.props.initialPos
        }
    }

    moveDown(step: number) {
        this.setState((prevState) => {
            return {
                ...prevState,
                yPos: prevState.yPos + step
            }
        })
    }

    moveLeft(step: number) {
        this.setState((prevState) => {
            return {
                ...prevState,
                xPos: prevState.xPos - step
            }
        })
    }

    moveRight(step: number) {
        this.setState((prevState) => {
            return {
                ...prevState,
                xPos: prevState.xPos + step
            }
        })
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
                                    <Cell {...this.props.cellProps}> </Cell>
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>
    }
}