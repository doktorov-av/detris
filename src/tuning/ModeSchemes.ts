import type {CSSProperties} from "react";
import {type GameMode, Modes} from "../tetris/GameMode.ts";


export const ModeSchemes: Record<GameMode, CSSProperties> = {
    [Modes.Standard]: { color: "red" },
    [Modes.Slow]: { color: "blue" },
    [Modes.Fast]: { color: "green" },
    [Modes.Timed]: { color: "purple" },
};
