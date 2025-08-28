// colorSchemes.js

import {type GameMode, Modes} from "../tetris/GameMode.ts";
import styled, {css} from "styled-components";
import {ModeSchemes} from "./ModeSchemes.ts";


export const GridContainer = styled.div<{mode: GameMode}>`
    overflow: clip;
    padding: 10px;
    
    ${({mode = Modes.Standard}) => {
        const primaryColor = ModeSchemes[mode].color
        switch (mode) {
            case Modes.Standard:
                return css`
                    background-image: linear-gradient(to right, ${primaryColor}, darkred);
                `;
            case Modes.Slow:
                return css`
                    background-image: linear-gradient(to right, ${primaryColor}, darkgreen);
                `;
            case Modes.Fast:
                return css`
                    background-image: linear-gradient(to right, ${primaryColor}, royalblue);
                `;
            case Modes.Timed:
                return css`
                    background-image: linear-gradient(to right, ${primaryColor}, mediumpurple);
                `
        }
    }}
`