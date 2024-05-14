import { usePlayerContext } from "../hooks/usePlayerContext";

import { Chat } from "../server/src/lobby";
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import formatDate from "../util/formatDate";
import { socket } from "../socket";

const HomeChat = ({ chatOpen, setChatOpen }: { chatOpen: boolean, setChatOpen: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = usePlayerContext();
    const wordLimit = 200;
    const [chats, setChats] = useState<Chat[]>([]);
    const [message, setMessage] = useState<string>('');
    const chatArrayAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on('global-chat', (chat: Chat) => {
            setChats(prev => [...prev, chat])
        })
        return () => {
            socket.off('global-chat');
        }
    }, [socket]);

    useEffect(() => {
        chatArrayAreaRef.current?.scrollTo(0, chatArrayAreaRef.current.scrollHeight);
    }, [chats]);


    const sendChat = () => {
        if (!message || message.length > wordLimit) return;
        socket.emit('global-chat', { message, user, time: new Date() })
        setMessage('');
    }

    return (
        <div className={`${chatOpen ? 'flex' : 'hidden'} bg-primary absolute bottom-0 z-50 md:relative w-full h-[calc(100vh-2.5rem)] flex-col justify-end`}>
            <button
                onClick={() => setChatOpen(prev => !prev)}
                className="md:hidden bg-secondary text-white p-1.5 text-xs absolute z-[60] top-3 left-3 rounded-xl flex gap-1 items-center justify-between border-2 border-primary"
            >
                {chatOpen ? 'Close' : 'Open'} {<BsFillChatDotsFill color="white" size={16} />}
            </button>
            <div
                ref={chatArrayAreaRef}
                className='w-full flex flex-col overflow-scroll gap-2 mb-2 mt-2 p-2'
            >
                {chats.map((chat, i) => (
                    <div className='w-full bg-gray-200 rounded-xl' key={i}>
                        <div className='flex justify-between items-center p-1 bg-secondary text-sm text-white rounded-t-xl'>
                            <div className="flex gap-1 justify-center items-center">
                                <div className='w-7 h-7 rounded-full overflow-hidden relative'>
                                    <img
                                        alt='dev logo'
                                        src={chat.user.pic}
                                        className="object-contain"
                                    />
                                </div>
                                <h1>{chat.user.username ? chat.user.username : 'Anonymous Chad'}</h1>
                            </div>
                            <h1 className="ml-4">{formatDate(chat.time)}</h1>
                        </div>
                        <h1 className='text-secondary text-sm p-1.5 break-words'>{chat.message}</h1>
                    </div>
                ))}
            </div>
            <div className={`${socket ? '' : 'pointer-events-none'} w-full flex rounded-xl p-2 pt-0`}>
                <textarea
                    className='bg-gray-200 w-full h-20 text-secondary resize-none p-2 rounded-l-lg border-none outline-none'
                    placeholder={socket ? 'Say hi to fellow Chads!' : 'Fix your connection to chat.'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendChat();
                        }
                    }}
                />
                <button
                    className='bg-secondary text-white w-20 transition-all duration-75 rounded-r-lg flex flex-col items-center justify-center gap-0.5'
                    onClick={sendChat}
                >
                    <p>Send</p>
                    <p className={`${message.length <= wordLimit ? 'text-white' : 'text-red-500 font-semibold'} text-[0.68rem]`}>{message.length}/{wordLimit}</p>
                </button>
            </div>
        </div>
    )
}

export default HomeChat;