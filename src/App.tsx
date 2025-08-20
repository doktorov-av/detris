import {Game} from "./tetris/Game.tsx";
import {GameEditor} from "./field-editor/Editor.tsx";
import {type GameProps} from "./tetris/GameProps.ts";
import {ModeContext} from "./contexts/Contexts.ts";
import React from "react";
import { Modes} from "./tetris/GameMode.ts";
import {ShapeComponent} from "./shapes/ShapeComponent.tsx";
import {Shapes, type ShapeType} from "./tuning/Shapes.ts";
import {type CellProps} from "./cells/Cell.tsx";
import {Cells} from "./cells/CellType.ts";
import {GridShape} from "./shapes/GridShape.ts";

const iniGameProps: GameProps = {
    staticShapes: [],
    moveDelayMs: 1000,
    mode: Modes.Standard,
    isRunning: true,
}

export default function App() {
    const [gameProps, setGameProps] = React.useState<GameProps>(iniGameProps)

    const gameRef = React.useRef<Game>(null)
    return (
        <div className='root flex flex-col w-dvh place-items-center'>
            <div className='flex gap-10 justify-between m-5' key='shapes-gallery'>
                {
                    Object.entries(Shapes).map(([key], index) => {
                        const shapeType = key as ShapeType

                        // if we want special rendering for any shape :)
                        if (shapeType === "LShapeInv") {
                            return <ShapeComponent shape={
                                new GridShape(shapeType, {type: Cells.blue} as CellProps)
                            } key={`showcase-shape-${index}`}/>
                        }

                        return <ShapeComponent shape={
                            new GridShape(shapeType, {type: Cells.red} as CellProps)
                        } key={`showcase-shape-${index}`}/>
                    })
                }
            </div>

            <ModeContext value={gameProps.mode!}>
                <GameEditor
                    propsSetter={setGameProps}
                    iniProps={gameProps}
                    gameRef={gameRef}
                />
                <Game {...gameProps} ref={gameRef}/>
            </ModeContext>
        </div>
    );
}