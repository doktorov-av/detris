import React from 'react';
import {IoIosAdd} from "react-icons/io";
import {RxReset} from "react-icons/rx";
import './Editor.css'
import { SegmentedControl } from '@mantine/core';
import {type GameProps} from "../tetris/GameProps.ts";
import {type GameModeName, Modes} from "../tetris/GameMode.ts";
import { IoPlayOutline as PlayButton } from "react-icons/io5";

interface GameEditorProps {
    propsSetter: React.Dispatch<React.SetStateAction<GameProps>>;
    iniProps: GameProps
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
                        <IoIosAdd
                            className="add-button manipulator"
                            onClick={() => {
                                this.props.propsSetter(prev => {
                                    return {
                                        ...prev,
                                        nrows: prev.nrows ?? (prev.nrows as unknown as number) + 1,
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className="circle-container">
                        <RxReset
                            className="reset-button manipulator"
                            onClick={() => {
                                this.props.propsSetter(prev => {
                                    return {
                                        ...prev,
                                        numRows: this.props.iniProps.nrows,
                                    }
                                });
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