import React from "react";
import {Shapes, type ShapeType} from "../tuning/Shapes.ts";

interface ShapeProps {
    type: ShapeType;
    cellComponent: React.ReactElement;
    initialPos?: ShapeState
}

interface ShapeState {
    xPos: number;
    yPos: number;
}

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
                shapeData.mShape.map((row, columnIndx) => {
                    return <div className='flex m-auto'>
                        {
                            row.map((opacity, rowIndx) => {
                                return <div className={`opacity-${opacity}`} key={`shape-cell-${columnIndx}-${rowIndx}`}>
                                    {React.cloneElement(this.props.cellComponent)}
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>
    }
}