import React from "react";
import DropList from "./DropList.tsx";
import Key from "./Key.tsx";

const desktopControls = [
    {action: 'Rotate', keys: ['R']},
    {action: 'Down', keys: ['S']},
    {action: 'Left', keys: ['A']},
    {action: 'Right', keys: ['D']},
    {action: 'Drop', keys: ['Space']},
];

const mobileControls = [
    {action: 'Rotate', keys: ['Swipe Up']},
    {action: 'Down', keys: ['Drag Down']},
    {action: 'Left', keys: ['Drag Left']},
    {action: 'Right', keys: ['Drag Right']},
    {action: 'Drop', keys: ['Double tap']},
];

const Controls: React.FunctionComponent = () => {
    return <div className="flex space-x-5 m-auto sm:mt-0 sm:ml-5">
        <DropList listName="Desktop Controls">
            <ul className='space-y-2'>
                {desktopControls.map((control, index) => (
                    <li key={index}
                        className="flex items-center justify-between p-3 space-x-2 bg-gray-50 rounded-lg first:mt-5">
                        <span className="text-gray-700">{control.action}</span>
                        <div className="flex items-center">
                            <Key>
                                {control.keys[0]}
                            </Key>
                        </div>
                    </li>
                ))}
            </ul>
        </DropList>
        <DropList listName="Mobile Controls">
            <ul className='space-y-2'>
                {mobileControls.map((control, index) => (
                    <li key={index}
                        className="flex items-center justify-between p-3 space-x-2 bg-gray-50 rounded-lg first:mt-5">
                        <span className="text-gray-700">{control.action}</span>
                        <div className="flex items-center">
                            <Key>
                                {control.keys[0]}
                            </Key>
                        </div>
                    </li>
                ))}
            </ul>
        </DropList>
    </div>
}

export default Controls;