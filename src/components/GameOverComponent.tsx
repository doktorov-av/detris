import React from "react";

export const GameOverComponent: React.FC = () => {
    return <div className='flex place-items-center justify-center m-5 w-auto font-medium text-black bg-red-500 rounded-full animate-pulse'>
        Game over!
    </div>
}