import {createContext} from 'react';
import {type GameMode, Modes} from "../tetris/GameMode.ts";

export const ModeContext = createContext<GameMode>(Modes.Standard);
