import React from "react";

export interface ScoreComponentProps {
    children: React.ReactNode;
}

export const StatEntry: React.FunctionComponent<ScoreComponentProps> = (props: ScoreComponentProps) => {
    return <div className='ml-5 mt-4'>
        {props.children}
    </div>
}
