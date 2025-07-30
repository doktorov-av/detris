import {Game} from "./tetris/Game.tsx";
import {GameEditor} from "./field-editor/Editor.tsx";
import {type GameProps} from "./tetris/GameProps.ts";
import {ModeContext} from "./contexts/Contexts.ts";
import React from "react";
import {type GameMode, Modes} from "./tetris/GameMode.ts";
import {Shape} from "./shapes/Shape.tsx";
import {Shapes, type ShapeType} from "./tuning/Shapes.ts";
import {type CellProps} from "./cells/Cell.tsx";
import {Cells} from "./cells/CellType.ts";

const iniGameProps: GameProps = {
    staticShapes: [],
    moveDelayMs: 1000,
    nrows: 30,
    mode: Modes.Standard,
    isRunning: true,
}

export default function App() {
    const [gameProps, setGameProps] = React.useState<GameProps>(iniGameProps)

    return (
        <div className='root flex flex-col w-dvh place-items-center'>
            <div className='flex gap-10 justify-between mt-5' key='shapes-gallery'>
                {
                    Object.entries(Shapes).map(([key], index) => {
                        const shapeType = key as ShapeType

                        // if we want special rendering for any shape :)
                        if (shapeType === "LShapeInv") {
                            return <Shape type={shapeType} key={`showcase-shape-${index}`}
                                          cellProps={{type: Cells.blue} as CellProps}/>
                        }

                        return <Shape type={shapeType} key={`showcase-shape-${index}`} cellProps={{type: Cells.red}}/>
                    })
                }
            </div>

            <ModeContext value={gameProps.mode as GameMode}>
                <GameEditor
                    propsSetter={setGameProps}
                    iniProps={gameProps}
                />
                <Game
                    {...gameProps}
                    /*
                        staticShapes={[{
                            shapeProps : {
                                type: "TShape",
                                cellProps: {
                                    type: Cells.blue
                                }
                            },
                            position : {
                                x: CellTuning.shape.width * 10,
                                y: CellTuning.shape.height * 10
                            }
                        }]}
                    */
                />
            </ModeContext>
        </div>
    );
}