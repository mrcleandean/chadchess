import Game from "./Game";
import GameChat from "./GameChat";
import { useState, useEffect } from "react";

const Online = () => {
    const [chatOpen, setChatOpen] = useState(false);
    useEffect(() => {
        if (window.innerWidth >= 768) {
            setChatOpen(true);
        }
    }, []);
    return (
        <div className='w-full flex flex-col md:flex-row'>
            <div className={`${chatOpen ? 'w-full md:w-[50%]' : 'w-full'} flex flex-col items-center`}>
                <Game setChatOpen={setChatOpen} />
            </div>
            <div className={`${chatOpen ? 'w-full md:w-[50%]' : 'w-0'}`}>
                <GameChat chatOpen={chatOpen} setChatOpen={setChatOpen} />
            </div>
        </div>
    )
}

export default Online;