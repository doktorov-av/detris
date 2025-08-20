import styled, {css} from 'styled-components';
import {Cells, type CellType} from "./CellType.ts";
import {CellTuning} from "../tuning/Cells.ts";

export interface CellProps {
    type?: CellType;
}

const Defaults = {
    type: Cells.white,
};

export const Cell = styled.div<CellProps>`
    display: block;
    width: ${CellTuning.shape.widthPx};
    height: ${CellTuning.shape.heightPx};

    ${({type = Defaults.type}) => {
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
            case Cells.projected:
                return css`
                    background: rgba(128, 128, 128, 0.3);
                    border: 1px solid rgba(0, 0, 255, 0.3);
                `
        }
    }}
`;