import { AnimatePresence, motion } from "framer-motion";
import { socket } from "../socket";
import Game from "./Game";
import GameChat from "./GameChat";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type OutcomeType = {
    by: 'pending' | 'checkmate' | 'stalemate' | 'resign' | 'flag';
    winner: 'pending' | 'user' | 'opponent' | 'draw';
}

const Online = () => {
    const navigation = useNavigate();
    const [chatOpen, setChatOpen] = useState(false);
    const [numOfChats, setNumOfChats] = useState(0);
    const [outcome, setOutcome] = useState<OutcomeType>({
        by: 'pending',
        winner: 'pending'
    })
    useEffect(() => {
        if (!socket.id) {
            navigation('/');
            return;
        }
        socket.on('no-game-found', () => {
            navigation('/');
        })
        socket.on('opponent-flagged', () => {
            setOutcome(prev => ({
                ...prev,
                by: 'flag',
                winner: 'user'
            }));
        });
        socket.on('opponent-resigned', () => {
            setOutcome(prev => ({
                ...prev,
                by: 'resign',
                winner: 'user'
            }));
        });
        return () => {
            socket.off('no-game-found');
            socket.off('opponent-flagged');
            socket.off('opponent-resigned');
        }
    }, [socket]);

    useEffect(() => {
        setNumOfChats(0);
    }, [chatOpen]);

    return (
        <div className='w-full flex flex-col md:flex-row h-full items-center relative'>
            <div className={`${chatOpen ? 'w-full md:w-[50%]' : 'w-full'} h-full flex flex-col items-center`}>
                <Game
                    setChatOpen={setChatOpen}
                    outcome={outcome}
                    numOfChats={numOfChats}
                    setOutcome={setOutcome}
                />
                <AnimatePresence>
                    {outcome.winner !== 'pending' && (
                        <motion.div
                            initial={{
                                x: "50%",
                                y: "50%",
                                scale: 0
                            }}
                            animate={{
                                scale: 1,
                                x: "0%",
                                y: "0%",
                                translateX: "50%",
                                translateY: "-50%",
                            }}
                            exit={{
                                x: "50%",
                                y: "50%",
                                scale: 0
                            }}
                            className="absolute z-[60] w-96 h-64 bg-primary border-secondary border-2 rounded-lg shadow-lg top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="w-full bg-secondary flex items-center justify-center py-2 border border-primary rounded-lg">
                                <h1 className="text-primary text-xl font-bold">
                                    {outcome.winner === 'user'
                                        ? 'You win!'
                                        : outcome.winner === 'opponent'
                                            ? 'You lose!'
                                            : outcome.winner === 'draw'
                                                ? 'Draw.'
                                                : 'No game found.'
                                    }
                                </h1>
                            </div>
                            <div className="w-full p-5 flex items-center justify-center">
                                <p className="text-black text-lg font-medium">{
                                    outcome.winner === 'user' ? (
                                        outcome.by === 'flag' ? 'Opponent flagged.' : outcome.by === 'resign' ? 'Opponent resigned.' : outcome.by === 'checkmate' ? 'You checkmated the opponent.' : ''
                                    ) : outcome.winner === 'opponent' ? (
                                        outcome.by === 'flag' ? 'You flagged.' : outcome.by === 'resign' ? 'You resigned.' : outcome.by === 'checkmate' ? 'You got checkmated.' : ''
                                    ) : outcome.winner === 'draw' ? (
                                        'By stalemate.'
                                    ) : ''
                                }</p>
                            </div>
                            <div className="w-full flex justify-center py-10 bottom-0 absolute">
                                <button
                                    onClick={() => {
                                        navigation('/');
                                    }}
                                    className="bg-secondary rounded-lg px-5 py-3 shadow-2xl cursor-pointer hover:bg-secondary/70 transition-colors"
                                >
                                    <h1 className="text-primary text-xl">Home</h1>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className={`${chatOpen ? 'w-full md:w-[50%]' : 'w-0'} h-full`}>
                <GameChat chatOpen={chatOpen} setChatOpen={setChatOpen} setNumOfChats={setNumOfChats} />
            </div>
        </div>
    )
}

export default Online;