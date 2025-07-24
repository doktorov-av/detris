import React from 'react';
import {IoIosAdd} from "react-icons/io";
import {RxReset} from "react-icons/rx";
import './editor.css'
import { SegmentedControl } from '@mantine/core';
import {type GameState} from "../tetris/props.ts";
import {GameMode} from "../tetris/gameMode.ts";

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
                    data={Object.values(GameMode).filter(
                        (value) => typeof value === 'string'
                    )}
                    onChange={value => {
                        this.props.stateSetter((prev) => {
                            return {
                                ...prev,
                                mode: GameMode[value as keyof typeof GameMode]
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