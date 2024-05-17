import { Chessboard } from "react-chessboard"
import { BsFillChatDotsFill, BsFlagFill } from 'react-icons/bs'
import { FaHandshake } from 'react-icons/fa'
import { Square } from "react-chessboard/dist/chessboard/types"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { usePlayerContext } from "../hooks/usePlayerContext";
import { gigachad } from '../assets';
import { socket } from "../socket"
import { Chat, ClientUser } from "../server/src/lobby";
import { MoveType } from "../server/src/socket";
import Timer from "./Timer";
import { OutcomeType } from "./Online";
import { useNavigate } from "react-router-dom";

export type GameType = {
    fen: 'start' | string;
    side: 'white' | 'black';
    turn: 'white' | 'black';
}

function Game({ setChatOpen, outcome, numOfChats, setOutcome }: { setChatOpen: Dispatch<SetStateAction<boolean>>, outcome: OutcomeType, numOfChats: number, setOutcome: Dispatch<SetStateAction<OutcomeType>> }) {
    const { user } = usePlayerContext();
    const navigator = useNavigate();
    const [opponent, setOpponent] = useState<ClientUser>({ pic: '', username: '', id: undefined })
    const [game, setGame] = useState<GameType>({
        fen: 'start',
        side: 'white',
        turn: 'white'
    })
    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        const move = { from: sourceSquare, to: targetSquare, promotion: 'q' } as MoveType;
        if (socket.id) {
            socket.emit('move', move);
        }
        return true;
    }

    const resign = () => {
        if (socket.id) {
            socket.emit('resign');
            navigator('/');
        }
    }

    useEffect(() => {
        if (socket.id) {
            socket.emit('game-requested');
        }
        socket.on('game-recieved', (opponent: ClientUser, side) => {
            setGame(prev => ({
                ...prev,
                side
            }));
            setOpponent(opponent);
        });
        socket.on('update-board', (fen: string, turn: 'white' | 'black') => {
            setGame(prev => ({
                ...prev,
                fen,
                turn
            }))
        });
        return () => {
            socket.off('game-recieved');
            socket.off('update-board');
        }
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-md">
            <div className="w-[90%] flex justify-center flex-col relative">
                <div className="flex justify-between h-18 w-full mb-2 p-2 rounded-lg">
                    <div className="flex gap-3">
                        <img
                            alt="opponent profile picture"
                            src={opponent.pic ? opponent.pic : gigachad}
                            className="w-16 h-16 rounded-lg border-[1px] border-secondary"
                        />
                        <div>
                            <p className="bg-secondary text-white rounded-lg mt-[0.0725rem] pr-1 pl-1 pt-0.5 pb-0.5">{opponent.username === '' ? 'Unnamed Chad' : opponent.username}</p>
                        </div>
                    </div>

                    <div className="bg-secondary p-4 rounded-lg flex justify-center itemes-center">
                        <Timer
                            me={false}
                            active={game.turn !== game.side && outcome.winner === 'pending'}
                            setOutcome={setOutcome}
                        />
                    </div>
                </div>
                <div className='w-full'>
                    <div className="p-0.5 rounded-md violet-gradient">
                        <Chessboard
                            arePremovesAllowed={false}
                            onPieceDrop={onDrop}
                            boardOrientation={game.side}
                            arePiecesDraggable={game.turn === game.side}
                            position={game.fen}
                            id="BasicBoard"
                            customDarkSquareStyle={{ backgroundColor: "#6380e4" }}
                            customLightSquareStyle={{ backgroundColor: 'white' }}
                            customBoardStyle={{ borderRadius: '6px' }}
                        />
                    </div>
                    <div className="flex justify-between h-18 w-full mt-2 p-2 rounded-lg">
                        <div className="flex gap-3">
                            <img
                                alt="player profile picture"
                                src={user.pic ? user.pic : gigachad}
                                className="w-16 h-16 rounded-lg border-[1px] border-secondary"
                            />
                            <div>
                                <p className="bg-secondary text-white rounded-lg mt-[0.0725rem] pr-1 pl-1 pt-0.5 pb-0.5">{user.username === '' ? 'Unnamed Chad' : user.username}</p>
                            </div>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg flex justify-center itemes-center">
                            <Timer
                                me={true}
                                active={game.turn === game.side && outcome.winner === 'pending'}
                                setOutcome={setOutcome}
                            />
                        </div>
                    </div>
                    <div className="w-full h-12 flex justify-around items-center mt-2">
                        <button className="relative flex flex-col items-center justify-center cursor-pointer" onClick={() => setChatOpen(prev => !prev)}>
                            <BsFillChatDotsFill color="#6380e4" size={24} />
                            <p className="text-xs text-secondary">Chat</p>
                            {numOfChats > 0 && (
                                <div className="absolute -top-2 -right-2 bg-secondary w-4 h-4 rounded-full flex items-center justify-center">
                                    <p className="text-primary text-xs">{numOfChats}</p>
                                </div>
                            )}
                        </button>
                        <button className="flex flex-col items-center justify-center cursor-pointer" onClick={resign}>
                            <BsFlagFill color="#6380e4" size={24} />
                            <p className="text-xs text-secondary">Resign</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game