import {ModeContext} from "../contexts/Contexts.ts";
import {isDebug} from "../application/Application.ts";
import {GameEditor} from "../field-editor/Editor.tsx";
import {Game} from "../tetris/Game.tsx";
import React, {useRef, useState} from "react";
import type {GameProps} from "../tetris/GameProps.ts";
import {Modes} from "../tetris/GameMode.ts";
import {Gallery} from "./Gallery.tsx";
import {GameOverComponent} from "./GameOverComponent.tsx";
import Controls from "./Controls.tsx";

const iniGameProps: GameProps = {
    mode: Modes.Standard,
    isRunning: true,
}

export const Tetris: React.FunctionComponent = () => {
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
    const [gameProps, setGameProps] = useState<GameProps>({
        ...iniGameProps,
        onGameOver: () => setIsGameOver(true),
        onStart: () => setIsGameOver(false),
    } as GameProps);

    const gameRef = useRef<Game>(null)

    return <div className='flex flex-col place-items-center mx-5 sm:w-1/2 sm:m-auto'>
        <Gallery/>
        <ModeContext value={gameProps.mode!}>
            {isDebug() &&
                <GameEditor
                    propsSetter={setGameProps}
                    iniProps={gameProps}
                    gameRef={gameRef}
                />
            }

            <div className='flex flex-col'>
                {isGameOver &&
                    <GameOverComponent/>
                }
                <div className='flex flex-col sm:flex-row mt-5 space-y-10 sm:space-y-0'>
                    <Game {...gameProps} ref={gameRef}/>
                    <Controls/>
                </div>
            </div>
        </ModeContext>
    </div>
}