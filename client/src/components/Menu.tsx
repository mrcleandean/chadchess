import { type ChangeEvent, type Dispatch, type KeyboardEvent, type SetStateAction, useEffect, useState } from "react";
import { chest, gigachad, liam, mega, rambo, squidward, stewie, tate } from "../assets";
import { AiOutlineArrowRight, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { usePlayerContext } from "../hooks/usePlayerContext";
import { AnimatePresence, motion } from "framer-motion"
import { BsFillChatDotsFill } from 'react-icons/bs'
import { User } from "../../../server/src/game";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export type LobbyState = {
    pictureDisplay: boolean;
    nameText: string;
    finding: boolean;
}

const characters = [rambo, stewie, tate, mega, chest, squidward, liam, gigachad];

const Menu = ({ chatOpen, setChatOpen }: { chatOpen: boolean; setChatOpen: Dispatch<SetStateAction<boolean>> }) => {
    const navigate = useNavigate();
    const { user, setUser, connected } = usePlayerContext()
    const [menuDisplay, setMenuDisplay] = useState<LobbyState>({
        pictureDisplay: false,
        nameText: '',
        finding: false
    })
    const changeName = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setUser(prev => ({
                ...prev,
                username: menuDisplay.nameText.slice(0, 17)
            }))
            setMenuDisplay(prev => ({
                ...prev,
                nameText: ''
            }))
        }
    }
    const togglePictureDisplay = () => {
        setMenuDisplay(prev => ({
            ...prev,
            pictureDisplay: !prev.pictureDisplay
        }))
    }
    const changePicture = (character: string) => {
        setUser(prev => ({
            ...prev,
            pic: character
        }))
    }
    const changeNameText = (e: ChangeEvent<HTMLInputElement>) => {
        setMenuDisplay(prev => ({
            ...prev,
            nameText: e.target.value
        }))
    }
    const findGame = () => {
        if (user.id && socket.id) {
            socket.emit('find-game', user as User);
        }
    }
    useEffect(() => {
        socket.on('find-game-cancelled', () => {
            setMenuDisplay(prev => ({
                ...prev,
                finding: false
            }))
        });
        socket.on('find-game-pending', () => {
            setMenuDisplay(prev => ({
                ...prev,
                finding: true
            }))
        });
        socket.on('game-found', () => {
            navigate('/online');
        });
        return () => {
            socket.off('find-game-cancelled');
            socket.off('find-game-pending');
            socket.off('game-found');
        }
    }, [socket]);
    return (
        <div className="relative w-full mt-5 max-w-3xl">
            <div className="flex flex-col items-center">
                <div className="w-full h-fit flex flex-wrap gap-2 justify-evenly">
                    <div className="relative">
                        <img
                            className="w-28 h-28 object-contain rounded-lg cursor-pointer hover:scale-105 transition-all z-20 relative"
                            src={user.pic ? user.pic : gigachad}
                            onClick={togglePictureDisplay}
                        />
                        <motion.p
                            initial="show"
                            animate={menuDisplay.pictureDisplay ? 'hidden' : 'show'}
                            variants={{
                                hidden: { opacity: 0 },
                                show: { opacity: 1 }
                            }}
                            className="absolute text-secondary font-semibold text-[10px]">Click to change</motion.p>
                        <motion.div
                            className={'absolute z-10 overflow-x-auto mt-2 h-18 w-32'}
                            initial="hidden"
                            animate={menuDisplay.pictureDisplay ? 'show' : 'hidden'}
                            variants={{
                                hidden: {
                                    y: "-100%",
                                    x: '-0.5rem',
                                    opacity: 0,
                                    transition: {
                                        type: 'tween',
                                        ease: "linear",
                                        duration: 0.2
                                    }
                                },
                                show: {
                                    y: 0,
                                    opacity: 1,
                                    x: '-0.5rem',
                                    transition: {
                                        type: 'tween',
                                        ease: "linear",
                                        duration: 0.2
                                    }
                                }
                            }}
                        >
                            <div className={`flex gap-1 ${menuDisplay.pictureDisplay ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                                {characters.map((character, i) => {
                                    return (
                                        <img
                                            alt="picture option"
                                            key={i}
                                            src={character}
                                            className="w-14 h-14 object-contain rounded-xl cursor-pointer z-0 border-2 border-primary"
                                            onClick={() => changePicture(character)}
                                        />
                                    )
                                })}
                            </div>
                            <p className="text-secondary flex items-center font-semibold ml-1 text-[0.85rem]">Scroll <AiOutlineArrowRight size={'1rem'} className="ml-1" /></p>
                        </motion.div>
                    </div>

                    <div className="flex flex-col gap-1 -mt-0.5">
                        <div className="flex justify-between">
                            <div className="flex items-center relative top-2">
                                <div className={`${connected ? 'bg-lime-600' : 'bg-red-500'} rounded-full w-2 h-2 ml-0.5 -mb-1.5`} />
                                <div className={`${connected ? 'text-lime-600' : 'text-red-500'} ml-0.5 -mb-1.5 text-xs`}>{connected ? 'Online' : 'Offline'}</div>
                            </div>
                            <button
                                onClick={() => setChatOpen(prev => !prev)}
                                className="bg-secondary text-white p-1.5 text-xs relative top-5 right-1 rounded-xl flex gap-1 items-center justify-between"
                            >
                                {chatOpen ? 'Close' : 'Open'} {<BsFillChatDotsFill color="white" size={16} />}
                            </button>
                        </div>
                        <div className="-mt-0.5 flex flex-col">
                            <label className="text-secondary font-semibold ml-0.5">Username</label>
                            <input
                                type="text"
                                placeholder="gigachad"
                                className="h-10 w-44 rounded-xl border-[1px] border-secondary bg-white text-secondary pl-2"
                                onChange={changeNameText}
                                onKeyDown={changeName}
                                value={menuDisplay.nameText}
                                name='nameText'
                            />
                            <h1 className={`${user.username === '' ? 'p-0' : 'p-[0.12rem]'} text-white font-medium mt-1.5 bg-secondary w-fit rounded-lg tracking-widest`}>{user.username}</h1>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3 justify-evenly items-center mt-7 relative z-0">
                    <button
                        className={`${socket ? 'bg-secondary' : 'bg-[rgb(129,158,238)] pointer-events-none'} w-44 h-14 cursor-pointer rounded-2xl flex justify-center items-center drop-shadow-[0px_2.2px_2.2px_black] hover:scale-105 transition-all`}
                        onClick={findGame}
                    >
                        <p className="text-white tracking-wide font-semibold text-lg">Find Game</p>
                    </button>
                    <div className={`w-12 h-16 pointer-events-none flex justify-center items-center`}>
                        <AnimatePresence>
                            {menuDisplay.finding && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <div className=" animate-spin w-12 h-12 flex justify-center items-center">
                                        <AiOutlineLoading3Quarters size={30} className="text-secondary" />
                                    </div>
                                    <p className="text-[11px] text-secondary font-extrabold">Finding...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Menu