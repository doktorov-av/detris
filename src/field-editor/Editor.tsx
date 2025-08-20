import React from 'react';
import {IoIosAdd as AppendButton} from "react-icons/io";
import './Editor.css'
import { SegmentedControl } from '@mantine/core';
import {type GameProps} from "../tetris/GameProps.ts";
import {type GameModeName, Modes} from "../tetris/GameMode.ts";
import { IoPlayOutline as PlayButton } from "react-icons/io5";
import { MdOutlineRestartAlt as RestartButton } from "react-icons/md";
import type {Game} from "../tetris/Game.tsx";

interface GameEditorProps {
    propsSetter: React.Dispatch<React.SetStateAction<GameProps>>;
    iniProps: GameProps
    gameRef: React.RefObject<Game | null>
}

export class GameEditor extends React.Component<GameEditorProps> {
    constructor(props: GameEditorProps) {
        super(props);
    }

    render() {
        return (
            <div className="panel-container">
                <SegmentedControl
                    radius="xl"
                    size="md"
                    data={Object.keys(Modes)}
                    onChange={value => {
                        this.props.propsSetter((prev) => {
                            return {
                                ...prev,
                                mode: Modes[value as GameModeName],
                            }
                        })
                    }}
                />
                <div style={{display: "flex", gap: "20px", margin: "auto"}}>
                    <div className="circle-container">
                        <AppendButton
                            className="add-button manipulator"
                            onClick={() => {
                                this.props.gameRef.current?.appendRow()
                            }}
                        />
                    </div>
                    <div className="circle-container">
                        <RestartButton
                            className="reset-button manipulator"
                            onClick={() => {
                                this.props.gameRef.current?.restart();
                            }}
                        />
                    </div>
                    <div className="circle-container">
                        <PlayButton
                            className='hover:cursor-pointer'
                            color={'orange'}
                            size={80}
                            onClick={() => {
                                this.props.propsSetter(prev => {
                                    return {
                                        ...prev,
                                        isRunning: !prev.isRunning,
                                    }
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}