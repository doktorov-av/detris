import {createContext} from 'react';

import {GameMode} from "../tetris/gameMode.ts";

export const ModeContext = createContext(GameMode.Standard);