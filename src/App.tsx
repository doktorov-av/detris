import {Game} from "./tetris/Game.tsx";
import {GameEditor} from "./field-editor/Editor.tsx";
import {type GameState} from "./tetris/props.ts";
import {ModeContext} from "./contexts/Contexts.ts";
import React from "react";
import {Modes} from "./tetris/GameMode.ts";
import {Shape} from "./shapes/Shape.tsx";
import {Shapes, type ShapeType} from "./tuning/Shapes.ts";
import {type CellProps} from "./cells/Cell.tsx";
import {Cells} from "./cells/CellType.ts";

export default function App() {
    const initialState = {
        score: 0,
        level: 1,
        isRunning: false,
        cellsInARow: 20,
        numRows: 100,
        mode: Modes.Standard,
    } as GameState

    const [state, setState] = React.useState<GameState>(initialState)


    return (
        <div className='root flex flex-col w-dvh place-items-center'>
            <div className='flex gap-10 justify-between mt-5' key='shapes-gallery'>
                {
                    Object.entries(Shapes).map(([key]) => {
                        const shapeType = key as ShapeType

                        // if we want special rendering for any shape :)
                        if (shapeType === "LShapeInv") {
                            return <Shape type={key as ShapeType} cellProps={{type: Cells.blue} as CellProps}/>
                        }

                        return <Shape type={shapeType} cellProps={{type: Cells.red}}/>
                    })
                }
            </div>

            <ModeContext value={state.mode}>
                <GameEditor
                    stateSetter={setState}
                    initialState={initialState}
                />
                <Game
                    state={state}
                    initialState={initialState}
                />
            </ModeContext>
        </div>
    );
}