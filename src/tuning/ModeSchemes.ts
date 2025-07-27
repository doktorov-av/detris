// colorSchemes.js

import {type GameMode, Modes} from "../tetris/GameMode.ts";

export interface ModeSchemeVars {
    background: string;
    cellEmpty: string;
    cellColors: string[];
    gridStyling: string;
}

export const ModeSchemes = new Map<GameMode, ModeSchemeVars>([
    [Modes.Standard, {
        background: '#282c34',
        cellEmpty: '#e0e0e0',
        cellColors: ['#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'],
        gridStyling: 'red',
    }],
    [Modes.Fast, {
        background: '#121212',
        cellEmpty: '#2d2d2d',
        cellColors: ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#40c4ff'],
        gridStyling: 'green',
    }],
    [Modes.Slow, {
        background: '#f8f8f8',
        cellEmpty: '#e8e8e8',
        cellColors: ['#FFD1DC', '#FFECB8', '#D1FFD7', '#D1E2FF', '#E6D1FF', '#FFD1E2', '#D1F7FF'],
        gridStyling: 'blue',
    }],
    [Modes.Timed, {
        background: '#483737',
        cellEmpty: '#b824e5',
        cellColors: ['#FFD1DC', '#FFECB8', '#D1FFD7', '#D1E2FF', '#E6D1FF', '#FFD1E2', '#D1F7FF'],
        gridStyling: 'purple',
    }],
]);