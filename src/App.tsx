import {GameComponent} from "./tetris/game.tsx";
import {GameEditor} from "./field-editor/editor.tsx";
import {type GameState} from "./tetris/props.ts";
import {ModeContext} from "./contexts/Contexts.ts";
import React from "react";
import {GameMode} from "./tetris/gameMode.ts";

export default function App() {
    const initialState = {
        score: 0,
        level: 1,
        isRunning: false,
        cellsInARow: 20,
        numRows: 100,
        mode: GameMode.Standard,
    } as GameState

    const [state, setState] = React.useState<GameState>(initialState)

    return (
        <div className='root'>
            <ModeContext value={state.mode}>
                <GameEditor
                    stateSetter={setState}
                    initialState={initialState}
                />
                <GameComponent
                    state={state}
                    initialState={initialState}
                />
            </ModeContext>
        </div>
    );
}