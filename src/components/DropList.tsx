import React, {useState} from "react";
import {MdExpandLess as HideIcon, MdExpandMore as ShowIcon} from "react-icons/md";

export interface DropListProps {
    listName?: string;
    children: React.ReactNode;
}

const DropList: React.FunctionComponent<DropListProps> = (props: DropListProps) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <div>
            <button
                className={`flex items-center justify-between bg-black text-white rounded-lg px-4 py-2
          transition-all duration-500 ease-in-out border border-transparent
          hover:border-blue-300 hover:scale-105`}
                onClick={() => setVisible(!visible)}
            >
                <span className='sm:text-sm'>{props.listName ?? "DropList"}</span>
                {visible ? <HideIcon/> : <ShowIcon/>}
            </button>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${visible ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {props.children}
            </div>
        </div>
    );
};

export default DropList;