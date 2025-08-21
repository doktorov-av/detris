import React from "react";
import { Cell } from "../cells/Cell.tsx";
import type { GridCell } from "./GridCell.ts";

export interface GridCellComponentProps {
    cell: GridCell;
    className?: string;
}

export const GridCellComponent: React.FC<GridCellComponentProps> = ({ cell, className = "" }: GridCellComponentProps) => {
    return (
        <div
            className={`absolute ${className}`}
            style={{
                top: cell.getY(),
                left: cell.getX(),
                transition: "transform 0.2s, opacity 0.2s"
            }}
        >
            <Cell {...cell.getProps()}> </Cell>
        </div>
    );
}