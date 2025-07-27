import React from 'react';
import {IoIosAdd} from "react-icons/io";
import {RxReset} from "react-icons/rx";
import './Editor.css'
import { SegmentedControl } from '@mantine/core';
import {type GameState} from "../tetris/props.ts";
import {type GameModeName, Modes} from "../tetris/GameMode.ts";

interface GameEditorProps {
    stateSetter: React.Dispatch<React.SetStateAction<GameState>>;
    initialState: GameState
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
                        this.props.stateSetter((prev) => {
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
                                this.props.stateSetter(prev => {
                                    return {
                                        ...prev,
                                        numRows: prev.numRows + 1,
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className="circle-container">
                        <RxReset
                            className="reset-button manipulator"
                            onClick={() => {
                                this.props.stateSetter(prev => {
                                    return {
                                        ...prev,
                                        numRows: this.props.initialState.numRows,
                                    }
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}