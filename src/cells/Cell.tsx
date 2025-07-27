import styled, { css } from 'styled-components';
import {Cells, type CellType} from "./CellType.ts";

export interface CellProps {
    type?: CellType;
    height?: string;
    width?: string;
}

const Defaults = {
    type: Cells.white,
    height: "25px",
    width: "25px",
};

export const Cell = styled.div<CellProps>`
    display: block;
    width: ${({ width }) => width ?? Defaults.width};
    height: ${({ height }) => height ?? Defaults.height};

    ${({ type = Defaults.type }) => {
        switch (type) {
            case Cells.white:
                return css`
                    border: 1px solid #ccc;
                    background-color: #f0f0f0;
                `;
            case Cells.red:
                return css`
                    border: 1px solid yellow;
                    background: radial-gradient(#d22f13, red);
                    box-shadow: 0 0 10px 2px red,
                    0 0 20px 1px inset darkred;
                `;
            case Cells.blue:
                return css`
                    border: 1px solid yellow;
                    background: cyan;
                    box-shadow: 0 0 10px 2px cornflowerblue,
                    0 0 20px 1px inset blueviolet;
                `;
        }
    }}
`;