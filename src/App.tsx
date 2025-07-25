import {Cell, GameComponent} from "./tetris/game.tsx";
import {GameEditor} from "./field-editor/editor.tsx";
import {type GameState} from "./tetris/props.ts";
import {ModeContext} from "./contexts/Contexts.ts";
import React from "react";
import {GameMode} from "./tetris/gameMode.ts";
import {Shape} from "./shapes/Shape.tsx";

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
        <div className='root flex flex-col w-dvh place-items-center'>
            <div className='flex gap-10 justify-between mt-5' key='shapes-gallery'>
                <Shape type={"LShape"} cellComponent={<div className={'cell blue'}></div>}/>
                <Shape type={"LShapeInv"} cellComponent={<Cell/>}/>
                <Shape type={"Cube"} cellComponent={<div className={'cell red'}></div>}/>
                <Shape type={"TShape"} cellComponent={<Cell/>}/>
                <Shape type={"FlatShape"} cellComponent={<div className={'cell red'}></div>}/>
            </div>

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