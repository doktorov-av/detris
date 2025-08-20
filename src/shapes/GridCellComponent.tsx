import React from "react";
import {Cell} from "../cells/Cell.tsx";
import type {GridCell} from "./GridCell.ts";

export interface GridCellComponentProps {
    cell: GridCell;
}

export const GridCellComponent: React.FC<GridCellComponentProps> = ({cell}: GridCellComponentProps) => {
    return <div className='absolute' style={{top: cell.getY(), left: cell.getX()}}>
        <Cell {...cell.getProps()}> </Cell>
    </div>
}