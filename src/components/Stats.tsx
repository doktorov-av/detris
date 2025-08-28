import React, {useContext} from 'react'
import type {GameMode} from "../tetris/GameMode.ts";
import {ModeContext} from "../contexts/Contexts.ts";
import {ModeSchemes} from "../tuning/ModeSchemes.ts";

interface StatsProps {
    children: React.ReactNode;
}

export const Stats: React.FunctionComponent<StatsProps> = (props: StatsProps) => {
    const mode: GameMode = useContext(ModeContext)

    return <div
        className="flex-col w-30 sm:w-40 items-start justify-items-start border-r-2 border-t-2 border-b-2 border-amber-800 rounded-r-sm font-semibold"
        style={{
            borderColor: ModeSchemes[mode].color,
            backgroundColor: `color-mix(in srgb, ${ModeSchemes[mode].color}, black)`
        }}>
        {props.children}
    </div>
}